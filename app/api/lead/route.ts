import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { collectTracking } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { env, isConfigured } from "@/lib/server/env";
import { sendTelegram, escapeHtml } from "@/lib/server/telegram";
import { bx, BX_FIELD } from "@/lib/server/bitrix";
import { buildUserData, sendCapi, splitName } from "@/lib/server/meta-capi";
import { formatUzPhone, isValidUzPhone, normalizeUzPhone } from "@/lib/phone";
import { packageLabels } from "@/lib/content";
import { UTM_KEYS } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Ismingizni kiriting").max(80),
  phone: z.string().trim().refine(isValidUzPhone, "Telefon raqam noto‘g‘ri"),
  company: z.string().trim().max(120).optional().default(""),
  position: z.string().trim().max(80).optional().default(""),
  employees: z.string().trim().max(20).optional().default(""),
  package: z.string().trim().max(30).optional().default("unknown"),
  source: z.string().trim().max(40).optional().default("site"),
  pageUrl: z.string().trim().max(1000).optional().default(""),
  eventId: z.string().trim().min(8).max(80),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  website: z.string().optional(), // honeypot — bot to‘ldiradi
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto‘g‘ri so‘rov" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Ma’lumotlar noto‘g‘ri" },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // Honeypot: bot bo‘lsa jim muvaffaqiyat qaytaramiz
  if (d.website) return NextResponse.json({ ok: true, eventId: d.eventId });

  const tracking = collectTracking(req, {
    url: d.pageUrl,
    eventId: d.eventId,
    utm: pickUtm(d.utm),
  });

  if (!rateLimit(`lead:${tracking.ip || "unknown"}`)) {
    return NextResponse.json({ ok: false, error: "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring." }, { status: 429 });
  }

  const phone = normalizeUzPhone(d.phone);
  const phonePretty = formatUzPhone(d.phone);
  const pkg = packageLabels[d.package] || packageLabels.unknown;
  const { firstName, lastName } = splitName(d.name);

  // 1) Bitrix24 — lid yaratish
  let bitrixLeadId: number | undefined;
  let bitrixError: string | undefined;
  if (isConfigured.bitrix()) {
    try {
      const utm = tracking.utm || {};
      bitrixLeadId = await bx<number>("crm.lead.add", {
        fields: {
          TITLE: `Strategik sessiya — ${d.company || d.name}`,
          NAME: firstName,
          LAST_NAME: lastName,
          COMPANY_TITLE: d.company || undefined,
          POST: d.position || undefined,
          PHONE: [{ VALUE: `+${phone}`, VALUE_TYPE: "WORK" }],
          SOURCE_ID: "WEB",
          SOURCE_DESCRIPTION: `Sayt: Strategik sessiya | forma: ${d.source}`,
          ASSIGNED_BY_ID: env.bitrix.assignedById || undefined,
          COMMENTS: [
            `Paket: ${pkg}`,
            d.employees ? `Xodimlar soni: ${d.employees}` : "",
            d.position ? `Lavozim: ${d.position}` : "",
            `Forma: ${d.source}`,
            d.pageUrl ? `Sahifa: ${d.pageUrl}` : "",
          ]
            .filter(Boolean)
            .join("<br>"),
          UTM_SOURCE: utm.utm_source,
          UTM_MEDIUM: utm.utm_medium,
          UTM_CAMPAIGN: utm.utm_campaign,
          UTM_CONTENT: utm.utm_content,
          UTM_TERM: utm.utm_term,
          [BX_FIELD.tracking]: JSON.stringify(tracking),
        },
        params: { REGISTER_SONET_EVENT: "Y" },
      });
    } catch (e) {
      bitrixError = String(e);
      console.error("[Bitrix24] lid xatosi", e);
    }
  }

  // 2) Telegram va 3) Meta CAPI — parallel
  const utmLine = tracking.utm
    ? Object.entries(tracking.utm)
        .map(([k, v]) => `${k.replace("utm_", "")}: ${escapeHtml(v)}`)
        .join(" · ")
    : "";

  const tgText = [
    `🟢 <b>Yangi lid — Strategik sessiya</b>`,
    ``,
    `👤 <b>Ism:</b> ${escapeHtml(d.name)}`,
    `📞 <b>Telefon:</b> <a href="tel:+${phone}">${escapeHtml(phonePretty)}</a>`,
    d.company ? `🏢 <b>Kompaniya:</b> ${escapeHtml(d.company)}` : "",
    d.position ? `💼 <b>Lavozim:</b> ${escapeHtml(d.position)}` : "",
    d.employees ? `👥 <b>Xodimlar:</b> ${escapeHtml(d.employees)}` : "",
    `📦 <b>Paket:</b> ${escapeHtml(pkg)}`,
    `📍 <b>Forma:</b> ${escapeHtml(d.source)}`,
    utmLine ? `🎯 <b>UTM:</b> ${utmLine}` : "",
    bitrixLeadId ? `🗂 <b>Bitrix24 lid:</b> #${bitrixLeadId}` : bitrixError ? `⚠️ <b>Bitrix24 xato:</b> ${escapeHtml(bitrixError.slice(0, 200))}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  const sendMeta = !env.meta.requireConsent || tracking.consent;

  const [tg, capi] = await Promise.all([
    sendTelegram(tgText),
    sendMeta
      ? sendCapi([
          {
            event_name: "Lead",
            event_time: tracking.ts,
            event_id: d.eventId, // brauzer Pixel bilan bir xil — dublikat bo‘lmaydi
            action_source: "website",
            event_source_url: d.pageUrl || env.siteUrl,
            user_data: buildUserData({
              phone,
              firstName,
              lastName,
              ip: tracking.ip,
              ua: tracking.ua,
              fbp: tracking.fbp,
              fbc: tracking.fbc,
            }),
            custom_data: {
              content_name: "Strategik sessiya",
              content_category: pkg,
              lead_source: d.source,
            },
          },
        ])
      : Promise.resolve({ ok: false, skipped: "rozilik yo‘q" }),
  ]);

  const delivered = Boolean(bitrixLeadId) || tg.ok;
  const anyConfigured = isConfigured.bitrix() || isConfigured.telegram();

  if (!anyConfigured) {
    console.warn("[Lead] Telegram ham, Bitrix24 ham sozlanmagan. Lid faqat logga yozildi:", { ...d, phone });
  }

  if (anyConfigured && !delivered) {
    return NextResponse.json(
      { ok: false, error: "Arizani yuborishda xatolik. Iltimos, telefon orqali bog‘laning." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    eventId: d.eventId,
    integrations: {
      bitrix: bitrixLeadId ? "ok" : bitrixError ? "error" : "skipped",
      telegram: tg.ok ? "ok" : tg.skipped ? "skipped" : "error",
      meta: capi.ok ? "ok" : capi.skipped ? "skipped" : "error",
    },
  });
}

function pickUtm(u?: Record<string, string>) {
  if (!u) return undefined;
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) if (u[k]) out[k] = u[k];
  return Object.keys(out).length ? out : undefined;
}
