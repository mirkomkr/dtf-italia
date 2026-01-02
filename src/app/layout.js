import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import dynamic from 'next/dynamic';


const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="scroll-smooth" suppressHydrationWarning>

      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col`}>
        <Header />
        <main id="main-content" className="relative flex-1 pt-20 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
