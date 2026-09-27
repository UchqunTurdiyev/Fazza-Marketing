"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Crown, Briefcase, Sparkles, TrendingUp } from "lucide-react";
import { audience, caseStudy, clients } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { CtaButton } from "@/components/ui/CtaButton";

export function CaseStudy() {
  const max = Math.max(...caseStudy.chart.map((c) => c.value)) * 1.25;
  return (
    <section id="keys" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={caseStudy.eyebrow} title={caseStudy.title} lead={caseStudy.subtitle} />

        <Stagger className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {caseStudy.stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-3xl border border-line bg-mist p-6 text-center md:p-8">
                <div className="font-serif text-5xl font-semibold text-gold md:text-6xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-muted">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl bg-navy-900 p-8 text-white md:p-10">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-4" /> Sessiyada qabul qilingan asosiy qarorlar
            </div>
            <ul className="space-y-5">
              {caseStudy.decisions.map((d) => (
                <li key={d} className="flex items-start gap-4">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-gold" />
                  <span className="text-lg leading-snug text-white/90">{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-5 text-xs text-white/50">{caseStudy.note}</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl border border-line bg-white p-8 md:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h3 className="font-semibold text-navy-900">{caseStudy.chartTitle}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold">
                <TrendingUp className="size-3.5" /> ×2.75
              </span>
            </div>
            <div className="flex h-64 items-end gap-4 border-b border-line md:gap-8">
              {caseStudy.chart.map((c, i) => (
                <div key={c.year} className="flex h-full flex-1 flex-col items-center justify-end">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className={`mb-2 font-serif text-lg font-semibold ${c.highlight ? "text-gold" : "text-navy"}`}
                  >
                    {c.value.toFixed(1)}
                  </motion.div>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(c.value / max) * 100}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 + i * 0.15 }}
                    className={`w-full max-w-16 rounded-t-xl ${
                      c.highlight ? "bg-gradient-to-t from-gold to-gold-light" : "bg-gradient-to-t from-navy-800 to-navy"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 md:gap-8">
              {caseStudy.chart.map((c) => (
                <div key={c.year} className="flex-1 text-center text-sm font-medium text-muted">
                  {c.year}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={clients.eyebrow} title={clients.title} lead={clients.note} />
        <Stagger className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {clients.logos.map((l) => (
            <StaggerItem key={l.alt}>
              <div className="card-hover flex h-28 items-center justify-center rounded-2xl border border-line bg-white p-6">
                <Image src={l.src} alt={l.alt} width={l.w} height={l.h} className="max-h-16 w-auto object-contain" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {clients.photos.map((p, i) => (
            <StaggerItem key={p}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={p}
                  alt={`Strategik sessiya lavhasi ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const partIcons = [Crown, Briefcase, Sparkles];

export function Audience() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={audience.eyebrow} title={audience.title} />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-3xl border border-line bg-mist p-8 md:p-10">
            <h3 className="mb-6 font-serif text-2xl font-semibold text-navy-900">Siz uchun — agar:</h3>
            <ul className="space-y-4">
              {audience.forYou.map((t) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gold text-navy-950">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="text-lg leading-snug text-ink">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaButton source="audience" variant="navy">Bu biz haqimizda — bog‘laning</CtaButton>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-gold/20 blur-3xl" />
            <h3 className="relative mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gold">Kim ishtirok etadi</h3>
            <div className="relative space-y-6">
              {audience.participants.map((p, i) => {
                const Icon = partIcons[i];
                return (
                  <div key={p.title} className="flex items-start gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{p.title}</div>
                      <div className="text-white/65">{p.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="relative mt-8 border-t border-white/15 pt-5 text-sm italic text-white/70">{audience.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
