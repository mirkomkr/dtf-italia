// app/page.js (Home)
import Hero from "@/app/service-dtf/components/HeroDTF";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours (86400 seconds)
// On-demand revalidation via /api/revalidate when products change
export const revalidate = 86400;

// Base URL pubblico
// Base URL pubblico (Forzato su www per evitare redirect chain sui canonical)
const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "DTF Italia - Stampa Direct-To-Film Premium 24h",
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
  alternates: {
    canonical: BASE_URL,
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
      desc: 'Trascina il tuo design in formato PNG o PDF. Il nostro sistema verificherà all\'istante se è pronto per la stampa.',
    },
    {
      num: '02',
      title: 'Stampa Express',
      desc: 'Stampiamo il tuo design in giornata con inchiostri premium, garantendo colori brillanti e un bianco coprente.',
    },
    {
      num: '03',
      title: 'Pronto per te',
      desc: 'Ricevi la tua stampa DTF in 24h oppure passa a ritirarla direttamente nel nostro punto vendita di Roma.',
    },
  ];

  const dtfBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Semplicità Totale',
      desc: 'Un processo d\'ordine fluido pensato per farti risparmiare tempo prezioso ogni giorno.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Affidabilità Roma',
      desc: 'Siamo il partner tecnico di centinaia di professionisti romani che richiedono puntualità e qualità.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Consegna Rapidissima',
      desc: 'Grazie alla nostra logistica ottimizzata, garantiamo consegne lampo su tutta Roma e provincia.',
    },
  ];

  const dtfFaqs = [
    {
      q: 'Di che tipo di file ho bisogno per il DTF?',
      a: 'L\'ideale è un PNG con sfondo trasparente a 300 DPI, ma accettiamo anche PDF vettoriali per risultati definiti.',
    },
    {
      q: 'Come posso applicare le stampe sui tessuti?',
      a: 'È semplicissimo: bastano 15 secondi a 160°C con una termopressa. Una soluzione versatile per ogni materiale.',
    },
    {
      q: 'Quali sono i tempi di ritiro a Roma?',
      a: 'Se scegli il ritiro in sede, solitamente il tuo ordine è pronto in poche ore lavorative dalla conferma.',
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
        <HowItWorks steps={dtfSteps} sectionTitle="Il tuo ordine DTF pronto in 3 semplici passaggi" />
        <Benefits benefits={dtfBenefits} sectionTitle="Perché i professionisti di Roma scelgono il nostro DTF" />
        <FAQ faqs={dtfFaqs} sectionTitle="Tutto quello che devi sapere sulla stampa DTF" />
      </div>
    </>
  );
}