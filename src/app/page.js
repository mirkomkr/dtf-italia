import Hero from "@/components/Hero";
import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import Head from "next/head";

export const metadata = {
  title: "DTF PRO - Stampa Direct-To-Film Premium in 24h",
  description: "Servizio di stampa DTF professionale per aziende e creativi. Alta qualità, spedizione in 24h, nessun minimo d'ordine. Carica il tuo file e ordina subito.",
  keywords: "stampa dtf, direct to film, stampa magliette, stampa tessuti, dtf service, stampa 24h",
  authors: [{ name: "DTF PRO" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  openGraph: {
    title: "DTF PRO - Stampa Direct-To-Film Premium",
    description: "Servizio di stampa DTF professionale. Alta qualità, spedizione in 24h.",
    url: "https://dtfpro.example.com",
    siteName: "DTF PRO",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://dtfpro.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DTF PRO - Stampa Direct-To-Film Premium"
      }
    ]
  },
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DTF PRO",
    "url": "https://dtfpro.example.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dtfpro.example.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="canonical" href="https://dtfpro.example.com" />
      </Head>

      <div className="min-h-screen bg-white">
        <Hero />
        <HowItWorks />
        <Benefits />
        <FAQ />
      </div>
    </>
  );
}
