"use client";

import { ArrowRight } from "lucide-react";
import { useLeadModal } from "@/components/lead/LeadModal";
import type { PackageId } from "@/lib/content";

export function CtaButton({
  children = "Bepul diagnostikaga yozilish",
  source,
  pkg,
  variant = "gold",
  className = "",
  size = "lg",
}: {
  children?: React.ReactNode;
  source: string;
  pkg?: PackageId;
  variant?: "gold" | "navy" | "ghost" | "white";
  className?: string;
  size?: "md" | "lg";
}) {
  const { open } = useLeadModal();
  const styles = {
    gold: "bg-gold text-navy-950 hover:bg-gold-light shadow-[0_12px_40px_-12px_rgba(200,146,47,0.7)]",
    navy: "bg-navy text-white hover:bg-navy-700 shadow-[0_12px_40px_-14px_rgba(24,78,119,0.8)]",
    ghost: "border border-white/20 text-white hover:bg-white/10",
    white: "bg-white text-navy-900 hover:bg-gold-soft",
  }[variant];
  const sz = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-sm";
  return (
    <button
      type="button"
      onClick={() => open({ source, pkg })}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 active:scale-[0.98] ${sz} ${styles} ${className}`}
    >
      {variant === "gold" && (
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      )}
      <span className="relative">{children}</span>
      <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
