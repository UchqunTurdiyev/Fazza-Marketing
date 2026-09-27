import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 max-w-3xl md:mb-16 ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <div className={`mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-gold/70" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`font-serif text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl ${dark ? "text-white" : "text-navy-900"}`}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
