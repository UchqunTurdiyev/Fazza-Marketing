import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return ["", "/maxfiylik", "/cookie-siyosati"].map((p) => ({ url: `${url}${p}`, lastModified: new Date() }));
}
