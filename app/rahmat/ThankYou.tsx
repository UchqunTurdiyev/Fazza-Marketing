"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/content";

export function ThankYou() {
  const [name, setName] = useState("");
  useEffect(() => {
    try {
      setName(sessionStorage.getItem("fz_lead_name") || "");
    } catch {}
  }, []);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-4 py-16 text-white">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full bg-gold/15 blur-[140px]" />
      <div className="relative w-full max-w-xl text-center">
        <Link href="/" className="mb-12 inline-block">
          <Image src="/fazza-logo-white.png" alt="FAZZA Management School" width={991} height={207} className="h-9 w-auto" />
        </Link>
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative mx-auto mb-8 grid size-24 place-items-center rounded-full bg-gold text-navy-950"
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
          <Check className="relative size-12" strokeWidth={3} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-serif text-4xl font-semibold leading-tight sm:text-5xl"
        >
          Rahmat{name ? `, ${name}` : ""}! Arizangiz qabul qilindi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 max-w-md text-lg text-white/70"
        >
          Menejerimiz tez orada siz bilan bog‘lanib, 30 daqiqalik tanishuv qo‘ng‘irog‘i vaqtini kelishib oladi.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <a href={brand.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-navy-950 transition hover:bg-gold-light">
            <MessageCircle className="size-5" /> Telegram orqali yozish
          </a>
          <a href={brand.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold transition hover:bg-white/10">
            <Phone className="size-5 text-gold" /> {brand.phone}
          </a>
        </motion.div>
        <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-gold">
          <ArrowLeft className="size-4" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}
