// app/stampa-serigrafica/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "@/components/catalog/ProductCard";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import { generateBreadcrumbSchema } from "@/lib/schemas/breadcrumbs";
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

// Metadata SEO
export const metadata = {
  title: {
    absolute: "Stampa Serigrafica Roma - Abbigliamento e Gadget"
  },
  description: "Serigrafia professionale a Roma: stampa t-shirt, felpe e gadget. Alta qualità, produzione rapida e spedizione 24h in tutta Italia.",
  keywords: "stampa serigrafica, abbigliamento personalizzato, gadget personalizzati, DTF Roma",
  authors: [{ name: "DTF Italia" }],
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  openGraph: {
    title: "Stampa Serigrafica Roma - Abbigliamento e Gadget",
    description: "Serigrafia professionale a Roma: stampa t-shirt, felpe e gadget. Alta qualità e spedizione rapida.",
    url: `${BASE_URL}/stampa-serigrafica`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-serigrafia.jpg`,
        width: 1200,
        height: 630,
        alt: "Dettaglio stampa serigrafica professionale su tessuto - Laboratorio DTF Italia Roma"
      }
    ]
  },
  alternates: {
    canonical: `${BASE_URL}/stampa-serigrafica`
  }
};

export const viewport = { width: "device-width", initialScale: 1 };

export default async function SerigrafiaPage() {
  const categorySlug = "stampa-abbigliamento-serigrafia";
  const pageSlug = "serigrafia";

  let products = [];
  try {
    products = await getWooCommerceProducts({ 
      category: categorySlug,
      perPage: 50, // Limit high enough for this page
    });
  } catch (error) {
    console.error("Error fetching products for Serigrafia page:", error);
    // Silent fail -> renders empty product grid
  }

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/stampa-serigrafica#service`,
    "name": "Stampa Serigrafica e Digitale Roma",
    "description": "Servizio di stampa serigrafica per grandi tirature (oltre 30 pezzi) e stampa digitale per pezzi singoli o piccole quantità.",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": [
      { "@id": "https://www.wikidata.org/wiki/Q220", "@type": "City", "name": "Roma" },
      { "@id": "https://www.wikidata.org/wiki/Q38", "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa Serigrafica",
    // TODO: Insert Google Business Profile URL when available
    // "mainEntityOfPage": "https://www.google.com/maps/place/...",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-serigrafia.jpg`,
      "caption": "Dettaglio stampa serigrafica professionale su tessuto - Laboratorio DTF Italia Roma",
      "width": 1200,
      "height": 630
    }
  };

  // Define FAQs first (needed by FAQ schema)
  const serigrafiaFaqs = [
    {
      q: 'Quanti colori posso stampare in serigrafia?',
      a: 'Gestiamo fino a 6 colori spot, garantendo una fedeltà cromatica assoluta e una coprenza perfetta anche su fondi scuri.',
    },
    {
      q: 'È adatta per piccole quantità?',
      a: 'A causa dei costi di impianto telaio, a Roma la consigliamo solitamente per ordini superiori ai 30-50 pezzi.',
    },
    {
      q: 'Quali inchiostri utilizzate?',
      a: 'Utilizziamo solo inchiostri eco-compatibili e plastisol ad alta densità per una finitura professionale e duratura.',
    },
  ];


  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": serigrafiaFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema('Stampa Serigrafica', '/stampa-serigrafica');

  // Products Schema (existing)
  const schemaProducts = products.map(product => ({
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.src || `${BASE_URL}/placeholder.png`,
    "description": product.description || "",
    "sku": product.sku || "",
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/stampa-serigrafica/${product.slug}`,
      "priceCurrency": "EUR",
      "price": product.price || "0",
      "availability": "https://schema.org/InStock"
    }
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Stampa Serigrafica Professionale",
        "description": metadata.description,
        "url": `${BASE_URL}/stampa-serigrafica`
      },
      ...schemaProducts
    ]
  };

  const serigrafiaSteps = [
    {
      num: '01',
      title: 'Fotoincisione',
      desc: 'Prepariamo le matrici serigrafiche con emulsioni di alta gamma per catturare ogni minimo dettaglio del tuo logo.',
    },
    {
      num: '02',
      title: 'Stampa Manuale',
      desc: 'Regoliamo la pressione e l\'ANGOLO di stampa a mano per assicurare una stesura dell\'inchiostro omogenea e coprente.',
    },
    {
      num: '03',
      title: 'Controllo Qualità',
      desc: 'Ogni pezzo viene verificato manualmente nel nostro laboratorio di Roma prima di passare al fissaggio termico.',
    },
  ];

  const serigrafiaBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Resa Incantevole',
      desc: 'L\'inchiostro penetra nelle fibre regalando una brillantezza e una morbidezza uniche nel loro genere.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Durata Senza Pari',
      desc: 'La tecnica perfetta per capi da lavoro e merchandising che devono resistere a infiniti cicli di lavaggio.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione Nazionale',
      desc: 'Spedizione in tutta Italia in 24/48h. Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <HeroSerigrafia />

      <main id="prodotti-serigrafia"
        className="bg-gray-200"
        style={{ '--brand-color': '#dc2626' }}
      >
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Stampa Serigrafica</h2>

        <h3 className="sr-only">I nostri prodotti</h3>

        {products.length === 0 ? (
          <p className="text-center text-gray-700">Nessun prodotto disponibile al momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                priority={index < 2}
              />
            ))}
          </div>
        )}
        </div>
      </main>

      <HowItWorks steps={serigrafiaSteps} sectionTitle="Dalla bozza al telaio: il nostro processo artigianale" />
      <Benefits benefits={serigrafiaBenefits} sectionTitle="I vantaggi della serigrafia professionale nel nostro laboratorio" />
      
      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Serigrafia vs Digitale: Quale Scegliere?</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="border border-red-700 p-4 text-left">Caratteristica</th>
                <th className="border border-red-700 p-4 text-left">Serigrafia</th>
                <th className="border border-red-700 p-4 text-left">Stampa Digitale</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 font-semibold">Quantità Minima</td>
                <td className="border border-gray-300 p-4">30+ pezzi</td>
                <td className="border border-gray-300 p-4">1 pezzo</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 font-semibold">Durata</td>
                <td className="border border-gray-300 p-4">Eccellente (500+ lavaggi)</td>
                <td className="border border-gray-300 p-4">Buona (100+ lavaggi)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 font-semibold">Costo Unitario</td>
                <td className="border border-gray-300 p-4">Basso su grandi quantità</td>
                <td className="border border-gray-300 p-4">Fisso per ogni pezzo</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 font-semibold">Colori</td>
                <td className="border border-gray-300 p-4">Fino a 6 colori spot</td>
                <td className="border border-gray-300 p-4">Quadricromia illimitata</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Quando Scegliere la Serigrafia - SEO Content Section */}
      <section className="py-20 bg-white" aria-labelledby="when-choose-serigrafia">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            <h2 
              id="when-choose-serigrafia"
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
            >
              Serigrafia Professionale: La Scelta Ideale per Grandi Quantità
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              
              {/* Quando Scegliere */}
              <div className="bg-orange-50 rounded-2xl p-6 md:p-8 border border-orange-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Quando Scegliere la Serigrafia
                </h3>
                <p className="mb-4">
                  La stampa serigrafica è la tecnica perfetta per <strong className="text-gray-900">ordini da 30 pezzi in su</strong>. 
                  Più alta è la quantità, più il costo unitario si riduce, rendendola la soluzione più economica per grandi tirature. 
                  Ideale per magliette aziendali, eventi sportivi, merchandising, divise scolastiche e gadget promozionali.
                </p>
                <p>
                  Con la serigrafia ottieni <strong className="text-gray-900">colori Pantone certificati</strong>, garantendo la perfetta corrispondenza 
                  con la tua brand identity. La durabilità è eccezionale: oltre <strong className="text-gray-900">100 lavaggi</strong> senza perdita di intensità cromatica.
                </p>
              </div>

              {/* Materiali e Applicazioni */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    📦 Materiali Utilizzati
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Inchiostri plastisol</strong>: massima opacità e durata</li>
                    <li><strong>Inchiostri ad acqua</strong>: mano morbida, eco-friendly</li>
                    <li><strong>Inchiostri speciali</strong>: glitter, fluo, puff (effetto 3D)</li>
                    <li><strong>Supporti</strong>: cotone, poliestere, misti, canvas</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    ✨ Applicazioni Ideali
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Abbigliamento aziendale</strong>: t-shirt, polo, felpe</li>
                    <li><strong>Eventi</strong>: concerti, festival, manifestazioni</li>
                    <li><strong>Sport</strong>: divise squadre, maglie tecniche</li>
                    <li><strong>Gadget</strong>: shopper, zaini, cappellini</li>
                  </ul>
                </div>
              </div>

              {/* Specifiche Tecniche */}
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🔧 Specifiche Tecniche
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Quantità Minima</h4>
                    <p>30 pezzi per colore</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Colori Disponibili</h4>
                    <p>Fino a 6 colori spot Pantone</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Tempi Produzione</h4>
                    <p>5-7 giorni lavorativi</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Dimensione Max</h4>
                    <p>40x50 cm (A3+)</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Resistenza</h4>
                    <p>100+ lavaggi a 40°C</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Finitura</h4>
                    <p>Opaca, lucida, glitter</p>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="mt-8 text-center p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-900">Hai bisogno di grandi quantità?</strong>
                </p>
                <p className="text-gray-600">
                  {/* PLACEHOLDER: Inserire contatto reale quando disponibile */}
                  Contattaci per un preventivo personalizzato. Più ordini, più risparmi con la serigrafia professionale a Roma.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Servizi Correlati</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="/service-dtf" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">DTF Service</h3>
              <p className="text-sm text-gray-600">Stampa transfer digitale</p>
            </a>
            <a href="/stampa-sublimazione" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Sublimazione</h3>
              <p className="text-sm text-gray-600">Gadget e abbigliamento tecnico</p>
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

      <FAQ faqs={serigrafiaFaqs} sectionTitle="Consigli tecnici e dubbi sulla stampa serigrafica" />
    </>
  );
}
