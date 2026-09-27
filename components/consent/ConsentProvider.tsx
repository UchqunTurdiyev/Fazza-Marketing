"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { COOKIE, Consent, CONSENT_MAX_AGE, CONSENT_VERSION, parseJsonSafe } from "@/lib/tracking";

type Ctx = {
  consent: Consent | null;
  ready: boolean;
  save: (c: { analytics: boolean; marketing: boolean }) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<Ctx | null>(null);

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const c = parseJsonSafe<Consent>(readCookie(COOKIE.consent));
    if (c && c.v === CONSENT_VERSION) setConsent(c);
    setReady(true);
  }, []);

  const save = useCallback((c: { analytics: boolean; marketing: boolean }) => {
    const value: Consent = { v: CONSENT_VERSION, necessary: true, analytics: c.analytics, marketing: c.marketing, ts: Date.now() };
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE.consent}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    if (!c.marketing) {
      // Rozilik qaytarib olinsa Meta cookie'larini o‘chiramiz
      for (const n of [COOKIE.fbp, COOKIE.fbc]) {
        document.cookie = `${n}=; Max-Age=0; Path=/`;
        document.cookie = `${n}=; Max-Age=0; Path=/; Domain=.${location.hostname.replace(/^www\./, "")}`;
      }
      window.fbq?.("consent", "revoke");
    }
    setConsent(value);
    setSettingsOpen(false);
    window.dispatchEvent(new CustomEvent("fz-consent", { detail: value }));
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        ready,
        save,
        settingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent ConsentProvider ichida ishlatilishi kerak");
  return ctx;
}
