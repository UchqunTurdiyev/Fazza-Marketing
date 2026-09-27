"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({ to, suffix = "", decimals = 0, duration = 1.6 }: { to: number; suffix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(decimals) + suffix);

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [inView, mv, to, duration]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
