/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'lodash', 'date-fns'],
  },
  images: {
    remotePatterns: [
      // 🔹 WordPress locale (Docker)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/wp-content/uploads/**",
      },
      // 🔹 NUOVO: Backend DTF Italia (Fondamentale!)
      {
        protocol: "https",
        hostname: "wp.dtfitalia.it",
        pathname: "/wp-content/uploads/**",
      },
      // 🔹 Sito Live (Puoi lasciarlo per sicurezza durante la transizione)
      {
        protocol: "https",
        hostname: "dtfitalia.it",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      // WordPress Admin Redirects
      {
        source: '/wp-admin',
        destination: 'https://wp.dtfitalia.it/wp-admin',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: 'https://wp.dtfitalia.it/wp-login.php',
        permanent: true,
      },
      
      // SEO Refactor: Legacy URL Redirects (301)

      {
        source: '/sublimazione',
        destination: '/stampa-sublimazione',
        permanent: true,
      },
      {
        source: '/calendari',
        destination: '/stampa-calendari',
        permanent: true,
      },
      {
        source: '/dtf',
        destination: '/service-dtf',
        permanent: true,
      },
      
      // Anchor fragment redirects rimossi: i fragment (#hash) non arrivano al server,
      // vengono gestiti solo dal browser client-side → questi redirect non hanno mai funzionato.
      
      // Catalog Structure Refactor (2026-02-01)
      {
        source: '/catalog/sublimazione',
        destination: '/stampa-sublimazione/catalogo',
        permanent: true,
      },
      {
        source: '/catalog/calendari',
        destination: '/stampa-calendari/catalogo',
        permanent: true,
      },
      {
        source: '/catalog/serigrafia',
        destination: '/stampa-serigrafica/catalogo',
        permanent: true,
      },
    ]
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') return [];
    
    return [
      {
        // Sicurezza e performance per tutte le routes
        // NOTA: NON impostare Cache-Control qui — Next.js ISR
        // gestisce la cache automaticamente tramite revalidate/revalidateTag.
        // Impostare max-age manualmente bypassa il CDN di Vercel e rompe ISR.
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
             key: 'Content-Security-Policy',
             value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; script-src 'self' https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' https: 'unsafe-inline'; font-src 'self' https: data:;"
          }
        ],
      },
      {
        // Asset statici Next.js: cache immutabile (il nome contiene hash)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;