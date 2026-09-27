import "server-only";
import type { NextRequest } from "next/server";
import { COOKIE, Consent, parseJsonSafe, TrackingData, Utm } from "@/lib/tracking";

export function getClientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || undefined;
}

/** _fbc cookie bo‘lmasa, proxy saqlagan fbclid dan Meta formatidagi fbc ni yasaydi */
export function resolveFbc(req: NextRequest): string | undefined {
  const fbc = req.cookies.get(COOKIE.fbc)?.value;
  if (fbc) return fbc;
  const raw = req.cookies.get(COOKIE.fbclid)?.value;
  if (!raw) return undefined;
  const idx = raw.indexOf(".");
  if (idx < 0) return undefined;
  const ts = raw.slice(0, idx);
  const id = raw.slice(idx + 1);
  if (!id) return undefined;
  return `fb.1.${ts}.${id}`;
}

export function collectTracking(req: NextRequest, extra: { url?: string; eventId?: string; utm?: Utm }): TrackingData {
  const consent = parseJsonSafe<Consent>(req.cookies.get(COOKIE.consent)?.value);
  const cookieUtm = parseJsonSafe<Utm>(req.cookies.get(COOKIE.utm)?.value) || {};
  const utm = { ...cookieUtm, ...(extra.utm || {}) };
  return {
    fbp: req.cookies.get(COOKIE.fbp)?.value,
    fbc: resolveFbc(req),
    ip: getClientIp(req),
    ua: req.headers.get("user-agent") || undefined,
    url: extra.url,
    eventId: extra.eventId,
    ts: Math.floor(Date.now() / 1000),
    utm: Object.keys(utm).length ? utm : undefined,
    consent: consent?.marketing ?? false,
  };
}
