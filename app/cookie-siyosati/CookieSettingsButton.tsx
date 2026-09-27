"use client";

import { useConsent } from "@/components/consent/ConsentProvider";

export function CookieSettingsButton() {
  const { openSettings, consent } = useConsent();
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-mist p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        Joriy holat:{" "}
        <b>{!consent ? "tanlov qilinmagan" : consent.marketing ? "barcha cookie'larga rozilik berilgan" : "faqat zarur cookie'lar"}</b>
      </div>
      <button onClick={openSettings} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
        Cookie sozlamalarini ochish
      </button>
    </div>
  );
}
