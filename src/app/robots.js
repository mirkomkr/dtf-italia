/**
 * Next.js App Router Robots.txt Generator
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 * 
 * Next.js automatically generates /robots.txt from this file.
 * Served at: https://www.dtfitalia.it/robots.txt
 */

const BASE_URL = 'https://www.dtfitalia.it';

/**
 * Generates the robots.txt configuration
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Next.js internal routes
          '/_next/',
          '/static/',
          
          // API endpoints (sensitive data)
          '/api/',
          
          // Transactional/utility pages
          '/carica-file',      // File upload page (order-specific)
          '/checkout/success', // Thank you page
          '/orders/',          // Order details (if exists)
          
          // Staging/development patterns (precaution)
          '/*?*',              // Query strings (duplicate content)
        ],
      },
      {
        // Block aggressive crawlers that ignore rate limits
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    
    // Canonical sitemap location
    sitemap: `${BASE_URL}/sitemap.xml`,
    
    // Canonical host (prevents duplicate indexing from staging/mirrors)
    host: BASE_URL,
  };
}
