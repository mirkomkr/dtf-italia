'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBreadcrumbLabel, formatSegment } from '@/lib/breadcrumb-config';

/**
 * Breadcrumb SEO-optimized component
 * - WCAG 2.2 compliant (aria-label, aria-current, keyboard navigation)
 * - Schema.org BreadcrumbList with JSON-LD
 * - Dynamic route support with usePathname
 * 
 * @param {Object} props
 * @param {Object} props.customLabels - Override labels for specific paths
 * @param {string} props.className - Additional CSS classes
 */
export default function Breadcrumb({ customLabels = {}, className }) {
  const pathname = usePathname();
  
  // Skip breadcrumb on homepage
  if (pathname === '/') return null;
  
  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = [
    { name: 'Home', path: '/', isHome: true }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Priority: customLabels > config > formatted segment
    const label = customLabels[currentPath] || 
                  getBreadcrumbLabel(currentPath) || 
                  formatSegment(segment);
    
    breadcrumbItems.push({
      name: label,
      path: currentPath,
      isLast
    });
  });
  
  return (
    <>
      {/* Visual Breadcrumb - Hidden visually but accessible to screen readers and search engines */}
      <nav 
        aria-label="Breadcrumb" 
        className={cn("sr-only", className)}
        style={{ 
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)' 
        }}
      >
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-gray-400" 
                  aria-hidden="true" 
                />
              )}
              
              {item.isLast ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    "text-gray-800 hover:text-gray-900 transition-colors font-medium",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-sm",
                    "px-2 py-2 -mx-1" // Improved touch target size for mobile (44x44px minimum)
                  )}
                >
                  {item.isHome ? (
                    <Home className="w-4 h-4" aria-label="Home" />
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbItems.map((item, index) => ({
              '@type': 'ListItem',
              'position': index + 1,
              'name': item.name,
              ...(item.isLast ? {} : { 'item': `https://dtfitalia.it${item.path}` })
            }))
          })
        }}
      />
    </>
  );
}
