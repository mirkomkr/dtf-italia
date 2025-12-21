import { headers } from "next/headers";
import { notFound } from "next/navigation";
import GalleriaProdotto from "./galleriaProdotto";
import Configurator from "../components/ConfiguratoreSerigrafia";

/* ===============================
   FETCH SERVER (URL assoluto)
================================ */
async function getProduct(slug) {
  const host = process.env.NODE_ENV === "development" ? "localhost:3000" : "www.dtfitalia.it";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/product/woocommerce?perPage=1&slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const { products } = await res.json();
  return products?.[0] ?? null;
}

/* ===============================
   SEO DINAMICO (Next best practice)
================================ */
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return {};

  const image = product.images?.[0]?.src;

  return {
    title: `${product.name} | Serigrafia Professionale`,
    description:
      product.short_description
        ?.replace(/<[^>]+>/g, "")
        .slice(0, 160) || product.name,
    openGraph: {
      title: product.name,
      description: product.short_description || product.name,
      images: image ? [image] : [],
      type: "website",
    },
    alternates: {
      canonical: `/serigrafia/${product.slug}`,
    },
  };
}

/* ===============================
   PAGINA PRODOTTO
================================ */
export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // JSON-LD Schema per SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => img.src) || ["https://www.dtfitalia.it/placeholder.png"],
    "description": product.description || "",
    "sku": product.sku || "",
    "brand": {
      "@type": "Brand",
      "name": "DTF Italia"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.dtfitalia.it/serigrafia/${product.slug}`,
      "priceCurrency": "EUR",
      "price": product.price || "0",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex gap-1 flex-wrap">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li><a href="/serigrafia" className="hover:underline">Serigrafia</a></li>
          <li>/</li>
          <li aria-current="page" className="text-gray-900 font-semibold">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <GalleriaProdotto images={product.images} name={product.name} />
        <Configurator product={product} />
      </section>

      {/* Descrizione */}
      <section className="mt-16 prose prose-indigo max-w-none">
        <h2>Descrizione prodotto</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </section>

      {/* JSON-LD per SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
