"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { employeeOptions, packageLabels, type PackageId } from "@/lib/content";
import { isValidUzPhone, maskUzPhone } from "@/lib/phone";
import { newEventId, trackPixel } from "@/lib/pixel";
import { UTM_KEYS } from "@/lib/tracking";

type Props = {
  source: string;
  pkg?: PackageId;
  dark?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
};

export function LeadForm({ source, pkg, dark, submitLabel = "Tanishuv qo‘ng‘irog‘iga yozilish", onSuccess }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [company, setCompany] = useState("");
  const [employees, setEmployees] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<string>(pkg || "unknown");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const nameOk = name.trim().length >= 2;
  const phoneOk = isValidUzPhone(phone);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!nameOk || !phoneOk) return;
    setLoading(true);
    const eventId = newEventId("lead");
    const sp = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) utm[k] = v;
    });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          company,
          employees,
          package: selectedPkg,
          source,
          pageUrl: window.location.href,
          eventId,
          utm,
          website,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Xatolik yuz berdi");

      // Brauzer Pixel — server CAPI bilan bir xil eventID (Meta dublikatni olib tashlaydi)
      trackPixel("Lead", { content_name: "Strategik sessiya", content_category: packageLabels[selectedPkg] }, eventId);
      try {
        sessionStorage.setItem("fz_lead_name", name.trim().split(" ")[0]);
      } catch {}
      onSuccess?.();
      router.push("/rahmat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      setLoading(false);
    }
  }

  const input = dark
    ? "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition focus:border-gold focus:bg-white/[0.09] focus:ring-4 focus:ring-gold/15"
    : "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-slate-400 outline-none transition focus:border-navy focus:ring-4 focus:ring-navy/10";
  const label = `mb-1.5 block text-sm font-medium ${dark ? "text-white/80" : "text-ink/80"}`;
  const err = "mt-1 text-xs text-red-500";
  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-lg border px-2 py-2 text-sm transition ${
      active
        ? dark
          ? "border-gold bg-gold/15 text-gold"
          : "border-navy bg-navy text-white"
        : dark
          ? "border-white/15 text-white/70 hover:border-white/30"
          : "border-line text-ink/70 hover:border-navy/40"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${source}-name`}>Ismingiz *</label>
          <input
            id={`${source}-name`}
            className={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ism familiya"
            autoComplete="name"
            maxLength={80}
          />
          {touched && !nameOk && <p className={err}>Ismingizni kiriting</p>}
        </div>
        <div>
          <label className={label} htmlFor={`${source}-phone`}>Telefon *</label>
          <input
            id={`${source}-phone`}
            className={input}
            value={phone}
            onChange={(e) => setPhone(maskUzPhone(e.target.value))}
            onFocus={() => phone === "" && setPhone("+998")}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+998 (90) 123-45-67"
          />
          {touched && !phoneOk && <p className={err}>To‘liq telefon raqamini kiriting</p>}
        </div>
      </div>

      <div>
        <label className={label} htmlFor={`${source}-company`}>Kompaniya nomi</label>
        <input
          id={`${source}-company`}
          className={input}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Kompaniyangiz nomi"
          autoComplete="organization"
          maxLength={120}
        />
      </div>

      <div>
        <span className={label}>Kompaniyadagi xodimlar soni</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {employeeOptions.map((o) => (
            <button type="button" key={o} className={chip(employees === o)} onClick={() => setEmployees(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>

      {!pkg && (
        <div>
          <span className={label}>Qiziqtirgan paket</span>
          <div className="grid grid-cols-3 gap-2">
            {(["standart", "standart-plus", "unknown"] as const).map((p) => (
              <button type="button" key={p} className={chip(selectedPkg === p)} onClick={() => setSelectedPkg(p)}>
                {p === "standart" ? "STANDART" : p === "standart-plus" ? "STANDART+" : "Aniq emas"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && (
        <div className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gold px-6 py-4 text-base font-bold text-navy-950 shadow-[0_14px_40px_-14px_rgba(200,146,47,0.8)] transition hover:bg-gold-light active:scale-[0.99] disabled:opacity-70"
      >
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        {loading ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
        <span className="relative">{loading ? "Yuborilmoqda..." : submitLabel}</span>
      </button>

      <p className={`flex items-start gap-2 text-xs leading-relaxed ${dark ? "text-white/50" : "text-muted"}`}>
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        <span>
          Ma’lumotlaringiz uchinchi shaxslarga berilmaydi. Yuborish orqali{" "}
          <Link href="/maxfiylik" className="underline underline-offset-2">maxfiylik siyosati</Link>ga rozilik bildirasiz.
          Menejerimiz tez orada siz bilan bog‘lanadi.
        </span>
      </p>
    </form>
  );
}
