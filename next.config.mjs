/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'lodash', 'date-fns']
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
    ]
  },
};

export default nextConfig;