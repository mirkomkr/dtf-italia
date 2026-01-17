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
      
      // Anchor Fragment Redirects (for old internal links)
      {
        source: '/:path*#serigrafia',
        destination: '/stampa-serigrafica',
        permanent: true,
      },
      {
        source: '/:path*#sublimazione',
        destination: '/stampa-sublimazione',
        permanent: true,
      },
      {
        source: '/:path*#calendari',
        destination: '/stampa-calendari',
        permanent: true,
      },
      {
        source: '/:path*#pellicole',
        destination: '/pellicole-serigrafia',
        permanent: true,
      },
      {
        source: '/:path*#dtf',
        destination: '/service-dtf',
        permanent: true,
      },
    ]
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') return [];
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
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