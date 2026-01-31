import { getWooCommerceProducts } from '@/lib/woocommerce';

const BASE_URL = 'https://www.dtfitalia.it';

const STATIC_ROUTES = [
  { path: '/', changeFreq: 'weekly', priority: 1.0 },
  { path: '/stampa-serigrafica', changeFreq: 'weekly', priority: 0.9 },
  { path: '/service-dtf', changeFreq: 'weekly', priority: 0.9 },
  { path: '/stampa-sublimazione', changeFreq: 'weekly', priority: 0.8 },
  { path: '/stampa-calendari', changeFreq: 'weekly', priority: 0.8 },
  { path: '/pellicole-serigrafia', changeFreq: 'monthly', priority: 0.8 },
  { path: '/catalog/serigrafia', changeFreq: 'weekly', priority: 0.8 },
  { path: '/catalog/sublimazione', changeFreq: 'weekly', priority: 0.8 },
  { path: '/catalog/calendari', changeFreq: 'weekly', priority: 0.8 },
  { path: '/faq', changeFreq: 'weekly', priority: 0.9 },
  { path: '/carica-file', changeFreq: 'monthly', priority: 0.6 },
  { path: '/credits', changeFreq: 'yearly', priority: 0.3 },
];

export default async function sitemap() {
  const lastModified = new Date();

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  let productRoutes = [];
  
  try {
    const [serigrafiaProducts, sublimazioneProducts, calendariProducts] = await Promise.all([
      getWooCommerceProducts({ category: 'stampa-abbigliamento-serigrafia', perPage: 100 }),
      getWooCommerceProducts({ category: 'stampa-sublimazione', perPage: 100 }),
      getWooCommerceProducts({ category: 'calendari-personalizzati', perPage: 100 }),
    ]);

    const serigrafiaRoutes = serigrafiaProducts.map((product) => ({
      url: `${BASE_URL}/stampa-serigrafia/${product.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const sublimazioneRoutes = sublimazioneProducts.map((product) => ({
      url: `${BASE_URL}/catalog/sublimazione/${product.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const calendariRoutes = calendariProducts.map((product) => ({
      url: `${BASE_URL}/catalog/calendari/${product.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    productRoutes = [...serigrafiaRoutes, ...sublimazioneRoutes, ...calendariRoutes];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [
    ...staticRoutes,
    ...productRoutes,
  ];
}
