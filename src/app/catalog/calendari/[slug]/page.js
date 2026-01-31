import { getWooCommerceProducts } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

const BASE_URL = "https://www.dtfitalia.it";

/**
 * Generate static params for all calendari products at build time
 */
export async function generateStaticParams() {
  try {
    const products = await getWooCommerceProducts({ 
      category: 'calendari-personalizzati',
      perPage: 100 
    });
    
    return products.map(product => ({
      slug: product.slug
    }));
  } catch (error) {
    console.error('Error generating static params for calendari:', error);
    return [];
  }
}

/**
 * Generate dynamic metadata for each product
 */
export async function generateMetadata({ params }) {
  try {
    const products = await getWooCommerceProducts({ slug: params.slug });
    const product = products[0];
    
    if (!product) {
      return {
        title: 'Prodotto non trovato | DTF Italia',
      };
    }
    
    return {
      title: `${product.name} - Calendari Personalizzati Roma | DTF Italia`,
      description: product.short_description || `${product.name} personalizzato con stampa offset professionale a Roma. Preventivo gratuito.`,
      alternates: {
        canonical: `${BASE_URL}/catalog/calendari/${params.slug}`
      },
      openGraph: {
        title: `${product.name} - Calendari Personalizzati Roma`,
        description: product.short_description,
        url: `${BASE_URL}/catalog/calendari/${params.slug}`,
        images: product.images?.[0]?.src ? [
          {
            url: product.images[0].src,
            width: 800,
            height: 800,
            alt: product.images[0].alt || product.name
          }
        ] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata for calendari product:', error);
    return {};
  }
}

export default async function CalendariProductPage({ params }) {
  let product = null;
  
  try {
    const products = await getWooCommerceProducts({ slug: params.slug });
    product = products[0];
  } catch (error) {
    console.error('Error fetching calendari product:', error);
  }
  
  if (!product) {
    notFound();
  }

  const image = product.images?.[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Product Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-6xl">📅</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          {product.short_description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* CTA */}
          <div className="pt-6 space-y-4">
            <p className="text-sm text-gray-500">
              Per un preventivo personalizzato su questo calendario, contattaci o torna alla landing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/calendari-personalizzati-roma"
                className="inline-block px-8 py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg text-center"
              >
                Richiedi Preventivo
              </a>
              <a 
                href="/catalog/calendari"
                className="inline-block px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all text-center"
              >
                Vedi Altri Modelli
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
