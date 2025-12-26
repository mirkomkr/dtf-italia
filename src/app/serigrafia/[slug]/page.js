import { headers } from "next/headers";
import { notFound } from "next/navigation";
import GalleriaProdotto from "./galleriaProdotto";
// import SerigrafiaContainer from "@/components/configurator/serigrafia/SerigrafiaContainer"; // REMOVED
import dynamic from 'next/dynamic';
import SkeletonConfigurator from "@/components/ui/SkeletonConfigurator";
import LazyLoader from "@/components/common/LazyLoader";

const SerigrafiaContainer = dynamic(() => import('@/components/configurator/serigrafia/SerigrafiaContainer'), { 
  ssr: false,
  loading: () => <SkeletonConfigurator />
});
import { getWooCommerceProducts } from "@/lib/woocommerce";

/* ===============================
   FETCH SERVER (Direct Lib Call)
================================ */
async function getProduct(slug) {
  const products = await getWooCommerceProducts({ slug, perPage: 1 });
  return products?.[0] ?? null;
}

/* ===============================
   STATIC PARAMS GENERATION (SSG)
================================ */
export async function generateStaticParams() {
  // Fetch all products for this category to pre-render paths at build time
  const products = await getWooCommerceProducts({ 
    category: "stampa-abbigliamento-serigrafia", 
    perPage: 100 
  });
 
  return products.map((product) => ({
    slug: product.slug,
  }));
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
    <main 
      className="bg-gray-200"
      style={{ '--brand-color': '#dc2626' }}
    >
      <div className=" container mx-auto px-4 py-12">
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

      {/* Titolo Principale H1 */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        {product.name}
      </h1>

      {/* Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <GalleriaProdotto images={product.images} name={product.name} />
        
        {/* Lazy Loaded Configurator with Intersection Observer */}
        <LazyLoader placeholder={<SkeletonConfigurator />}>
          <SerigrafiaContainer 
            product={product} 
            enableVariants={!['cappello-con-visiera', 'borsa', 'shopper', 'gadget'].some(keyword => product.slug.includes(keyword))} 
          />
        </LazyLoader>
      </section>

      {/* Descrizione */}
      <section className="mt-12 bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-red-600 rounded-full" aria-hidden="true"></span>
          Descrizione prodotto:
        </h2>
        
        <div 
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-relaxed 
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
            prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />
      </section>

      {/* JSON-LD per SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      </div>
    </main>
  );
}
