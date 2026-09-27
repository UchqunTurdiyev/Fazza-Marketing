"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useConsent } from "./ConsentProvider";

export function CookieBanner() {
  const { consent, ready, save, settingsOpen, openSettings, closeSettings } = useConsent();
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [consent, settingsOpen]);

  const showBanner = ready && !consent && !settingsOpen;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie fayllar"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.8 }}
            className="fixed inset-x-3 bottom-3 z-[70] sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md"
          >
            <div className="rounded-2xl border border-white/10 bg-ink/95 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                  <Cookie className="size-5" />
                </div>
                <div className="text-sm leading-relaxed text-white/80">
                  <p className="mb-1 font-semibold text-white">Cookie fayllardan foydalanamiz</p>
                  Sayt to‘g‘ri ishlashi, tashriflarni tahlil qilish va sizga mos takliflarni ko‘rsatish uchun cookie
                  fayllardan foydalanamiz.{" "}
                  <Link href="/cookie-siyosati" className="text-gold underline-offset-2 hover:underline">
                    Batafsil
                  </Link>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => save({ analytics: true, marketing: true })}
                  className="col-span-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light"
                >
                  Barchasiga rozilik beraman
                </button>
                <button
                  onClick={() => save({ analytics: false, marketing: false })}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/85 transition hover:bg-white/5"
                >
                  Faqat zarurlari
                </button>
                <button
                  onClick={openSettings}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/85 transition hover:bg-white/5"
                >
                  Sozlash
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-end bg-ink/60 p-3 backdrop-blur-sm sm:place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Cookie sozlamalari"
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-white p-6 text-ink shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-navy">Cookie sozlamalari</h2>
                <button onClick={closeSettings} aria-label="Yopish" className="rounded-full p-2 hover:bg-slate-100">
                  <X className="size-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Row
                  title="Zarur cookie'lar"
                  text="Sayt ishlashi, rozilikni eslab qolish va ariza manbasini (UTM) saqlash uchun. O‘chirib bo‘lmaydi."
                  checked
                  disabled
                />
                <Row
                  title="Analitika"
                  text="Tashriflar statistikasi va sayt sifatini yaxshilash uchun."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <Row
                  title="Marketing (Meta Pixel)"
                  text="Reklama samaradorligini o‘lchash va sizga mos takliflarni ko‘rsatish uchun (_fbp, _fbc)."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => save({ analytics, marketing })}
                  className="flex-1 rounded-xl border border-navy/20 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy/5"
                >
                  Tanlovni saqlash
                </button>
                <button
                  onClick={() => save({ analytics: true, marketing: true })}
                  className="flex-1 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                >
                  Barchasiga rozilik
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Row({
  title,
  text,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-start gap-4 rounded-2xl border border-slate-200 p-4 ${disabled ? "opacity-80" : "cursor-pointer hover:border-navy/30"}`}>
      <div className="flex-1">
        <div className="font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-sm text-muted">{text}</div>
      </div>
      <span className="relative mt-1 inline-flex">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-gold" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
