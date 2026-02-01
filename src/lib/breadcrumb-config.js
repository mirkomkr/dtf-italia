export const BREADCRUMB_LABELS = {
  // Landing Pages
  '/stampa-dtf-roma': 'Stampa DTF Roma',
  '/stampa-serigrafica': 'Stampa Serigrafica',
  '/stampa-sublimazione': 'Stampa Sublimazione',
  '/stampa-calendari-roma': 'Calendari Personalizzati',
  '/pellicole-serigrafiche': 'Pellicole Serigrafiche',
  '/chi-siamo': 'Chi Siamo',
  
  // Catalog Pages
  '/stampa-serigrafica/catalogo': 'Catalogo Prodotti',
  '/stampa-sublimazione/catalogo': 'Catalogo Sublimazione',
  '/stampa-calendari/catalogo': 'Catalogo Calendari',
};

/**
 * Get breadcrumb label for a given path
 * @param {string} path - URL path
 * @returns {string|null} - Custom label or null
 */
export function getBreadcrumbLabel(path) {
  return BREADCRUMB_LABELS[path] || null;
}

/**
 * Format URL segment to readable label
 * Converts 'stampa-serigrafica' to 'Stampa Serigrafica'
 * @param {string} segment - URL segment
 * @returns {string} - Formatted label
 */
export function formatSegment(segment) {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
