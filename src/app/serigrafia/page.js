// app/serigrafia/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "./components/ProductCard";
import { HowItWorks, Benefits, FAQ } from "@/components/Sections";
import Head from "next/head";

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

  const host = process.env.NEXT_PUBLIC_SITE_URL || "www.dtfitalia.it";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let products = [];

  try {
const host = process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000";
const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

const res = await fetch(`${protocol}://${host}/api/product/woocommerce?category=${categorySlug}`, {
  next: { revalidate: 60 }
});



    if (!res.ok) {
      const text = await res.text();
      console.error("Errore fetch API:", text);
    } else {
      const data = await res.json();
      products = data.products ?? [];
    }
  } catch (err) {
    console.error("Errore fetch prodotti:", err);
  }

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
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <meta name="viewport" content={metadata.viewport} />

        {/* OpenGraph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

        {/* Canonical */}
        <link rel="canonical" href={metadata.openGraph.url} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <HeroSerigrafia />

      <main className="bg-gray-200 container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Stampa Serigrafica Professionale</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">Nessun prodotto disponibile al momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <HowItWorks />
      <Benefits />
      <FAQ />
    </>
  );
}
