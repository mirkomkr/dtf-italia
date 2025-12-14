import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-indigo-600 focus:rounded-md focus:shadow-lg"
        >
          Salta al contenuto principale
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
