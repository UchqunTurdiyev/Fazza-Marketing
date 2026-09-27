import "server-only";

const s = (v: string | undefined) => (v ?? "").trim();

export const env = {
  siteUrl: s(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
  meta: {
    pixelId: s(process.env.META_PIXEL_ID) || s(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    token: s(process.env.META_CAPI_ACCESS_TOKEN),
    testCode: s(process.env.META_TEST_EVENT_CODE),
    apiVersion: s(process.env.META_API_VERSION) || "v23.0",
    purchaseActionSource: s(process.env.META_PURCHASE_ACTION_SOURCE) || "website",
    requireConsent: s(process.env.META_CAPI_REQUIRE_CONSENT) === "true",
  },
  telegram: {
    token: s(process.env.TELEGRAM_BOT_TOKEN),
    chatIds: s(process.env.TELEGRAM_CHAT_IDS)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  },
  bitrix: {
    webhook: s(process.env.BITRIX24_WEBHOOK_URL).replace(/\/+$/, ""),
    assignedById: s(process.env.BITRIX24_ASSIGNED_BY_ID),
    appToken: s(process.env.BITRIX24_APP_TOKEN),
  },
  purchaseSecret: s(process.env.PURCHASE_WEBHOOK_SECRET),
  defaultCurrency: s(process.env.DEFAULT_CURRENCY) || "USD",
};

export const isConfigured = {
  meta: () => Boolean(env.meta.pixelId && env.meta.token),
  telegram: () => Boolean(env.telegram.token && env.telegram.chatIds.length),
  bitrix: () => Boolean(env.bitrix.webhook),
};
