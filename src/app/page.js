// app/page.js (Home)
import Hero from "@/app/dtf/components/HeroDTF";
// import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import dynamic from 'next/dynamic';
import { getWooCommerceProducts } from "@/lib/woocommerce"; // Import for server fetching
import { Zap, ShieldCheck, Truck } from 'lucide-react';

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

export default async function Home() {
  // Fetch DTF product for Hero Configurator (Server Side)
  let dtfProduct = null;
  try {
    const products = await getWooCommerceProducts({ slug: 'stampa-dtf-service-professionale' });
    if (products && products.length > 0) {
      dtfProduct = products[0];
    }
  } catch (error) {
    console.error("Error fetching DTF product for Home:", error);
  }

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

  const dtfSteps = [
    {
      num: '01',
      title: 'Carica il File',
      desc: 'Carica il tuo design in formato PNG o PDF. Il nostro sistema verificherà automaticamente la qualità per la stampa DTF a Roma.',
    },
    {
      num: '02',
      title: 'Stampa DTF Premium',
      desc: 'Stampiamo il tuo design su pellicola tecnica con bianco ultra-coprente e polveri poliuretaniche di alta qualità.',
    },
    {
      num: '03',
      title: 'Ritiro o Spedizione',
      desc: 'Ritira il tuo ordine presso la nostra sede di Roma o ricevi la spedizione in 24h in tutta Italia.',
    },
  ];

  const dtfBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Bianco Ultra-Coprente',
      desc: 'Utilizziamo inchiostri premium per massimizzare la resa su tessuti scuri.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Qualità Garantita',
      desc: 'Siamo l\'unico service DTF a Roma che garantisce una durata superiore ai 50 lavaggi.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione 24h',
      desc: 'Consegna rapidissima a Roma e provincia per tutte le tue urgenze di stampa.',
    },
  ];

  const dtfFaqs = [
    {
      q: 'Come devono essere i file per la stampa DTF?',
      a: 'Consigliamo file PNG a 300 DPI con sfondo trasparente o PDF vettoriali per la massima definizione.',
    },
    {
      q: 'Quanto resistono i lavaggi?',
      a: 'Le nostre stampe sono testate per resistere oltre 50 lavaggi a 40°C senza perdere brillantezza.',
    },
    {
      q: 'Posso ritirare in sede a Roma?',
      a: 'Certamente! Puoi selezionare il ritiro gratuito presso il nostro laboratorio di Pomezia.',
    },
  ];

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
        <Hero product={dtfProduct} /> 
        <HowItWorks steps={dtfSteps} titoloTecnica="DTF" />
        <Benefits benefits={dtfBenefits} titoloTecnica="DTF" />
        <FAQ faqs={dtfFaqs} titoloTecnica="DTF" />
      </div>
    </>
  );
}