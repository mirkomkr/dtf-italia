/**
 * Central LocalBusiness Schema for DTF Italia
 * @see https://schema.org/LocalBusiness
 * 
 * This schema is used across all service pages to establish
 * a consistent business entity for SEO and local search.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.dtfitalia.it";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#organization`,
  "name": "DTF Italia",
  "description": "Servizio di stampa professionale DTF, Serigrafia e Sublimazione a Roma",
  "url": BASE_URL,
  "telephone": "+39-XXX-XXXXXXX", // TODO: Insert actual phone number
  "email": "info@dtfitalia.it", // TODO: Verify email address
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via XXXXX", // TODO: Insert actual street address
    "addressLocality": "Roma",
    "addressRegion": "RM",
    "postalCode": "00XXX", // TODO: Insert actual postal code
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "41.9028", // TODO: Insert exact latitude coordinates
    "longitude": "12.4964" // TODO: Insert exact longitude coordinates
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Roma"
    },
    {
      "@type": "Country",
      "name": "Italia"
    }
  ],
  // TODO: Insert Google Business Profile URL when available
  // This should link to your Google Maps listing for maximum local SEO impact
  // "mainEntityOfPage": "https://www.google.com/maps/place/...",
  "priceRange": "€€",
  "openingHoursSpecification": [] // TODO: Add business hours when available
  // Example format:
  // [
  //   {
  //     "@type": "OpeningHoursSpecification",
  //     "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  //     "opens": "09:00",
  //     "closes": "18:00"
  //   }
  // ]
};
