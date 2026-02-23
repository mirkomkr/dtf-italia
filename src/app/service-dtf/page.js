// app/service-dtf/page.js
import HeroDTF from "./components/HeroDTF";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import { HowItWorks, Benefits, FAQ } from '@/components/home/Sections';
import dynamic from 'next/dynamic';

// Lazy load configurator (not critical for initial render)
const DTFContainer = dynamic(() => import('@/components/configurator/dtf/DTFContainer'), {
  ssr: false,
  loading: () => (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-2xl min-h-[700px] w-full flex items-center justify-center">
      <div className="animate-pulse text-slate-600 font-medium">Inizializzazione configuratore...</div>
    </div>
  )
});

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "DTF Service Roma - Transfer Professionali",
  description:
    "Servizio professionale di stampa DTF per terzi e professionisti della personalizzazione. Alta qualità, spedizione in 24h, nessun minimo d'ordine.",
  keywords: [
    "dtf service",
    "service dtf roma",
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
    title: "DTF Service Roma - Transfer Professionali",
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
  alternates: {
    canonical: `${BASE_URL}/service-dtf`
  }
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

  // Fallback product
  const finalProduct = dtfProduct || { 
    id: 'dtf-service', 
    name: 'Service Stampa DTF', 
    slug: 'service-stampa-dtf-roma' 
  };

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
      { "@id": "https://www.wikidata.org/wiki/Q220", "@type": "City", "name": "Roma" },
      { "@id": "https://www.wikidata.org/wiki/Q38", "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa DTF",
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

  // Breadcrumb Schema
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
      icon: 'Zap',  // ✅ String instead of JSX
      title: 'Semplicità Totale',
      desc: 'Un processo d\'ordine fluido pensato per farti risparmiare tempo prezioso ogni giorno.',
    },
    {
      icon: 'ShieldCheck',  // ✅ String instead of JSX
      title: 'Affidabilità Roma',
      desc: 'Siamo il partner tecnico di centinaia di professionisti romani che richiedono puntualità e qualità.',
    },
    {
      icon: 'Truck',  // ✅ String instead of JSX
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
        {/* Hero Section */}
        <HeroDTF 
          title={
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                DTF
              </span>{' '}
              Service Roma
            </>
          }
        />

        {/* Configurator Section - Lazy loaded */}
        <section 
          id="configurator-section" 
          className="py-16 bg-gradient-to-b from-slate-50 to-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  Configura il Tuo Ordine
                </h2>
                <p className="text-lg text-gray-600">
                  Seleziona formato e quantità, carica il tuo file e ricevi un preventivo istantaneo.
                </p>
              </div>
              
              <DTFContainer product={finalProduct} />
            </div>
          </div>
        </section>

        {/* DTF vs Altre Tecniche - SEO Content Section */}
        <section className="py-20 bg-white" aria-labelledby="dtf-comparison-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              <h2 
                id="dtf-comparison-heading"
                className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
              >
                Perché Scegliere la Stampa DTF?
              </h2>

              {/* Comparison Grid */}
              <div className="space-y-8">
                
                {/* DTF vs Serigrafia */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-indigo-600">DTF</span> vs Serigrafia
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">✅ Vantaggi DTF:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Nessun minimo d'ordine</strong>: dalla singola stampa in su</li>
                        <li><strong>Colori illimitati</strong>: riproduzioni fotografiche HD</li>
                        <li><strong>Dettagli perfetti</strong>: sfumature e gradienti impeccabili</li>
                        <li><strong>Tempi rapidi</strong>: produzione in 24h</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">🎨 Quando scegliere Serigrafia:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Grandi quantità</strong>: oltre 30 pezzi per colore</li>
                        <li><strong>Colori Pantone</strong>: matching esatto brand identity</li>
                        <li><strong>Costo unitario</strong>: più conveniente su alte tirature</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* DTF vs Sublimazione */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-indigo-600">DTF</span> vs Sublimazione
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">✅ Vantaggi DTF:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Funziona su cotone scuro</strong>: bianco coprente garantito</li>
                        <li><strong>Più resistente</strong>: oltre 50 lavaggi senza sbiadire</li>
                        <li><strong>Versatilità materiali</strong>: cotone, poliestere, misti</li>
                        <li><strong>Mano morbida</strong>: nessun effetto plastica</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">💧 Quando scegliere Sublimazione:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Gadget rigidi</strong>: tazze, mousepad, piastre</li>
                        <li><strong>Tessuti tecnici bianchi</strong>: poliestere 100%</li>
                        <li><strong>Stampa total print</strong>: copertura completa</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* DTF vs Transfer Tradizionale */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-indigo-600">DTF</span> vs Transfer Tradizionale
                  </h3>
                  <div className="text-gray-700 space-y-3">
                    <p>
                      <strong className="text-gray-900">Elasticità superiore:</strong> Il DTF segue perfettamente i movimenti del tessuto senza creparsi, 
                      a differenza dei transfer tradizionali che tendono a screpolarsi dopo pochi lavaggi.
                    </p>
                    <p>
                      <strong className="text-gray-900">Resistenza ai lavaggi:</strong> Oltre 50 cicli di lavaggio a 40°C senza perdita di colore, 
                      mentre i transfer tradizionali iniziano a sbiadire dopo 10-15 lavaggi.
                    </p>
                    <p>
                      <strong className="text-gray-900">Nessun effetto plastica:</strong> La stampa DTF ha una mano morbida e traspirante, 
                      eliminando completamente l'effetto "plasticoso" tipico dei vecchi transfer.
                    </p>
                  </div>
                </div>

              </div>

              {/* CTA Box */}
              <div className="mt-12 text-center p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <p className="text-lg text-gray-700 mb-4">
                  <strong className="text-gray-900">Non sei sicuro quale tecnica scegliere?</strong>
                </p>
                <p className="text-gray-600">
                  {/* PLACEHOLDER: Inserire contatto reale quando disponibile */}
                  Il nostro team è a disposizione per consigliarti la soluzione migliore per il tuo progetto. 
                  Ogni tecnica ha i suoi punti di forza: ti aiutiamo a scegliere quella perfetta per le tue esigenze.
                </p>
              </div>

            </div>
          </div>
        </section>

        <HowItWorks steps={dtfSteps} sectionTitle="Il tuo ordine DTF pronto in 3 semplici passaggi" />
        <Benefits benefits={dtfBenefits} sectionTitle="Perché i professionisti di Roma scelgono il nostro DTF Service" />
        <FAQ faqs={dtfFaqs} sectionTitle="Tutto quello che devi sapere sulla stampa DTF" />
      </div>
    </>
  );
}
