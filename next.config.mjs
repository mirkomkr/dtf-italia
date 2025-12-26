/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // 🔹 WordPress produzione (Mantieni se ti serve dtfpro)
      {
        protocol: "https",
        hostname: "dtfpro.it",
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
};

export default nextConfig;