import { getWooCommerceProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/shared/ProductCard';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

export const metadata = {
  title: "Catalogo Sublimazione Roma - Abbigliamento Sportivo | DTF Italia",
  description: "Scopri tutti i prodotti disponibili per stampa sublimazione: magliette tecniche, tute sportive e abbigliamento personalizzato. Stampa fotografica HD su tessuti sintetici.",
  keywords: [
    "sublimazione roma",
    "stampa sublimazione",
    "abbigliamento sportivo personalizzato",
    "magliette tecniche",
    "stampa fotografica tessuti"
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
    title: "Catalogo Sublimazione Roma - Abbigliamento Sportivo",
    description: "Stampa sublimazione professionale su abbigliamento sportivo. Colori vibranti, alta definizione, resistenza ai lavaggi.",
    url: `${BASE_URL}/stampa-sublimazione/catalogo`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/stampa-sublimazione/catalogo`
  }
};

export default async function SublimazioneCatalogoPage() {
  const categorySlug = "stampa-sublimazione";
  
  let products = [];
  try {
    products = await getWooCommerceProducts({ 
      category: categorySlug,
      perPage: 50 
    });
  } catch (error) {
    console.error('Error fetching sublimazione products:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-700 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Catalogo Sublimazione Roma
            </h1>
            <p className="text-lg sm:text-xl text-violet-100 leading-relaxed">
              Stampa sublimazione professionale su abbigliamento sportivo e tessuti sintetici. 
              Colori vibranti, alta definizione fotografica, resistenza ai lavaggi.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="prodotti-sublimazione" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  priority={i < 4} // LCP optimization
                  basePath="/stampa-sublimazione"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Nessun prodotto disponibile al momento.
              </p>
              <p className="text-gray-400 text-sm">
                I prodotti verranno aggiunti a breve. Contattaci per maggiori informazioni.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
