import Image from "next/image";
import { Check, X, Quote } from "lucide-react";
import { clients, isNot, pains } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaButton } from "@/components/ui/CtaButton";

export function LogoMarquee() {
  const row = [...clients.logos, ...clients.logos, ...clients.logos];
  return (
    <section aria-label="Mijozlarimiz" className="relative border-y border-line bg-white py-10">
      <div className="mx-auto mb-6 max-w-7xl px-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-muted sm:px-6">
        Strategik sessiya o‘tkazgan kompaniyalar
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused]">
          {[...row, ...row].map((l, i) => (
            <div key={i} className="flex h-14 w-40 shrink-0 items-center justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image src={l.src} alt={l.alt} width={l.w} height={l.h} className="max-h-14 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pains() {
  return (
    <section className="relative bg-mist py-24 md:py-32">
      <div className="grid-bg-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={pains.eyebrow} title={pains.title} lead={pains.lead} />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pains.items.map((p, i) => (
            <StaggerItem key={p.title}>
              <article className="card-hover group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-7">
                <div className="absolute right-5 top-4 font-serif text-6xl font-semibold text-navy/[0.06] transition group-hover:text-gold/15">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-5 grid size-11 place-items-center rounded-full bg-navy text-sm font-bold text-white transition group-hover:bg-gold group-hover:text-navy-950">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2 text-lg font-bold leading-snug text-navy-900">{p.title}</h3>
                <p className="leading-relaxed text-muted">{p.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-navy-900 p-8 text-center text-white md:flex-row md:justify-between md:text-left">
          <p className="max-w-2xl font-serif text-xl leading-snug md:text-2xl">
            Kamida 2 ta holat tanish bo‘lsa — jamoangiz bilan strategik sessiya o‘tkazish vaqti keldi.
          </p>
          <CtaButton source="pains" className="shrink-0">Bepul diagnostikaga yozilish</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

export function IsNot() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={isNot.eyebrow} title={isNot.title} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-mist p-8 md:p-10">
            <div className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted">Bu emas</div>
            <ul className="space-y-5">
              {isNot.not.map((t) => (
                <li key={t} className="flex items-start gap-4 text-muted">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500">
                    <X className="size-4" />
                  </span>
                  <span className="line-through decoration-slate-300 decoration-1">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-900 p-8 text-white shadow-[0_30px_80px_-30px_rgba(24,78,119,0.8)] md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gold">Bu</div>
            <ul className="relative space-y-5">
              {isNot.is.map((t) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gold text-navy-950">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="mx-auto mt-12 flex max-w-4xl items-start gap-4 text-center md:text-left">
          <Quote className="hidden size-10 shrink-0 text-gold md:block" />
          <p className="font-serif text-xl italic leading-relaxed text-navy-900 md:text-2xl">{isNot.quote}</p>
        </Reveal>
      </div>
    </section>
  );
}
