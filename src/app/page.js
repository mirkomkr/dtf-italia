// app/page.js (Home)
import Hero from "@/app/dtf/components/HeroDTF";
// import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import dynamic from 'next/dynamic';

const HowItWorks = dynamic(() => import('@/components/Sections').then(mod => mod.HowItWorks), { ssr: true });
const Benefits = dynamic(() => import('@/components/Sections').then(mod => mod.Benefits), { ssr: true });
const FAQ = dynamic(() => import('@/components/Sections').then(mod => mod.FAQ), { ssr: true });

// Base URL pubblico
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "DTF Italia - Stampa Direct-To-Film Premium in 24h",
  description:
    "Servizio di stampa DTF professionale per aziende e creativi. Alta qualità, spedizione in 24h, nessun minimo d'ordine. Carica il tuo file e ordina subito.",
  keywords: [
    "stampa dtf",
    "direct to film",
    "stampa magliette",
    "stampa tessuti",
    "dtf service",
    "stampa 24h",
  ],
  authors: [{ name: "DTF Italia" }],
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  openGraph: {
    title: "DTF Italia - Stampa Direct-To-Film Premium",
    description:
      "Servizio di stampa DTF professionale. Alta qualità, spedizione in 24h.",
    url: BASE_URL,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "DTF Italia - Stampa Direct-To-Film Premium",
      },
    ],
  },
};

export default function Home() {
  // Schema WebSite (SEO base)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "DTF Italia",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Canonical */}
      <link rel="canonical" href={BASE_URL} />

      <div 
        className="min-h-screen bg-white"
        style={{ '--brand-color': '#4f46e5' }}
      >
        <Hero />
        <HowItWorks />
        <Benefits />
        <FAQ />
      </div>
    </>
  );
}