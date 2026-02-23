"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const MenuIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const XIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 18 18" />
  </svg>
);

// ── Icona carrello con badge ────────────────────────────────────────────────
function CartIcon({ onClick }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrello"
      onClick={onClick}
      aria-label={
        itemCount > 0
          ? `Carrello — ${itemCount} ${itemCount === 1 ? "prodotto" : "prodotti"}`
          : "Carrello — vuoto"
      }
      className="relative flex items-center gap-1.5 p-2 text-gray-300 hover:text-white transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    >
      <ShoppingCart className="w-5 h-5" strokeWidth={2} aria-hidden="true" />

      {/* Label desktop */}
      <span className="hidden lg:inline text-sm font-semibold">Carrello</span>

      {/* Badge numerico */}
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 lg:static lg:ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-black leading-none flex items-center justify-center ring-2 ring-gray-900"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Blocca lo scroll del body quando il menu è aperto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DTF Italia",
    url: "https://www.dtfitalia.it",
    logo: "https://www.dtfitalia.it/logo.png",
    sameAs: [
      "https://www.facebook.com/dtfitalia",
      "https://www.instagram.com/dtfitalia",
    ],
  };

  const navLinks = [
    { href: "/service-dtf", label: "DTF Service" },
    { href: "/stampa-serigrafica", label: "Serigrafia" },
    { href: "/stampa-sublimazione", label: "Sublimazione" },
    { href: "/stampa-calendari", label: "Calendari" },
    { href: "/pellicole-serigrafia", label: "Pellicole" },
    { href: "/faq", label: "FAQ" },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/5 ${isMobileMenuOpen ? "bg-gray-900" : "bg-gray-900/90 backdrop-blur-md"}`}
      role="banner"
    >
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex-shrink-0 z-50 relative">
          <Link
            href="/"
            className="inline-block text-xl md:text-2xl font-black text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1"
            aria-label="DTF Italia - Torna alla Home"
            onClick={closeMenu}
          >
            <span aria-hidden="true">
              DTF_<span className="text-green-600">IT</span>
              <span className="text-white">AL</span>
              <span className="text-red-600">IA</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex md:gap-3 lg:gap-6 xl:gap-8 md:text-[0.70rem] lg:text-sm xl:text-base font-semibold text-gray-300 items-center flex-1 justify-center overflow-x-auto"
          aria-label="Navigazione Principale"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-all duration-300 relative group py-2 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm whitespace-nowrap"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop: icona carrello */}
        <div className="hidden md:flex items-center flex-shrink-0 z-50">
          <CartIcon />
        </div>

        {/* Mobile: carrello + hamburger */}
        <div className="flex md:hidden items-center gap-1 z-50 relative">
          <CartIcon onClick={closeMenu} />
          <button
            className="p-2 text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={
              isMobileMenuOpen
                ? "Chiudi menu di navigazione"
                : "Apri menu di navigazione"
            }
          >
            {isMobileMenuOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay — scrollabile per accessibilità con zoom */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="fixed inset-0 bg-gray-900 z-40 flex flex-col overflow-y-auto pt-20 pb-8 px-6 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
          >
            <nav
              className="flex flex-col gap-6 text-center text-xl font-semibold text-gray-300"
              aria-label="Navigazione Mobile"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white transition-all duration-200 py-3 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-4"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}

              {/* Carrello nel menu mobile (link testuale esplicito) */}
              <Link
                href="/carrello"
                className="flex items-center justify-center gap-2 hover:text-white transition-all duration-200 py-3 border-t border-white/10 pt-6 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-4"
                onClick={closeMenu}
              >
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                Carrello
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
