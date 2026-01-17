import localFont from 'next/font/local';
import "./globals.css";
import Header from "@/components/Header";
import dynamic from 'next/dynamic';
import { SpeedInsights } from "@vercel/speed-insights/next"


const Footer = dynamic(() => import('@/components/Footer'), { 
  ssr: false,  // Lazy load Footer (below-the-fold)
  loading: () => null 
});

const inter = localFont({
  src: '../../public/fonts/inter/Inter-VariableFont.woff2',
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: '100 900',
});

/**
 * Global SEO Metadata (Next.js Metadata API)
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * 
 * - title.template: Appends brand suffix to all page titles
 * - description: Default fallback for pages without custom description
 * - robots: Ensures crawlability
 */
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dtfitalia.it'),
  title: {
    default: 'DTF Italia - Stampa Professionale',
    template: '%s | DTF Italia',
  },
  description: 'Servizio di stampa DTF e Serigrafia professionale a Roma. Alta qualità, spedizione rapida, nessun minimo d\'ordine.',
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'DTF Italia',
  },
  other: {
    // Preload critical font for faster FCP
    'link': [
      { rel: 'preload', href: '/_next/static/media/ac374088683cf63a-s.p.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>

      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col`}>
        <Header />
        <SpeedInsights />
        <main id="main-content" className="relative flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
