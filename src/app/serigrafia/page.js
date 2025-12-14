// app/serigrafia/page.js
import HeroSerigrafia from "./components/HeroSerigrafia";
import ProductCard from "@/components/ProductCard";
import Head from "next/head";
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import ConfiguratorFelpa from "./components/ConfiguratorFelpa";

export const metadata = {
  title: "Serigrafia Professionale - DTF PRO",
  description: "Prodotti serigrafici di alta qualità per abbigliamento e gadget. Scopri la nostra gamma e ordina subito.",
  keywords: "serigrafia, stampa serigrafica, gadget personalizzati",
  openGraph: {
    title: "Serigrafia Professionale - DTF PRO",
    description: "Prodotti serigrafici di alta qualità per abbigliamento e gadget.",
    url: "https://dtfpro.example.com/serigrafia",
    siteName: "DTF PRO",
    locale: "it_IT",
    type: "website",
  },
};

export default async function SerigrafiaPage() {
  // Fetch prodotti della categoria Serigrafia
  const res = await fetch("http://localhost:3000/api/product/woocommerce?category=16", { cache: "no-store" });
  const { products } = await res.json();

  // Schema JSON-LD per landing e prodotti
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Serigrafia Professionale",
        "description": "Prodotti serigrafici di alta qualità per abbigliamento e gadget.",
        "url": "https://dtfpro.example.com/serigrafia"
      },
      ...products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "image": product.images?.[0]?.src || "https://dtfpro.example.com/placeholder.png",
        "description": product.description || "",
        "sku": product.sku || "",
        "offers": {
          "@type": "Offer",
          "url": `https://dtfpro.example.com/serigrafia/${product.slug}`,
          "priceCurrency": product.currency || "EUR",
          "price": product.price || "0",
          "availability": "https://schema.org/InStock"
        }
      }))
    ]
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <link rel="canonical" href="https://dtfpro.example.com/serigrafia" />
      </Head>

      <HeroSerigrafia />

      <main className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Prodotti Serigrafia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ConfiguratorFelpa />
      </main>

      <HowItWorks />
      <Benefits />
      <FAQ />
    </>
  );
}
