import { getWooCommerceProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/common/ProductCard';
import Breadcrumb from '@/components/common/Breadcrumb';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "Catalogo Calendari Personalizzati Roma 2026 | DTF Italia",
  description: "Scopri tutti i modelli di calendari personalizzati: da muro, da scrivania, silhouette. Stampa offset premium per aziende ed eventi.",
  keywords: [
    "calendari personalizzati roma",
    "calendari aziendali",
    "calendario da muro",
    "calendario da scrivania",
    "stampa calendari 2026"
  ],
  authors: [{ name: "DTF Italia" }],
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  openGraph: {
    title: "Catalogo Calendari Personalizzati Roma 2026",
    description: "Calendari personalizzati con stampa offset professionale. Ideali per promozione aziendale e merchandising.",
    url: `${BASE_URL}/stampa-calendari/catalogo`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/stampa-calendari/catalogo`
  }
};

export default async function CalendariCatalogoPage() {
  const categorySlug = "calendari-personalizzati";
  
  let products = [];
  try {
    products = await getWooCommerceProducts({ 
      category: categorySlug,
      perPage: 50 
    });
  } catch (error) {
    console.error('Error fetching calendari products:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Catalogo Calendari Personalizzati 2026
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 leading-relaxed">
              Calendari personalizzati con stampa offset professionale. 
              Ideali per promozione aziendale, regali corporate e merchandising.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb />
      </div>

      {/* Products Grid */}
      <section id="prodotti-calendari" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  priority={i < 3} // LCP optimization
                  basePath="/stampa-calendari"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Nessun prodotto disponibile al momento.
              </p>
              <p className="text-gray-400 text-sm">
                I prodotti verranno aggiunti a breve. Contattaci per un preventivo personalizzato.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
