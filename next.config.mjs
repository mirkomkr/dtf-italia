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
      // 🔹 WordPress produzione
      {
        protocol: "https",
        hostname: "dtfpro.it",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
