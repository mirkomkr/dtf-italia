import HeroSublimazione from './components/HeroSublimazione';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumbs';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "Stampa a Sublimazione Roma - Gadget e Abbigliamento Tecnico",
  description: "Personalizzazione tramite sublimazione per tazze, cuscini, mousepad e maglie sportive. Ideale per regali e promozioni. Spedizione in tutta Italia.",
  keywords: "stampa sublimazione, gadget personalizzati, abbigliamento tecnico, tazze personalizzate, Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Stampa a Sublimazione Roma - Gadget e Abbigliamento Tecnico",
    description: "Personalizzazione tramite sublimazione per tazze, cuscini, mousepad e maglie sportive.",
    url: `${BASE_URL}/stampa-sublimazione`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-sublimazione.jpg`,
        width: 1200,
        height: 630,
        alt: "Tazza personalizzata con stampa a sublimazione - DTF Italia Roma"
      }
    ]
  },
};

export default function SublimationPage() {
  // Product Schema (for Google Shopping)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/stampa-sublimazione#product`,
    "name": "Stampa a Sublimazione Roma (Gadget e Abbigliamento Tecnico)",
    "description": "Personalizzazione tramite sublimazione per tazze, cuscini, mousepad e maglie sportive. Ideale per regali e promozioni.",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-sublimazione.jpg`,
      "caption": "Tazza personalizzata con stampa a sublimazione - DTF Italia Roma"
    },
    "brand": {
      "@type": "Brand",
      "name": "DTF Italia"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/stampa-sublimazione`,
      "priceCurrency": "EUR",
      "price": "1.00",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@id": `${BASE_URL}/#organization`
      }
    },
    "areaServed": [
      { "@type": "City", "name": "Roma" },
      { "@type": "Country", "name": "Italia" }
    ]
    // TODO: Insert Google Business Profile URL when available
    // "mainEntityOfPage": "https://www.google.com/maps/place/...",
  };

  const sublimazioneSteps = [
    {
      num: '01',
      title: 'Design Creativo',
      desc: 'Dacci la tua idea: trasformiamo grafiche e foto in un layout pronto per brillare su ogni oggetto.',
    },
    {
      num: '02',
      title: 'Saturazione Colore',
      desc: 'In questa fase il calore fonde il colore direttamente nel materiale, creando un legame indissolubile.',
    },
    {
      num: '03',
      title: 'Effetto WOW',
      desc: 'Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa in 24/48h.',
    },
  ];

  const sublimazioneBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Brillantezza Eterna',
      desc: 'I colori non sbiadiscono mai perché diventano parte integrante del materiale stesso.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Personalizzazione Totale',
      desc: 'Crea gadget unici nel nostro centro specializzato di Roma, anche per singoli pezzi o campionature.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione Nazionale',
      desc: 'Spedizione in tutta Italia in 24/48h. Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa.',
    },
  ];

  const sublimazioneFaqs = [
    {
      q: 'Quali oggetti posso personalizzare?',
      a: 'Dalle tazze alle maglie tecniche, dai tappetini mouse alle borracce: praticamente tutto ciò che ha un fondo in poliestere.',
    },
    {
      q: 'La stampa si sente al tatto?',
      a: 'Assolutamente no. La sublimazione è impercettibile, rendendo i tessuti traspiranti e morbidissimi.',
    },
    {
      q: 'È possibile stampare fotografie?',
      a: 'Certamente! È la tecnica regina per la resa fotografica, ideale per regali personalizzati a Roma.',
    },
  ];

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": sublimazioneFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema('Stampa Sublimazione', '/stampa-sublimazione');

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <HeroSublimazione />
      
      {/* Future: Product grid section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prodotti in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo prodotti per la sublimazione a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={sublimazioneSteps} sectionTitle="Come trasformiamo le tue idee in oggetti unici" />
      <Benefits benefits={sublimazioneBenefits} sectionTitle="Massima resa cromatica per i tuoi gadget a Roma" />

      {/* Related Services */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Servizi Correlati</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="/service-dtf" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">DTF Service</h3>
              <p className="text-sm text-gray-600">Stampa transfer digitale</p>
            </a>
            <a href="/stampa-serigrafia" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Serigrafia</h3>
              <p className="text-sm text-gray-600">Stampa professionale su abbigliamento</p>
            </a>
            <a href="/stampa-calendari" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Calendari</h3>
              <p className="text-sm text-gray-600">Personalizzati da 1 a 1000+ pezzi</p>
            </a>
            <a href="/pellicole-serigrafia" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Pellicole Serigrafiche</h3>
              <p className="text-sm text-gray-600">Servizio B2B per laboratori</p>
            </a>
          </div>
        </div>
      </section>

      <FAQ faqs={sublimazioneFaqs} sectionTitle="Domande comuni sulla personalizzazione sublimatica" />
    </>
  );
}
