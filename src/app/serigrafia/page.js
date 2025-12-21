// app/serigrafia/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "@/app/serigrafia/components/ProductCard";
import { HowItWorks, Benefits, FAQ } from "@/components/Sections";

// Base URL pubblico (SEO / schema / canonical)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const metadata = {
  title: "Serigrafia Professionale - DTF Italia",
  description:
    "Prodotti serigrafici di alta qualità per abbigliamento e gadget. Scopri la nostra gamma e ordina subito.",
  keywords: ["serigrafia", "stampa serigrafica", "gadget personalizzati"],
  openGraph: {
    title: "Serigrafia Professionale - DTF Italia",
    description:
      "Prodotti serigrafici di alta qualità per abbigliamento e gadget.",
    url: `${BASE_URL}/serigrafia`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
  },
};

export default async function SerigrafiaPage() {
  // Fetch server-side verso API interna
  const res = await fetch("/api/product/woocommerce?category", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Errore nel recupero prodotti WooCommerce");
  }

  const { products } = await res.json();

  // Schema JSON-LD (Collection + Products)
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/serigrafia`,
        "name": "Serigrafia Professionale",
        "description":
          "Prodotti serigrafici di alta qualità per abbigliamento e gadget.",
        "url": `${BASE_URL}/serigrafia`,
      },
      ...products.map((product) => ({
        "@type": "Product",
        "@id": `${BASE_URL}/serigrafia/${product.slug}`,
        "name": product.name,
        "image": product.images?.[0]?.src
          ? [product.images[0].src]
          : [`${BASE_URL}/placeholder.png`],
        "description":
          product.short_description || product.description || "",
        "sku": product.sku || String(product.id),
        "offers": {
          "@type": "Offer",
          "url": `${BASE_URL}/serigrafia/${product.slug}`,
          "priceCurrency": "EUR",
          "price": product.price || "0",
          "availability":
            product.stock_status === "instock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Canonical */}
      <link rel="canonical" href={`${BASE_URL}/serigrafia`} />

      <HeroSerigrafia />

      <main className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Prodotti Serigrafia
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <HowItWorks />
      <Benefits />
      <FAQ />
    </>
  );
}
