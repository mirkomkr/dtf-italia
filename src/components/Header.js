"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
              className="hover:text-white transition-colors focus:text-white focus:outline-none focus:underline underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 relative p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900 z-40 flex flex-col justify-center items-center md:hidden">
            <nav className="flex flex-col gap-8 text-center text-xl font-semibold text-gray-300">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="hover:text-white transition-colors py-2"
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
