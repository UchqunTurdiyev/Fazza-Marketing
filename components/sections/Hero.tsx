"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, FileText, Users2, PlayCircle } from "lucide-react";
import { hero } from "@/lib/content";
import { CtaButton } from "@/components/ui/CtaButton";

const ease = [0.2, 0.7, 0.2, 1] as const;

function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
        <span className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className={`inline-block ${className || ""}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease, delay: delay + i * 0.05 }}
          >
            {w}
          </motion.span>
        </span>{" "}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const w1 = hero.title.split(" ").length;
  const w2 = hero.titleAccent.split(" ").length;

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-950 pb-20 pt-32 text-white sm:pt-36 lg:pb-28 lg:pt-44">
      {/* Fon */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-navy/60 blur-[120px]" />
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute -right-24 top-40 size-[420px] rounded-full bg-gold/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-navy-950" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
              <span className="relative size-2 rounded-full bg-gold" />
            </span>
            {hero.eyebrow}
          </motion.div>

          <h1 className="font-serif text-[2.35rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            <Words text={hero.title} />
            <Words text={hero.titleAccent} className="text-gradient-gold italic" delay={w1 * 0.05} />
            <Words text={hero.titleEnd} delay={(w1 + w2) * 0.05} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <CtaButton source="hero">Bepul tanishuv qo‘ng‘irog‘i</CtaButton>
            <a
              href="#dastur"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              <PlayCircle className="size-5 text-gold" /> Dasturni ko‘rish
            </a>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.85 } } }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-8 sm:gap-6"
          >
            {hero.stats.map((s) => (
              <motion.div
                key={s.value}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease }}
              >
                <dt className="font-serif text-2xl font-semibold text-gold sm:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/60 sm:text-sm">{s.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* Rasm */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/40 via-white/5 to-navy/40 opacity-70 blur-sm" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-navy-900 shadow-2xl">
            <motion.div style={{ y: imgY }} className="relative aspect-[4/3] scale-110">
              <Image
                src="/images/hero-team.webp"
                alt="Cambridge LC TOP jamoasi bilan strategik sessiya"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent p-5 pt-16">
              <p className="text-xs text-white/75 sm:text-sm">{hero.photoCaption}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 1.1 }}
            className="absolute -left-3 top-8 animate-float rounded-2xl border border-white/15 bg-white/95 p-4 text-ink shadow-2xl backdrop-blur sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-navy text-white">
                <FileText className="size-5" />
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-navy">40+ sahifa</div>
                <div className="text-xs text-muted">yagona strategik protokol</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 1.3 }}
            style={{ animationDelay: "1.5s" }}
            className="absolute -right-3 bottom-16 animate-float rounded-2xl border border-gold/30 bg-navy-900/95 p-4 shadow-2xl backdrop-blur sm:-right-6"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users2 className="size-4 text-gold" /> 8–15 kishilik TOP jamoa
            </div>
            <div className="mt-2 space-y-1 text-xs text-white/70">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-gold" /> Moderator + soha eksperti</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-gold" /> Mas’ul va muddatli yo‘l xaritasi</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
