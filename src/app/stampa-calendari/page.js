import HeroCalendari from './components/HeroCalendari';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "Stampa Calendari Personalizzati 2026 Roma",
  description: "Creazione calendari personalizzati (1-1000+ pz) per privati e aziende. Alta qualità di stampa e spedizione rapida in tutta Italia.",
  keywords: "calendari personalizzati, calendari aziendali, calendari 2026, stampa calendari Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Stampa Calendari Personalizzati 2026 Roma",
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
  alternates: {
    canonical: `${BASE_URL}/stampa-calendari`
  }
};

export default function CalendariPage() {
  // Service Schema (SEO Optimization)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/stampa-calendari#service`,
    "name": "Calendari Personalizzati Roma",
    "description": "Creazione calendari personalizzati da 1 a 1000+ pezzi. Soluzioni per privati (foto di famiglia) e aziende (eventi e promozione).",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": [
      { "@id": "https://www.wikidata.org/wiki/Q220", "@type": "City", "name": "Roma" },
      { "@id": "https://www.wikidata.org/wiki/Q38", "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa Calendari",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-calendari.jpg`,
      "caption": "Calendario personalizzato 2026 - DTF Italia Roma",
      "width": 1200,
      "height": 630
    }
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

      <HeroCalendari />
      
      {/* Future: Product grid section */}
      <main id="prodotti-calendari" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">I Nostri Modelli 2026</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo completo dei calendari 2026 a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={calendariSteps} sectionTitle="Pianifica il tuo successo: come creiamo i tuoi calendari" />
      
      {/* Formati e Specifiche - SEO Content */}
      <section className="py-16 bg-white" aria-labelledby="calendari-details">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 id="calendari-details" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Formati e Soluzioni per Calendari Aziendali 2026
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Formati Disponibili</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Olandese da muro</strong>: formato classico 29x47 cm</li>
                  <li><strong>Trittico</strong>: 3 mesi visibili, ideale uffici</li>
                  <li><strong>Da scrivania</strong>: compatto e funzionale</li>
                  <li><strong>Poster</strong>: 50x70 cm, visione annuale</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Applicazioni Aziendali</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Marketing</strong>: logo e contatti sempre visibili</li>
                  <li><strong>Regali clienti</strong>: pensiero utile e duraturo</li>
                  <li><strong>Eventi</strong>: promozione manifestazioni annuali</li>
                  <li><strong>Interno</strong>: pianificazione team e scadenze</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Specifiche Tecniche</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Stampa</h4>
                  <p>Offset professionale</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Carta</h4>
                  <p>Patinata 170-300 gr/m²</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Rilegatura</h4>
                  <p>Spirale metallica</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Quantità Minima</h4>
                  <p>Da 1 pezzo</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Tempi Produzione</h4>
                  <p>5-10 giorni lavorativi</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Personalizzazione</h4>
                  <p>Logo, foto, grafiche custom</p>
                </div>
              </div>
              <p className="mt-6 text-gray-700">
                {/* PLACEHOLDER: Espandere con dettagli reali */}
                I calendari personalizzati sono il miglior investimento marketing a Roma: 365 giorni di visibilità garantita. 
                Forniamo tracciati di fustella per progettazione autonoma o servizio grafico completo. Ideali per aziende, 
                studi professionali, associazioni e privati che vogliono un regalo unico.
              </p>
            </div>
          </div>
        </div>
      </section>
      
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
            <a href="/stampa-serigrafica" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
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
