"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check, Clock, Compass, Eye, FileCheck2, Gem, Layers, Search, Target, Users } from "lucide-react";
import { process, program, results } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaButton } from "@/components/ui/CtaButton";

const icons = [Gem, Eye, Layers, Search, Compass, Target];

export function Program() {
  return (
    <section id="dastur" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-navy/50 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={program.eyebrow} title={program.title} dark />
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {program.items.map((p, i) => {
            const Icon = icons[i];
            return (
              <StaggerItem key={p.title}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.07]">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gold/0 blur-2xl transition duration-500 group-hover:bg-gold/20" />
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-light text-navy-950 shadow-lg shadow-gold/20">
                      <Icon className="size-6" />
                    </div>
                    <span className="font-serif text-4xl font-semibold text-white/10">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{p.title}</h3>
                  <p className="leading-relaxed text-white/65">{p.text}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-gold/10 px-6 py-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3 text-white/90">
            <Clock className="size-5 shrink-0 text-gold" />
            <span className="font-medium">{program.format}</span>
          </div>
          <CtaButton source="program" size="md">Bepul diagnostikaga yozilish</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="jarayon" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} />
        <div ref={ref} className="relative">
          <div className="absolute left-[22px] right-0 top-[22px] hidden h-[2px] bg-line lg:block">
            <motion.div style={{ width }} className="h-full bg-gradient-to-r from-navy via-navy to-gold" />
          </div>
          <div className="absolute bottom-0 left-[21px] top-0 w-[2px] bg-line lg:hidden" />
          <Stagger className="grid gap-10 lg:grid-cols-4 lg:gap-6" gap={0.15}>
            {process.steps.map((s, i) => (
              <StaggerItem key={s.title} className="relative pl-16 lg:pl-0">
                <div
                  className={`absolute left-0 top-0 z-10 grid size-11 place-items-center rounded-full text-base font-bold ring-8 ring-white lg:relative lg:mb-6 ${
                    s.premium ? "bg-gold text-navy-950" : "bg-navy text-white"
                  }`}
                >
                  {i + 1}
                </div>
                <div className={`mb-2 text-sm font-bold uppercase tracking-wider ${s.premium ? "text-gold" : "text-navy/70"}`}>{s.time}</div>
                <h3 className="mb-2 text-xl font-bold text-navy-900">{s.title}</h3>
                <p className="leading-relaxed text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal className="mt-14 grid gap-4 rounded-3xl border border-line bg-mist p-7 md:grid-cols-[260px_1fr] md:items-center md:p-9">
          <div className="flex items-center gap-3 font-serif text-xl font-semibold text-navy-900">
            <Users className="size-6 text-gold" /> {process.after.title}
          </div>
          <p className="leading-relaxed text-muted">{process.after.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section id="natija" className="relative overflow-hidden bg-mist py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={results.eyebrow} title={results.title} />
          <Stagger className="grid gap-3 sm:grid-cols-2" gap={0.06}>
            {results.items.map((r) => (
              <StaggerItem key={r}>
                <div className="card-hover flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-navy text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] font-medium leading-snug text-ink">{r}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src="/images/sessiya.jpg"
              alt="Strategik sessiya yakunidagi jamoa"
              width={900}
              height={675}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative -mt-16 ml-auto mr-4 max-w-sm rounded-2xl bg-navy p-6 text-white shadow-2xl sm:mr-8">
            <FileCheck2 className="mb-3 size-8 text-gold" />
            <p className="font-serif text-lg leading-snug">{results.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
