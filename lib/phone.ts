/** O‘zbekiston raqamini +998XXXXXXXXX ko‘rinishiga keltiradi. */
export function normalizeUzPhone(input: string): string {
  let d = (input || "").replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  if (d.startsWith("8") && d.length === 12) d = "998" + d.slice(3);
  return d;
}

export function isValidUzPhone(input: string): boolean {
  const d = normalizeUzPhone(input);
  return /^998\d{9}$/.test(d);
}

export function formatUzPhone(input: string): string {
  const d = normalizeUzPhone(input);
  if (!/^998\d{9}$/.test(d)) return input;
  return `+998 (${d.slice(3, 5)}) ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`;
}

/** Input maskasi: +998 (XX) XXX-XX-XX */
export function maskUzPhone(raw: string): string {
  // "+998" prefiksini kursor qayerda bo'lishidan qat'i nazar olib tashlaymiz
  let s = raw;
  const i = s.indexOf("+998");
  if (i >= 0) s = s.slice(0, i) + s.slice(i + 4);
  let d = s.replace(/\D/g, "");
  if (d.length > 9 && d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  let out = "+998";
  if (d.length > 0) out += " (" + d.slice(0, 2);
  if (d.length > 2) out += ") " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}
