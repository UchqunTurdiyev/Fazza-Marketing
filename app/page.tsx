import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { IsNot, LogoMarquee, Pains } from "@/components/sections/Problems";
import { Process, Program, Results } from "@/components/sections/Program";
import { Audience, CaseStudy, Clients } from "@/components/sections/Proof";
import { Faq, FinalCta, Pricing, WhyUs } from "@/components/sections/Offer";
import { Footer, MobileBar } from "@/components/sections/Footer";
import { faq, pricing } from "@/lib/content";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Strategik sessiya",
      provider: { "@type": "EducationalOrganization", name: "FAZZA Management School", url: siteUrl },
      areaServed: "UZ",
      offers: pricing.packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.priceValue,
        priceCurrency: "USD",
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((f) => ({
        "@type": "Question",
        name: f.q.replace(/[“”]/g, ""),
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Pains />
        <IsNot />
        <Program />
        <Process />
        <Results />
        <CaseStudy />
        <Clients />
        <Audience />
        <Pricing />
        <WhyUs />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
