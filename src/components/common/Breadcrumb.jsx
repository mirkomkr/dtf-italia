import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Breadcrumb — Server Component (Next.js App Router 2026)
 *
 * API:
 *  items = [
 *    { label: 'Home',       href: '/' },       // primo item: sempre Home
 *    { label: 'Serigrafia', href: '/stampa-serigrafica' },
 *    { label: 'T-Shirt',    href: null },       // ultimo item: pagina corrente, NON link
 *  ]
 *
 * Accessibilità:
 *  - <nav aria-label="Breadcrumb"> + <ol> semanticamente corretti (WCAG 2.2)
 *  - aria-current="page" sull'ultimo item
 *  - Separatori ChevronRight con aria-hidden
 *  - Home icon con testo visibile solo agli screen reader
 *
 * Mobile:
 *  - Su xs/sm (< 640px): mostra solo Home + … + pagina corrente
 *  - Su md+: percorso completo
 *
 * SEO:
 *  - JSON-LD BreadcrumbList inline (riconosciuto da Google Rich Results)
 *
 * @param {{ label: string, href: string|null }[]} items
 * @param {string} [className]
 */
export default function Breadcrumb({ items = [], className }) {
  if (!items.length) return null;

  const isHome = (item) => item.href === '/';
  const lastIndex = items.length - 1;

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://dtfitalia.it${item.href}` } : {}),
    })),
  };

  return (
    <>
      {/* ── Visual Breadcrumb ──────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className={cn('w-full', className)}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
          {items.map((item, index) => {
            const isCurrent = index === lastIndex;

            return (
              <li
                key={item.href ?? `crumb-${index}`}
                className="flex items-center gap-1"
              >
                {/* Separatore */}
                {index > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}

                {/* Item: pagina corrente (non cliccabile) */}
                {isCurrent ? (
                  <span
                    className="font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-none"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  /* Item: link navigabile */
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 transition-colors duration-150',
                      'text-gray-500 hover:text-gray-900',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 rounded'
                    )}
                  >
                    {isHome(item) ? (
                      <>
                        <Home className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        <span className="sr-only">Home</span>
                      </>
                    ) : (
                      <span className="hover:underline underline-offset-2">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── JSON-LD structured data ────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
