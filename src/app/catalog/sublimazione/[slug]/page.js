import { getWooCommerceProducts } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

const BASE_URL = "https://www.dtfitalia.it";

/**
 * Generate static params for all sublimazione products at build time
 */
export async function generateStaticParams() {
  try {
    const products = await getWooCommerceProducts({ 
      category: 'stampa-sublimazione',
      perPage: 100 
    });
    
    return products.map(product => ({
      slug: product.slug
    }));
  } catch (error) {
    console.error('Error generating static params for sublimazione:', error);
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
      title: `${product.name} - Sublimazione Roma | DTF Italia`,
      description: product.short_description || `Configura ${product.name} con stampa sublimazione professionale a Roma. Colori vibranti e alta definizione.`,
      alternates: {
        canonical: `${BASE_URL}/catalog/sublimazione/${params.slug}`
      },
      openGraph: {
        title: `${product.name} - Sublimazione Roma`,
        description: product.short_description,
        url: `${BASE_URL}/catalog/sublimazione/${params.slug}`,
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
    console.error('Error generating metadata for sublimazione product:', error);
    return {};
  }
}

export default async function SublimazioneProductPage({ params }) {
  let product = null;
  
  try {
    const products = await getWooCommerceProducts({ slug: params.slug });
    product = products[0];
  } catch (error) {
    console.error('Error fetching sublimazione product:', error);
  }
  
  if (!product) {
    notFound();
  }

  const image = product.images?.[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
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
              <span className="text-6xl">📷</span>
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
          <div className="pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Per configurare questo prodotto con stampa sublimazione, contattaci o torna alla landing.
            </p>
            <a 
              href="/sublimazione-roma"
              className="inline-block px-8 py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg"
            >
              Vai al Configuratore
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
