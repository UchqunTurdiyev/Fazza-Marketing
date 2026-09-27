import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-mist">
      <header className="bg-navy-950 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/"><Image src="/fazza-logo-white.png" alt="FAZZA" width={991} height={207} className="h-8 w-auto" /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-gold"><ArrowLeft className="size-4" /> Bosh sahifa</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-serif text-4xl font-semibold text-navy-900">{title}</h1>
        <p className="mt-2 text-sm text-muted">Oxirgi yangilanish: {updated}</p>
        <article className="mt-10 space-y-6 rounded-3xl bg-white p-7 leading-relaxed text-ink/85 shadow-sm md:p-10 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_table]:text-sm [&_td]:border-t [&_td]:border-line [&_td]:py-2.5 [&_td]:pr-3 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-3 [&_th]:text-left [&_th]:text-navy-900">
          {children}
        </article>
      </main>
    </div>
  );
}
