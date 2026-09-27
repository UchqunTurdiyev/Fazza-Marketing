import type { Metadata, Viewport } from "next";
// Shriftlar lokal (self-hosted) — Google Fonts'ga bog'liq emas, tezroq yuklanadi
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/source-serif-4/wght.css";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "./globals.css";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { MetaPixel } from "@/components/consent/MetaPixel";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { LeadModalProvider } from "@/components/lead/LeadModal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Strategik sessiya — FAZZA Management School",
  description:
    "Kompaniyangizning 2–3 yillik kelajagini jamoangiz bilan birga ishlab chiqamiz va uni aniq maqsad, strategiya hamda bir yillik yo‘l xaritasiga aylantiramiz.",
  keywords: ["strategik sessiya", "strategiya", "biznes strategiya", "FAZZA", "TOP CEO", "yo‘l xaritasi", "Toshkent"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: siteUrl,
    siteName: "FAZZA Management School",
    title: "Strategik sessiya — 2 kunda jamoangiz bilan 3 yillik strategiya",
    description: "Missiya, Vision, SWOT/PEST, bozor tahlili, raqamli maqsadlar va 1 yillik yo‘l xaritasi — jamoangiz bilan birga.",
    images: [{ url: "/images/hero-team.webp", width: 900, height: 675 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a2238",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <ConsentProvider>
          <LeadModalProvider>
            {children}
            <CookieBanner />
          </LeadModalProvider>
          <MetaPixel />
        </ConsentProvider>
      </body>
    </html>
  );
}
