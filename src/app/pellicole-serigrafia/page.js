import HeroPellicoleSerigrafia from './components/HeroPellicoleSerigrafia';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumbs';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "Pellicole per Serigrafia Professionali - DTF Italia Roma",
  description: "Servizio di stampa pellicole ad alta definizione per laboratori serigrafici. Massima densità ottica (Dmax > 4.0) e stabilità dimensionale. Spedizione in tutta Italia.",
  keywords: "pellicole serigrafia, pellicole inkjet, pellicole laser, Dmax 4.0, laboratorio serigrafia Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Pellicole per Serigrafia Professionali - DTF Italia Roma",
    description: "Servizio di stampa pellicole ad alta definizione per laboratori serigrafici.",
    url: `${BASE_URL}/pellicole-serigrafia`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-pellicole.jpg`,
        width: 1200,
        height: 630,
        alt: "Pellicole serigrafiche professionali - DTF Italia Roma"
      }
    ]
  },
};

export default function PellicolePage() {
  // Service Schema (B2B)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/pellicole-serigrafia#service`,
    "name": "Stampa Pellicole Serigrafiche Professionali Roma",
    "description": "Servizio di stampa pellicole ad alta definizione per laboratori serigrafici.",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": [
      { "@type": "City", "name": "Roma" },
      { "@type": "Country", "name": "Italia" }
    ],
    "serviceType": "Stampa Pellicole Serigrafia",
    // TODO: Insert Google Business Profile URL when available
    // "mainEntityOfPage": "https://www.google.com/maps/place/...",
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image-pellicole.jpg`,
      "caption": "Pellicole serigrafiche professionali - DTF Italia Roma",
      "width": 1200,
      "height": 630
    }
  };

  const pellicoleSteps = [
    {
      num: '01',
      title: 'Analisi Grafica',
      desc: 'Verifichiamo la saturazione del nero nei tuoi file per assicurare uno stop alla luce ultravioletta perfetto.',
    },
    {
      num: '02',
      title: 'Stampa Alta Densità',
      desc: 'Utilizziamo sistemi inkjet calibrati per raggiungere una densità ottica superiore a 4.0.',
    },
    {
      num: '03',
      title: 'Stabilità Dimensionale',
      desc: 'Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa in 24/48h.',
    },
  ];

  const pellicoleBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Contrasto Assoluto',
      desc: 'Un nero profondo che permette tempi di esposizione precisi senza velature indesiderate.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Registro Perfetto',
      desc: 'Le nostre pellicole inkjet non subiscono dilatazioni termiche, ideali per la serigrafia a più colori a Roma.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione Nazionale',
      desc: 'Spedizione in tutta Italia in 24/48h. Ritira gratuitamente presso il nostro punto di produzione a Roma o ricevi comodamente a casa.',
    },
  ];

  const pellicoleFaqs = [
    {
      q: 'Qual è il Dmax garantito?',
      a: 'Le nostre pellicole inkjet raggiungono costantemente un Dmax di 4.0 o superiore, bloccando il 99.9% degli UV.',
    },
    {
      q: 'Posso usarle con bromografi a LED?',
      a: 'Assolutamente sì, sono state testate con successo sia su lampade classiche che su nuovi sistemi LED a Roma.',
    },
    {
      q: 'Offrite campionature di prova?',
      a: 'Sì, è possibile richiedere un test di stampa per verificare la compatibilità con il tuo processo di incisione.',
    },
  ];

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pellicoleFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema('Pellicole Serigrafia', '/pellicole-serigrafia');

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

      <HeroPellicoleSerigrafia />
      
      {/* Future: Product catalog section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Soluzioni Professionali</h2>
          <p className="text-gray-600">Esplora la nostra gamma di supporti per serigrafia a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={pellicoleSteps} sectionTitle="Precisione micrometrica: dalla tua grafica alla pellicola" />
      <Benefits benefits={pellicoleBenefits} sectionTitle="Pellicole Inkjet ad alta densità: lo standard per i laboratori romani" />

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
            <a href="/stampa-calendari" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">Calendari</h3>
              <p className="text-sm text-gray-600">Personalizzati da 1 a 1000+ pezzi</p>
            </a>
          </div>
        </div>
      </section>

      <FAQ faqs={pellicoleFaqs} sectionTitle="Dettagli tecnici sulle nostre pellicole professionali" />
    </>
  );
}
