import HeroSublimazione from './components/HeroSublimazione';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumbs';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "Stampa Sublimazione Roma - Gadget e Sport",
  description: "Personalizzazione tramite sublimazione per tazze, cuscini, mousepad e maglie sportive. Ideale per regali e promozioni. Spedizione in tutta Italia.",
  keywords: "stampa sublimazione, gadget personalizzati, abbigliamento tecnico, tazze personalizzate, Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Stampa Sublimazione Roma - Gadget e Sport",
    description: "Personalizzazione tramite sublimazione per tazze, cuscini, calzini, mousepad e maglie sportive.",
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
  alternates: {
    canonical: `${BASE_URL}/stampa-sublimazione`
  }
};

export default function SublimationPage() {
  // Service Schema (SEO Optimization)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/stampa-sublimazione#service`,
    "name": "Stampa a Sublimazione Roma (Gadget e Abbigliamento Tecnico)",
    "description": "Personalizzazione tramite sublimazione per tazze, cuscini, calzini, mousepad e maglie sportive. Ideale per regali e promozioni.",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": [
      { "@id": "https://www.wikidata.org/wiki/Q220", "@type": "City", "name": "Roma" },
      { "@id": "https://www.wikidata.org/wiki/Q38", "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa Sublimazione",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-sublimazione.jpg`,
      "caption": "Tazza personalizzata con stampa a sublimazione - DTF Italia Roma",
      "width": 1200,
      "height": 630
    }
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

      <HeroSublimazione />
      
      {/* Future: Product grid section */}
      <main id="prodotti-sublimazione" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prodotti in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo prodotti per la sublimazione a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={sublimazioneSteps} sectionTitle="Come trasformiamo le tue idee in oggetti unici" />
      
      {/* Materiali e Specifiche - SEO Content */}
      <section className="py-16 bg-white" aria-labelledby="sublimazione-details">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 id="sublimazione-details" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Materiali e Applicazioni della Sublimazione
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 Materiali Utilizzati</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Inchiostri sublimazione</strong>: colori brillanti e duraturi</li>
                  <li><strong>Carta transfer</strong>: alta definizione fotografica</li>
                  <li><strong>Supporti poliestere</strong>: tessuti tecnici 100% poliestere</li>
                  <li><strong>Rivestimenti speciali</strong>: ceramica, metallo, plastica</li>
                </ul>
              </div>
              
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Applicazioni Ideali</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Gadget rigidi</strong>: tazze, mousepad, piastre</li>
                  <li><strong>Abbigliamento tecnico</strong>: maglie sportive, divise</li>
                  <li><strong>Regali personalizzati</strong>: cuscini, coperte</li>
                  <li><strong>Promozioni aziendali</strong>: gadget brandizzati</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Specifiche Tecniche</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Temperatura</h4>
                  <p>180-200°C</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Tempo Pressatura</h4>
                  <p>45-60 secondi</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Risoluzione</h4>
                  <p>Fino a 1440 DPI</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Resistenza</h4>
                  <p>50+ lavaggi a 40°C</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Colori</h4>
                  <p>Quadricromia CMYK</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Quantità Minima</h4>
                  <p>1 pezzo</p>
                </div>
              </div>
              <p className="mt-6 text-gray-700">
                {/* PLACEHOLDER: Espandere con dettagli tecnici reali */}
                La sublimazione è ideale per tessuti bianchi o chiari in poliestere. Il calore trasforma l'inchiostro in gas che penetra nelle fibre, 
                creando stampe fotografiche permanenti e resistenti. Perfetta per abbigliamento sportivo e gadget promozionali a Roma.
              </p>
            </div>
          </div>
        </div>
      </section>
      
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
            <a href="/stampa-serigrafica" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
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
