import HeroPellicoleSerigrafia from './components/HeroPellicoleSerigrafia';
import { HowItWorks, Benefits, FAQ } from '@/components/home/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "Pellicole Serigrafiche Professionali Roma",
  description: "Stampa pellicole serigrafiche ad alta definizione per laboratori. Dmax > 4.0, nero coprente e stabilità dimensionale. Spedizioni rapide in tutta Italia.",
  keywords: "pellicole serigrafia, pellicole inkjet, pellicole laser, Dmax 4.0, laboratorio serigrafia Roma",
  authors: [{ name: "DTF Italia" }],
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large", maxVideoPreview: -1 },
  openGraph: {
    title: "Pellicole Serigrafiche Professionali Roma",
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
  alternates: {
    canonical: `${BASE_URL}/pellicole-serigrafia`
  }
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
      { "@id": "https://www.wikidata.org/wiki/Q220", "@type": "City", "name": "Roma" },
      { "@id": "https://www.wikidata.org/wiki/Q38", "@type": "Country", "name": "Italia" }
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

      <HeroPellicoleSerigrafia />
      
      {/* Future: Product catalog section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Soluzioni Professionali</h2>
          <p className="text-gray-600">Esplora la nostra gamma di supporti per serigrafia a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={pellicoleSteps} sectionTitle="Precisione micrometrica: dalla tua grafica alla pellicola" />
      
      {/* Specifiche Tecniche B2B - SEO Content */}
      <section className="py-16 bg-white" aria-labelledby="pellicole-details">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 id="pellicole-details" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Pellicole Professionali per Laboratori Serigrafici
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Tipologie Pellicole</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Inkjet</strong>: alta densità ottica Dmax &gt;4.0</li>
                  <li><strong>Laser</strong>: compatibilità universale stampanti</li>
                  <li><strong>Formato A3+</strong>: fino a 33x48 cm</li>
                  <li><strong>Stabilità dimensionale</strong>: zero deformazioni</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Applicazioni Professionali</h3>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>Serigrafia tessile</strong>: abbigliamento e gadget</li>
                  <li><strong>Serigrafia industriale</strong>: cartelli, insegne</li>
                  <li><strong>Circuiti stampati</strong>: elettronica</li>
                  <li><strong>Vetro e ceramica</strong>: decorazioni artistiche</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Specifiche Tecniche</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Densità Ottica</h4>
                  <p>Dmax superiore a 4.0</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Risoluzione</h4>
                  <p>Fino a 1440 DPI</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Spessore</h4>
                  <p>100-125 micron</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Formato Max</h4>
                  <p>A3+ (33x48 cm)</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Compatibilità</h4>
                  <p>Inkjet e Laser</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Quantità Minima</h4>
                  <p>10 fogli</p>
                </div>
              </div>
              <p className="mt-6 text-gray-700">
                {/* PLACEHOLDER: Espandere con dettagli tecnici reali */}
                Le nostre pellicole garantiscono uno stop perfetto alla luce UV, essenziale per l'incisione di telai serigrafici. 
                Nero coprente al 100%, nessuna velatura, stabilità dimensionale garantita. Ideali per laboratori professionali a Roma 
                che richiedono precisione assoluta e risultati ripetibili.
              </p>
            </div>
          </div>
        </div>
      </section>
      
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
            <a href="/stampa-serigrafica" className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
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
