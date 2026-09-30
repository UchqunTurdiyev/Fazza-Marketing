"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Send } from "lucide-react";
import { brand, nav } from "@/lib/content";
import { useConsent } from "@/components/consent/ConsentProvider";
import { useLeadModal } from "@/components/lead/LeadModal";

export function Footer() {
  const { openSettings } = useConsent();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-navy-950 pb-28 pt-14 text-white/60 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image src="/fazza-logo-white.png" alt="FAZZA Management School" width={991} height={207} className="h-9 w-auto" />
            <p className="mt-4 text-sm leading-relaxed">Strategik boshqaruv va rahbarlar rivojlanishi. TOP CEO dasturi ekotizimi.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition hover:text-gold">{n.label}</a>
            ))}
          </nav>
          <div className="space-y-2 text-sm">
            <a href={brand.phoneHref} className="block font-semibold text-white transition hover:text-gold">{brand.phone}</a>
            <a href={`mailto:${brand.email}`} className="block transition hover:text-gold">{brand.email}</a>
            <div>{brand.address}</div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <div>© {year} FAZZA Management School. Barcha huquqlar himoyalangan.</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/maxfiylik" className="hover:text-gold">Maxfiylik siyosati</Link>
            <Link href="/cookie-siyosati" className="hover:text-gold">Cookie siyosati</Link>
            <button onClick={openSettings} className="hover:text-gold">Cookie sozlamalari</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Mobil qurilmada pastki qotirilgan CTA paneli */
export function MobileBar() {
  const [show, setShow] = useState(false);
  const { open } = useLeadModal();
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 p-3 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex gap-2">
            <a
              href={brand.phoneHref}
              aria-label="Qo‘ng‘iroq qilish"
              className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/15 text-gold"
            >
              <Phone className="size-5" />
            </a>
            <button
              onClick={() => open({ source: "mobile-bar" })}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold font-bold text-navy-950"
            >
              <Send className="size-4" /> Bepul diagnostikaga yozilish
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
