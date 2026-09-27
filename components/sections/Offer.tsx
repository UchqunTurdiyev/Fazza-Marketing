"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Award, BadgeCheck, Check, FileStack, Mail, MapPin, MessageCircle, Minus, Phone, Plus, UserCog } from "lucide-react";
import { brand, faq, nextStep, pricing, whyUs } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaButton } from "@/components/ui/CtaButton";
import { LeadForm } from "@/components/lead/LeadForm";

export function Pricing() {
  return (
    <section id="narxlar" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute right-0 top-1/3 size-[500px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={pricing.eyebrow} title={pricing.title} dark center />
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {pricing.packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-[2rem] p-8 md:p-10 ${
                  p.featured
                    ? "bg-gradient-to-b from-navy to-navy-800 shadow-[0_40px_100px_-30px_rgba(200,146,47,0.45)] ring-2 ring-gold"
                    : "border border-white/10 bg-white/[0.04]"
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-4 right-8 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-950 shadow-lg">
                    {p.badge}
                  </div>
                )}
                <div className="text-sm font-bold tracking-[0.2em] text-gold">{p.name}</div>
                <div className="mt-1 text-white/65">{p.subtitle}</div>
                <div className="mt-6 font-serif text-5xl font-semibold md:text-6xl">{p.price}</div>
                <div className="mt-3 rounded-xl bg-gold/10 px-4 py-2.5 text-sm font-medium text-gold-light">{p.discount}</div>
                <ul className="my-8 flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${p.featured ? "bg-gold text-navy-950" : "bg-white/15 text-white"}`}>
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-white/85">{f}</span>
                    </li>
                  ))}
                </ul>
                <CtaButton source={`pricing-${p.id}`} pkg={p.id} variant={p.featured ? "gold" : "white"} className="w-full">
                  {p.name} paketini tanlash
                </CtaButton>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center text-sm text-white/55">{pricing.note}</Reveal>
      </div>
    </section>
  );
}

const whyIcons = [UserCog, BadgeCheck, FileStack, Award];

export function WhyUs() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={whyUs.eyebrow} title={whyUs.title} />
        <Stagger className="grid gap-5 md:grid-cols-2">
          {whyUs.items.map((w, i) => {
            const Icon = whyIcons[i];
            return (
              <StaggerItem key={w.title}>
                <article className="card-hover group flex h-full gap-5 rounded-3xl border border-line bg-mist p-7 md:p-8">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy text-white transition group-hover:bg-gold group-hover:text-navy-950">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-bold text-gold">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="mb-2 text-xl font-bold text-navy-900">{w.title}</h3>
                    <p className="leading-relaxed text-muted">{w.text}</p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-12 rounded-3xl border-l-4 border-gold bg-gold-soft/60 p-7 md:p-9">
          <p className="font-serif text-xl italic leading-relaxed text-navy-900 md:text-2xl">{whyUs.quote}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="savollar" className="bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} center />
        <div className="space-y-3">
          {faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className={`overflow-hidden rounded-2xl border bg-white transition ${isOpen ? "border-navy/30 shadow-lg" : "border-line"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-serif text-lg font-semibold text-navy-900 md:text-xl">{f.q}</span>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full transition ${isOpen ? "bg-navy text-white" : "bg-mist text-navy"}`}>
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <p className="px-6 pb-6 text-lg leading-relaxed text-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="mb-5 text-muted">{faq.more}</p>
          <CtaButton source="faq" variant="navy">Savolimni berish</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="ariza" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[500px] rounded-full bg-navy/60 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-0 size-[400px] rounded-full bg-gold/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={nextStep.eyebrow} title={nextStep.title} dark />
          <Stagger className="space-y-6">
            {nextStep.steps.map((s, i) => (
              <StaggerItem key={s.title} className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gold font-bold text-navy-950">{i + 1}</div>
                <div>
                  <div className="text-lg font-bold">{s.title}</div>
                  <div className="text-white/65">{s.text}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 grid gap-3 sm:grid-cols-2">
            <Contact icon={Phone} label="Telefon" value={brand.phone} href={brand.phoneHref} />
            <Contact icon={MessageCircle} label="Telegram" value={brand.telegramLabel} href={brand.telegram} />
            <Contact icon={Mail} label="E-mail" value={brand.email} href={`mailto:${brand.email}`} />
            <Contact icon={MapPin} label="Manzil" value={brand.address} />
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <h3 className="font-serif text-2xl font-semibold sm:text-3xl">Bepul tanishuv qo‘ng‘irog‘i</h3>
            <p className="mb-7 mt-2 text-white/65">30 daqiqada kompaniyangiz holatini tahlil qilamiz va sessiya formatini taklif qilamiz.</p>
            <LeadForm source="final-form" dark submitLabel="Ariza yuborish" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40">
      <Icon className="size-5 shrink-0 text-gold" />
      <div className="min-w-0">
        <div className="text-xs text-white/50">{label}</div>
        <div className="truncate font-semibold">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
