// app/service-dtf/page.js
import HeroDTF from "./components/HeroDTF";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "DTF Service Roma - Stampa Transfer Digitale Professionale",
  description:
    "Servizio professionale di stampa DTF per terzi e professionisti della personalizzazione. Alta qualità, spedizione in 24h, nessun minimo d'ordine.",
  keywords: [
    "dtf service",
    "stampa dtf professionale",
    "direct to film",
    "stampa transfer",
    "dtf roma",
    "servizio dtf terzi",
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
    title: "DTF Service Roma - Stampa Transfer Digitale Professionale",
    description:
      "Servizio professionale di stampa DTF per terzi e professionisti della personalizzazione.",
    url: `${BASE_URL}/service-dtf`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-dtf.jpg`,
        width: 1200,
        height: 630,
        alt: "DTF Service Roma - Stampa Transfer Digitale Professionale",
      },
    ],
  },
};

export default async function ServiceDTFPage() {
  // Fetch DTF product for configurator
  let dtfProduct = null;
  try {
    const products = await getWooCommerceProducts({ slug: 'stampa-dtf-service-professionale' });
    if (products && products.length > 0) {
      dtfProduct = products[0];
    }
  } catch (error) {
    console.error("Error fetching DTF product for Service DTF page:", error);
  }

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/service-dtf#service`,
    "name": "DTF Service Roma (Stampa Transfer Digitale)",
    "description": "Servizio professionale di stampa DTF per terzi e professionisti della personalizzazione.",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": [
      { "@type": "City", "name": "Roma" },
      { "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa DTF",
    // TODO: Insert Google Business Profile URL when available
    // "mainEntityOfPage": "https://www.google.com/maps/place/...",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-dtf.jpg`,
      "caption": "Stampa DTF professionale - Laboratorio DTF Italia Roma",
      "width": 1200,
      "height": 630
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Di che tipo di file ho bisogno per il DTF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'ideale è un PNG con sfondo trasparente a 300 DPI, ma accettiamo anche PDF vettoriali per risultati definiti."
        }
      },
      {
        "@type": "Question",
        "name": "Come posso applicare le stampe sui tessuti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "È semplicissimo: bastano 15 secondi a 160°C con una termopressa. Una soluzione versatile per ogni materiale."
        }
      },
      {
        "@type": "Question",
        "name": "Quali sono i tempi di ritiro a Roma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Se scegli il ritiro in sede, solitamente il tuo ordine è pronto in poche ore lavorative dalla conferma."
        }
      }
    ]
  };

  // Breadcrumb Schema (will be imported from lib/schemas/breadcrumbs.js later)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "DTF Service",
        "item": `${BASE_URL}/service-dtf`
      }
    ]
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
      desc: 'Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa in 24/48h.',
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
      desc: 'Spedizione in tutta Italia in 24/48h. Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa.',
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
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div 
        className="min-h-screen bg-white"
        style={{ '--brand-color': '#4f46e5' }}
      >
        <HeroDTF product={dtfProduct} />
        <HowItWorks steps={dtfSteps} sectionTitle="Il tuo ordine DTF pronto in 3 semplici passaggi" />
        <Benefits benefits={dtfBenefits} sectionTitle="Perché i professionisti di Roma scelgono il nostro DTF Service" />
        <FAQ faqs={dtfFaqs} sectionTitle="Tutto quello che devi sapere sulla stampa DTF" />
      </div>
    </>
  );
}
