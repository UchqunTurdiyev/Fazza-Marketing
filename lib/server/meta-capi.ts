import "server-only";
import { createHash } from "crypto";
import { env, isConfigured } from "./env";
import { normalizeUzPhone } from "@/lib/phone";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const norm = (v?: string) => (v || "").trim().toLowerCase();
const hashIf = (v?: string) => (norm(v) ? sha256(norm(v)) : undefined);

export type CapiUserInput = {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  country?: string;
};

export function buildUserData(u: CapiUserInput) {
  const phone = u.phone ? normalizeUzPhone(u.phone) : "";
  const data: Record<string, unknown> = {
    ph: phone ? [sha256(phone)] : undefined,
    em: u.email ? [hashIf(u.email)] : undefined,
    fn: u.firstName ? [hashIf(u.firstName)] : undefined,
    ln: u.lastName ? [hashIf(u.lastName)] : undefined,
    country: [sha256(norm(u.country || "uz"))],
    // external_id: Lead va Purchase eventlarida bir xil bo‘lishi uchun telefon asosida
    external_id: u.externalId ? [sha256(norm(u.externalId))] : phone ? [sha256(phone)] : undefined,
    client_ip_address: u.ip,
    client_user_agent: u.ua,
    fbp: u.fbp,
    fbc: u.fbc,
  };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return data;
}

export type CapiEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  action_source: string;
  event_source_url?: string;
  user_data: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
};

export type CapiResult = { ok: boolean; skipped?: string; response?: unknown; error?: string };

export async function sendCapi(events: CapiEvent[]): Promise<CapiResult> {
  if (!isConfigured.meta()) return { ok: false, skipped: "META_PIXEL_ID yoki META_CAPI_ACCESS_TOKEN kiritilmagan" };
  const url = `https://graph.facebook.com/${env.meta.apiVersion}/${env.meta.pixelId}/events?access_token=${encodeURIComponent(env.meta.token)}`;
  const body: Record<string, unknown> = { data: events };
  if (env.meta.testCode) body.test_event_code = env.meta.testCode;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[CAPI] xato", res.status, JSON.stringify(json));
      return { ok: false, error: JSON.stringify(json), response: json };
    }
    return { ok: true, response: json };
  } catch (e) {
    console.error("[CAPI] so‘rov xatosi", e);
    return { ok: false, error: String(e) };
  }
}

export function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") || undefined };
}
