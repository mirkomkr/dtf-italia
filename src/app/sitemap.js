/**
 * Next.js App Router Sitemap Generator
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * 
 * Next.js automatically generates /sitemap.xml from this file at build time.
 * The sitemap is served at: https://www.dtfitalia.it/sitemap.xml
 */

const BASE_URL = 'https://www.dtfitalia.it';

/**
 * Static routes configuration
 * @type {Array<{path: string, changeFreq: string, priority: number}>}
 */
const STATIC_ROUTES = [
  // Home - Highest priority
  { path: '/', changeFreq: 'weekly', priority: 1.0 },
  
  // Product/Service pages - High priority
  { path: '/serigrafia', changeFreq: 'weekly', priority: 0.9 },
  { path: '/sublimazione', changeFreq: 'monthly', priority: 0.8 },
  { path: '/calendari', changeFreq: 'monthly', priority: 0.8 },
  { path: '/pellicole-serigrafia', changeFreq: 'monthly', priority: 0.8 },
  
  // Utility pages - Lower priority
  { path: '/carica-file', changeFreq: 'monthly', priority: 0.6 },
  { path: '/credits', changeFreq: 'yearly', priority: 0.3 },
];

/**
 * Generates the sitemap for Next.js
 * @returns {Promise<Array<{url: string, lastModified: Date, changeFrequency: string, priority: number}>>}
 */
export default async function sitemap() {
  const lastModified = new Date();

  // 1. Static routes
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  // 2. Dynamic routes (scalable - add future product fetching here)
  // Example: Fetch serigrafia product slugs from WooCommerce
  // const products = await getWooCommerceProducts({ category: 'serigrafia' });
  // const productRoutes = products.map((product) => ({
  //   url: `${BASE_URL}/serigrafia/${product.slug}`,
  //   lastModified: new Date(product.date_modified),
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));

  // 3. Combine all routes
  return [
    ...staticRoutes,
    // ...productRoutes, // Uncomment when dynamic products are enabled
  ];
}
