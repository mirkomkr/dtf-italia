// app/serigrafia/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "./components/ProductCard";
// import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import { getWooCommerceProducts } from "@/lib/woocommerce";
import dynamic from 'next/dynamic';

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

      <HowItWorks />
      <Benefits />
      <FAQ />
    </>
  );
}
