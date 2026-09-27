import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { env, isConfigured } from "@/lib/server/env";
import { bx, BX_FIELD, firstValue } from "@/lib/server/bitrix";
import { buildUserData, sendCapi } from "@/lib/server/meta-capi";
import { sendTelegram, escapeHtml } from "@/lib/server/telegram";
import { normalizeUzPhone } from "@/lib/phone";
import { parseJsonSafe, TrackingData } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sotib olgan mijozni Meta CAPI ga "Purchase" sifatida yuborish.
 *
 * Ikki usulda chaqiriladi:
 *  A) Bitrix24 robot "Vebhuk" (tavsiya etiladi) — bitim "Muvaffaqiyatli" bosqichiga o‘tganda:
 *     https://SAYT/api/bitrix/purchase?secret=PURCHASE_WEBHOOK_SECRET&deal_id={{ID}}
 *  B) Bitrix24 chiquvchi vebhuk (ONCRMDEALUPDATE) — application_token = BITRIX24_APP_TOKEN
 *
 * Bitim faqat STAGE_SEMANTIC_ID = "S" (muvaffaqiyatli yopilgan) bo‘lsa yuboriladi.
 * Qayta yuborilmasligi uchun bitimda UF_CRM_FAZZA_CAPI = "Y" belgisi qo‘yiladi.
 */
export async function GET(req: NextRequest) {
  return handle(req, new URLSearchParams());
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  let form = new URLSearchParams();
  try {
    if (ct.includes("application/json")) {
      const j = await req.json();
      form = new URLSearchParams(flatten(j));
    } else {
      form = new URLSearchParams(await req.text());
    }
  } catch {
    /* bo‘sh body */
  }
  return handle(req, form);
}

async function handle(req: NextRequest, form: URLSearchParams) {
  const q = req.nextUrl.searchParams;
  const get = (k: string) => q.get(k) || form.get(k) || "";

  // --- Avtorizatsiya ---
  const secret = get("secret");
  const appToken = form.get("auth[application_token]") || "";
  const authorized =
    (env.purchaseSecret && safeEq(secret, env.purchaseSecret)) ||
    (env.bitrix.appToken && safeEq(appToken, env.bitrix.appToken));
  if (!authorized) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  if (!isConfigured.bitrix()) return NextResponse.json({ ok: false, error: "BITRIX24_WEBHOOK_URL yo‘q" }, { status: 500 });

  const dealId = get("deal_id") || get("id") || form.get("data[FIELDS][ID]") || "";
  if (!/^\d+$/.test(dealId)) return NextResponse.json({ ok: false, error: "deal_id topilmadi" }, { status: 400 });
  const force = get("force") === "1";

  try {
    const deal = await bx<Record<string, any>>("crm.deal.get", { id: dealId });

    if (deal.STAGE_SEMANTIC_ID !== "S") {
      return NextResponse.json({ ok: true, skipped: "bitim muvaffaqiyatli yopilmagan", stage: deal.STAGE_ID });
    }
    if (!force && String(deal[BX_FIELD.capiSent] || "") === "Y") {
      return NextResponse.json({ ok: true, skipped: "allaqachon yuborilgan" });
    }

    // Kontakt ma'lumotlari
    let phone: string | undefined;
    let email: string | undefined;
    let firstName: string | undefined;
    let lastName: string | undefined;
    if (deal.CONTACT_ID && Number(deal.CONTACT_ID) > 0) {
      const c = await bx<Record<string, any>>("crm.contact.get", { id: deal.CONTACT_ID }).catch(() => null);
      if (c) {
        phone = firstValue(c.PHONE);
        email = firstValue(c.EMAIL);
        firstName = c.NAME || undefined;
        lastName = c.LAST_NAME || undefined;
      }
    }

    // Tracking: avval bitimdan, bo‘lmasa manba liddan
    let tracking = parseJsonSafe<TrackingData>(deal[BX_FIELD.tracking]);
    if (deal.LEAD_ID && Number(deal.LEAD_ID) > 0) {
      const lead = await bx<Record<string, any>>("crm.lead.get", { id: deal.LEAD_ID }).catch(() => null);
      if (lead) {
        tracking = tracking || parseJsonSafe<TrackingData>(lead[BX_FIELD.tracking]);
        phone = phone || firstValue(lead.PHONE);
        email = email || firstValue(lead.EMAIL);
        firstName = firstName || lead.NAME || undefined;
        lastName = lastName || lead.LAST_NAME || undefined;
      }
    }

    const value = Number(deal.OPPORTUNITY || 0);
    const currency = String(deal.CURRENCY_ID || env.defaultCurrency).toUpperCase();
    const normPhone = phone ? normalizeUzPhone(phone) : undefined;

    const capi = await sendCapi([
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `deal_${dealId}`,
        action_source: env.meta.purchaseActionSource,
        event_source_url: tracking?.url || env.siteUrl,
        user_data: buildUserData({
          phone: normPhone,
          email,
          firstName,
          lastName,
          ip: tracking?.ip,
          ua: tracking?.ua,
          fbp: tracking?.fbp,
          fbc: tracking?.fbc,
        }),
        custom_data: {
          value,
          currency,
          order_id: String(dealId),
          content_name: deal.TITLE || "Strategik sessiya",
          content_type: "product",
        },
      },
    ]);

    if (capi.ok) {
      await bx("crm.deal.update", { id: dealId, fields: { [BX_FIELD.capiSent]: "Y" } }).catch((e) =>
        console.warn("[Bitrix24] CAPI belgisini qo‘yib bo‘lmadi (bitrix:setup ishga tushirilganmi?)", String(e))
      );
    }

    await sendTelegram(
      [
        capi.ok ? `💰 <b>Sotuv Meta'ga yuborildi</b>` : `⚠️ <b>Sotuv Meta'ga yuborilmadi</b>`,
        `🗂 Bitim #${dealId}: ${escapeHtml(deal.TITLE || "")}`,
        `💵 Summa: ${escapeHtml(value.toLocaleString("ru-RU"))} ${escapeHtml(currency)}`,
        tracking?.fbc || tracking?.fbp ? `🎯 Meta identifikatori bor (fbp/fbc)` : `ℹ️ fbp/fbc yo‘q — telefon orqali moslashtiriladi`,
        !capi.ok && (capi.error || capi.skipped) ? `Xato: ${escapeHtml((capi.error || capi.skipped || "").slice(0, 300))}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );

    return NextResponse.json({ ok: capi.ok, dealId, value, currency, meta: capi.ok ? "sent" : capi.skipped || capi.error });
  } catch (e) {
    console.error("[Purchase] xato", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

function safeEq(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function flatten(obj: any, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === "object") Object.assign(out, flatten(v, key));
    else out[key] = String(v ?? "");
  }
  return out;
}
