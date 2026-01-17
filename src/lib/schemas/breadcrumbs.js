/**
 * BreadcrumbList Schema Generator for DTF Italia
 * @see https://schema.org/BreadcrumbList
 * 
 * Generates breadcrumb navigation schemas for service pages.
 * Helps Google's AI (SGE) understand site hierarchy and enables
 * rich breadcrumb snippets in search results (increases CTR by 15-30%).
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

/**
 * Generates BreadcrumbList schema for service pages
 * @param {string} serviceName - Display name of the service (e.g., "Stampa Serigrafica")
 * @param {string} servicePath - URL path (e.g., '/stampa-serigrafica')
 * @returns {Object} BreadcrumbList schema object
 */
export function generateBreadcrumbSchema(serviceName, servicePath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": serviceName,
        "item": `${BASE_URL}${servicePath}`
      }
    ]
  };
}
