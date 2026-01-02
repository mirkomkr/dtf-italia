"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
// import Menu from 'lucide-react/dist/esm/icons/menu'; // REMOVED
// import X from 'lucide-react/dist/esm/icons/x'; // REMOVED

const MenuIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const XIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 18 18" />
  </svg>
);

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Blocca lo scroll del body quando il menu è aperto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DTF Italia",
    "url": "https://www.dtfitalia.it",
    "logo": "https://www.dtfitalia.it/logo.png",
    "sameAs": [
      "https://www.facebook.com/dtfitalia",
      "https://www.instagram.com/dtfitalia"
    ]
  };

  const navLinks = [
    { href: "#how-it-works", label: "Come Funziona" },
    { href: "/", label: "DTF" },
    { href: "/serigrafia", label: "Serigrafia" },
    { href: "/sublimazione", label: "Sublimazione" },
    { href: "/calendari", label: "Calendari" },
    { href: "/pellicole-serigrafia", label: "Pellicole Serigrafia" },
    { href: "#", label: "FAQ" },
  ];

  return (
    <header className="bg-gray-900 absolute top-0 left-0 w-full z-50 py-6" role="banner">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex-shrink-0 z-50 relative">
          <Link 
            href="/" 
            className="inline-block text-2xl font-black text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white rounded-md px-1"
            aria-label="DTF Italia - Torna alla Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span aria-hidden="true">
              DTF_<span className="text-green-600">IT</span><span className="text-white">AL</span><span className="text-red-600">IA</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300" aria-label="Navigazione Principale">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              href={link.href} 
              className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 relative p-2 text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
        >
          {isMobileMenuOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
        </button>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="fixed inset-0 bg-gray-900 z-40 flex flex-col justify-center items-center md:hidden">
            <nav className="flex flex-col gap-8 text-center text-xl font-semibold text-gray-300" aria-label="Navigazione Mobile">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="hover:text-white transition-all duration-200 py-2 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
}
