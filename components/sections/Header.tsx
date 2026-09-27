"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { brand, nav } from "@/lib/content";
import { CtaButton } from "@/components/ui/CtaButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-navy-950/85 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="FAZZA Management School" className="shrink-0">
          <Image src="/fazza-logo-white.png" alt="FAZZA Management School" width={991} height={207} priority className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={brand.phoneHref}
            className="hidden items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-gold md:flex"
          >
            <Phone className="size-4 text-gold" />
            {brand.phone}
          </a>
          <div className="hidden sm:block">
            <CtaButton source="header" size="md">
              Ariza qoldirish
            </CtaButton>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Menyu"
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                >
                  {n.label}
                </a>
              ))}
              <a href={brand.phoneHref} className="flex items-center gap-2 px-4 py-3 font-semibold text-gold">
                <Phone className="size-4" /> {brand.phone}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
