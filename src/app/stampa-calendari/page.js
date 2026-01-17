import HeroCalendari from './components/HeroCalendari';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumbs';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "Calendari Personalizzati 2026 - DTF Italia Roma",
  description: "Creazione calendari personalizzati da 1 a 1000+ pezzi. Soluzioni per privati (foto di famiglia) e aziende (eventi e promozione). Spedizione in tutta Italia.",
  keywords: "calendari personalizzati, calendari aziendali, calendari 2026, stampa calendari Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Calendari Personalizzati 2026 - DTF Italia Roma",
    description: "Creazione calendari personalizzati da 1 a 1000+ pezzi per privati e aziende.",
    url: `${BASE_URL}/stampa-calendari`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-calendari.jpg`,
        width: 1200,
        height: 630,
        alt: "Calendario personalizzato 2026 - DTF Italia Roma"
      }
    ]
  },
};

export default function CalendariPage() {
  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/stampa-calendari#product`,
    "name": "Calendari Personalizzati Roma",
    "description": "Creazione calendari personalizzati da 1 a 1000+ pezzi. Soluzioni per privati (foto di famiglia) e aziende (eventi e promozione).",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-calendari.jpg`,
      "caption": "Calendario personalizzato 2026 - DTF Italia Roma"
    },
    "brand": {
      "@type": "Brand",
      "name": "DTF Italia"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/stampa-calendari`,
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

  const calendariSteps = [
    {
      num: '01',
      title: 'Visione 2026',
      desc: 'Scegli il formato e il layout più adatto per il tuo brand, con spazio dedicato a loghi e contatti ben visibili.',
    },
    {
      num: '02',
      title: 'Personalizzazione',
      desc: 'Integriamo le tue foto aziendali o grafiche personalizzate per creare un oggetto utile e di design.',
    },
    {
      num: '03',
      title: 'Stampa e Finitura',
      desc: 'Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa in 24/48h.',
    },
  ];

  const calendariBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Promozione Continua',
      desc: 'Il tuo logo sotto gli occhi dei clienti per tutto l\'anno: il miglior investimento marketing di Roma.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Qualità Sensoriale',
      desc: 'Carte patinate e finiture di pregio che trasmettono professionalità e cura del dettaglio.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione Nazionale',
      desc: 'Spedizione in tutta Italia in 24/48h. Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa.',
    },
  ];

  const calendariFaqs = [
    {
      q: 'Quali sono i formati più richiesti?',
      a: 'Dai classici olandesi da muro ai pratici trittici, fino ai modelli da scrivania perfetti per ogni ufficio romano.',
    },
    {
      q: 'Posso fornire la mia grafica completa?',
      a: 'Certamente, forniamo i tracciati di fustella così potrai creare il tuo progetto senza margini di errore.',
    },
    {
      q: 'Quali sono i tempi medi di produzione?',
      a: 'Per garantire la massima qualità a Roma, i tempi variano dai 5 ai 10 giorni lavorativi a seconda della complessità.',
    },
  ];

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": calendariFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema('Calendari Personalizzati', '/stampa-calendari');

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

      <HeroCalendari />
      
      {/* Future: Product grid section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">I Nostri Modelli 2026</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo completo dei calendari 2026 a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={calendariSteps} sectionTitle="Pianifica il tuo successo: come creiamo i tuoi calendari" />
      <Benefits benefits={calendariBenefits} sectionTitle="Il modo più efficace per promuovere il tuo brand a Roma tutto l'anno" />

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
            <a href="/stampa-sublimazione" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Sublimazione</h3>
              <p className="text-sm text-gray-600">Gadget e abbigliamento tecnico</p>
            </a>
            <a href="/pellicole-serigrafia" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Pellicole Serigrafiche</h3>
              <p className="text-sm text-gray-600">Servizio B2B per laboratori</p>
            </a>
          </div>
        </div>
      </section>

      <FAQ faqs={calendariFaqs} sectionTitle="Info su grafiche, formati e tempi di consegna calendari" />
    </>
  );
}
