"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CalendarCheck2, Clock3, X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { packageLabels, type PackageId } from "@/lib/content";

type OpenArgs = { source: string; pkg?: PackageId };
const Ctx = createContext<{ open: (a: OpenArgs) => void } | null>(null);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OpenArgs | null>(null);
  const open = useCallback((a: OpenArgs) => setState(a), []);
  const close = () => setState(null);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [state]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/70 backdrop-blur-md sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-modal-title"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy px-6 pb-7 pt-7 text-white sm:px-8">
                <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
                <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gold/25 blur-3xl" />
                <button
                  onClick={close}
                  aria-label="Yopish"
                  className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                >
                  <X className="size-5" />
                </button>
                <div className="relative">
                  <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">Bepul · 30 daqiqa</div>
                  <h3 id="lead-modal-title" className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                    Tanishuv qo‘ng‘irog‘iga yoziling
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    Kompaniyangiz holati va maqsadini aniqlaymiz, sessiya formatini birga tanlaymiz.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                      <Clock3 className="size-3.5 text-gold" /> 30 daqiqa
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                      <CalendarCheck2 className="size-3.5 text-gold" /> Majburiyatsiz
                    </span>
                    {state.pkg && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 font-semibold text-navy-950">
                        {packageLabels[state.pkg]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 sm:px-8">
                <LeadForm source={state.source} pkg={state.pkg} onSuccess={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function useLeadModal() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLeadModal LeadModalProvider ichida ishlatilishi kerak");
  return c;
}
