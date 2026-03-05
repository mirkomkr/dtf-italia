/**
 * breadcrumb-config.js
 * Costanti e helper per la breadcrumb di DTF Italia.
 *
 * Ogni route ha i suoi items pre-costruiti.
 * L'item finale (href: null) è la pagina corrente — NON link.
 */

const HOME = { label: "Home", href: "/" };

// ─── Items per route statiche ──────────────────────────────────────────────
export const BREADCRUMB_ITEMS = {
  "/service-dtf": [HOME, { label: "DTF Service", href: null }],

  "/stampa-serigrafica": [HOME, { label: "Stampa Serigrafica", href: null }],

  "/stampa-serigrafica/catalogo": [
    HOME,
    { label: "Stampa Serigrafica", href: "/stampa-serigrafica" },
    { label: "Catalogo Prodotti", href: null },
  ],

  "/stampa-sublimazione": [HOME, { label: "Stampa Sublimazione", href: null }],

  "/stampa-sublimazione/catalogo": [
    HOME,
    { label: "Stampa Sublimazione", href: "/stampa-sublimazione" },
    { label: "Catalogo Prodotti", href: null },
  ],

  "/stampa-calendari": [
    HOME,
    { label: "Calendari Personalizzati", href: null },
  ],

  "/stampa-calendari/catalogo": [
    HOME,
    { label: "Calendari Personalizzati", href: "/stampa-calendari" },
    { label: "Catalogo Prodotti", href: null },
  ],

  "/pellicole-serigrafia": [
    HOME,
    { label: "Pellicole Serigrafiche", href: null },
  ],

  "/chi-siamo": [HOME, { label: "Chi Siamo", href: null }],

  "/faq": [HOME, { label: "FAQ", href: null }],

  "/carrello": [HOME, { label: "Carrello", href: null }],
};

/**
 * Helper per le route dinamiche (es. pagina prodotto [slug]).
 * @param {string} parentLabel - Label della sezione (es. 'Stampa Serigrafica')
 * @param {string} parentHref  - Path della sezione (es. '/stampa-serigrafica')
 * @param {string} productName - Nome del prodotto (es. 'T-Shirt Nera')
 */
export function buildProductBreadcrumb(parentLabel, parentHref, productName) {
  return [
    HOME,
    { label: parentLabel, href: parentHref },
    { label: productName, href: null },
  ];
}
