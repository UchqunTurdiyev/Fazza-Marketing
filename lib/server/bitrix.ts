import "server-only";
import { env, isConfigured } from "./env";

/** Bitrix24 dagi maxsus maydonlar (npm run bitrix:setup yaratadi) */
export const BX_FIELD = {
  tracking: "UF_CRM_FAZZA_TRK", // lid/bitimdagi tracking JSON (fbp, fbc, ip, ua, utm)
  capiSent: "UF_CRM_FAZZA_CAPI", // bitimda: Purchase Meta'ga yuborilganmi (Y)
} as const;

export class BitrixError extends Error {}

export async function bx<T = any>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!isConfigured.bitrix()) throw new BitrixError("BITRIX24_WEBHOOK_URL kiritilmagan");
  const res = await fetch(`${env.bitrix.webhook}/${method}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new BitrixError(`${method}: ${json.error || res.status} ${json.error_description || ""}`.trim());
  }
  return json.result as T;
}

type Multi = { VALUE: string; VALUE_TYPE?: string }[] | undefined;
export const firstValue = (m: Multi) => (Array.isArray(m) && m.length ? m[0].VALUE : undefined);
