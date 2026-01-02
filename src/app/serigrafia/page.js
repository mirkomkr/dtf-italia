// app/serigrafia/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "./components/ProductCard";
// import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import dynamic from 'next/dynamic';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

const HowItWorks = dynamic(() => import('@/components/Sections').then(mod => mod.HowItWorks), { ssr: true });
const Benefits = dynamic(() => import('@/components/Sections').then(mod => mod.Benefits), { ssr: true });
const FAQ = dynamic(() => import('@/components/Sections').then(mod => mod.FAQ), { ssr: true });

// Metadata SEO
export const metadata = {
  title: "Stampa Serigrafica Professionale - DTF Italia Roma",
  description: "Serigrafia professionale a Roma specializzata in stampa su abbigliamento e gadget: t-shirt, magliette, felpe, felpe con cappuccio, cappelli, borse e gadget personalizzati. Alta qualità e produzione rapida per privati e aziende.",
  keywords: "stampa serigrafica, abbigliamento personalizzato, gadget personalizzati, DTF Roma",
  authors: [{ name: "DTF Italia" }],
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  openGraph: {
    title: "Stampa Serigrafica Professionale - DTF Italia Roma",
    description: "Serigrafia professionale a Roma specializzata in stampa su abbigliamento e gadget.",
    url: "https://www.dtfitalia.it/serigrafia",
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://www.dtfitalia.it/og-image-serigrafia.jpg",
        width: 1200,
        height: 630,
        alt: "Stampa Serigrafica Professionale DTF Italia Roma"
      }
    ]
  },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default async function SerigrafiaPage() {
  const categorySlug = "stampa-abbigliamento-serigrafia";
  const pageSlug = "serigrafia";

  let products = await getWooCommerceProducts({ 
    category: categorySlug,
    perPage: 50, // Limit high enough for this page

  });

  // Schema JSON-LD derivato dai prodotti
  const schemaProducts = products.map(product => ({
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.src || "https://www.dtfitalia.it/placeholder.png",
    "description": product.description || "",
    "sku": product.sku || "",
    "offers": {
      "@type": "Offer",
      "url": `https://www.dtfitalia.it/${pageSlug}/${product.slug}`,
      "priceCurrency": "EUR",
      "price": product.price || "0",
      "availability": "https://schema.org/InStock"
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Stampa Serigrafica Professionale",
        "description": metadata.description,
        "url": `https://www.dtfitalia.it/${pageSlug}`
      },
      ...schemaProducts
    ]
  };

  const serigrafiaSteps = [
    {
      num: '01',
      title: 'Creazione Telai',
      desc: 'Incisione professionale dei telai serigrafici con emulsioni di alta qualità per dettagli nitidi a Roma.',
    },
    {
      num: '02',
      title: 'Inchiostrazione a Mano',
      desc: 'Applicazione degli inchiostri (Plastisol o Water-based) per una coprenza perfetta e colori vibranti.',
    },
    {
      num: '03',
      title: 'Asciugatura in Forno',
      desc: 'Fissaggio termico professionale per garantire la massima resistenza ai lavaggi nel tempo.',
    },
  ];

  const serigrafiaBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Prezzi Imbattibili',
      desc: 'La soluzione più economica a Roma per grandi tirature di magliette e felpe.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Resistenza Estrema',
      desc: 'Stampe che durano anni, ideali per abbigliamento da lavoro e merchandising.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Colori Pantone',
      desc: 'Garantiamo la fedeltà cromatica dei tuoi loghi aziendali con il sistema Pantone.',
    },
  ];

  const serigrafiaFaqs = [
    {
      q: 'Qual è il minimo d\'ordine per la serigrafia?',
      a: 'Per la serigrafia tradizionale a Roma consigliamo un minimo di 20-30 pezzi per ammortizzare i costi d\'impianto.',
    },
    {
      q: 'Posso stampare su qualsiasi tessuto?',
      a: 'Sì, la serigrafia è estremamente versatile: cotone, poliestere, nylon e misti.',
    },
    {
      q: 'Quanto tempo occorre per la produzione?',
      a: 'Solitamente i tempi di consegna a Roma variano dai 5 ai 7 giorni lavorativi in base al carico del laboratorio.',
    },
  ];

  return (
    <>
      {/* JSON-LD Script - Placed in body, ensuring it doesn't block hydration */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroSerigrafia />

      <main 
        className="bg-gray-200"
        style={{ '--brand-color': '#dc2626' }}
      >
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Stampa Serigrafica</h1>

        <h2 className="sr-only">I nostri prodotti</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">Nessun prodotto disponibile al momento.</p>
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

      <HowItWorks steps={serigrafiaSteps} titoloTecnica="Serigrafia" />
      <Benefits benefits={serigrafiaBenefits} titoloTecnica="Serigrafia" />
      <FAQ faqs={serigrafiaFaqs} titoloTecnica="Serigrafia" />
    </>
  );
}
