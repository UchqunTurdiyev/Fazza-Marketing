// Brauzer va server uchun umumiy cookie nomlari va turlar.

export const COOKIE = {
  consent: "fz_consent", // foydalanuvchi cookie roziligi (JSON)
  utm: "fz_utm", // oxirgi UTM belgilar (JSON)
  fbclid: "fz_fbclid", // Meta click id + vaqt: "<ts>.<fbclid>"
  landing: "fz_landing", // birinchi kirish sahifasi
  fbp: "_fbp", // Meta Pixel browser id
  fbc: "_fbc", // Meta Pixel click id
} as const;

export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 kun
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90; // 90 kun

export type Consent = {
  v: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

export type Utm = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** Lid bilan birga Bitrix24 ga saqlanadigan va keyin Purchase eventida ishlatiladigan ma'lumot */
export type TrackingData = {
  fbp?: string;
  fbc?: string;
  ip?: string;
  ua?: string;
  url?: string;
  eventId?: string;
  ts: number;
  utm?: Utm;
  consent?: boolean;
};

export function parseJsonSafe<T>(raw: string | undefined | null): T | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      return JSON.parse(decodeURIComponent(raw)) as T;
    } catch {
      return undefined;
    }
  }
}
