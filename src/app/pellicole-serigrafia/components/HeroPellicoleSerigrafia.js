// components/HeroPellicoleSerigrafia.js
import Image from "next/image";
import { FaFilm } from "react-icons/fa";

/**
 * CheckIcon - Inline SVG for performance optimization
 * @param {Object} props
 * @param {string} props.className - Tailwind classes for styling
 */
const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * HeroPellicoleSerigrafia - Hero section for screen printing films
 *
 * Architecture:
 * - 50/50 Grid layout with column isolation (min-w-0)
 * - WCAG 2.1 Level AA compliant
 * - Semantic HTML5 structure
 * - Mobile-first responsive design
 * - Emerald/Teal brand palette
 */
export default function HeroPellicoleSerigrafia() {
  return (
    <main
      className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 min-h-screen flex items-center py-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative Background Elements - Hidden from screen readers */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 50/50 Grid Layout with Column Isolation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Marketing Content */}
          <section
            className="min-w-0 space-y-6 lg:space-y-8 text-center lg:text-left"
            aria-labelledby="hero-heading"
          >
            {/* Status Badge */}
            <div
              className="inline-block px-3 py-1 rounded-full bg-black/25 border border-white/10 text-white text-sm font-bold backdrop-blur-sm"
              role="status"
              aria-label="Pellicole professionali per serigrafia"
            >
              🎯 Pellicole Professionali
            </div>

            {/* Main Heading - Single h1 per page */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight break-words"
            >
              Pellicole per <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                Serigrafia Professionale
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium break-words">
              Pellicole Inkjet e Laser professionali per la creazione di telai
              serigrafici. Massima opacità del nero e stabilità dimensionale per
              registri perfetti su ogni tipo di tela.
            </p>

            {/* Benefits List */}
            <ul
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              role="list"
              aria-label="Vantaggi delle pellicole professionali"
            >
              {[
                "Dmax superiore a 4.0",
                "Stabilità dimensionale",
                "Compatibilità universale",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 font-medium"
                >
                  <CheckIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons Group */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              role="group"
              aria-label="Azioni principali"
            >
              <a
                href="#"
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-gray-100 active:bg-gray-200 transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
                aria-label="Esplora il catalogo completo delle pellicole"
              >
                Configura Ordine
              </a>

              <a
                href="#"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 active:bg-black/50 transition-all flex items-center justify-center backdrop-blur-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
                aria-label="Consulta le schede tecniche dei prodotti"
              >
                Schede Tecniche
              </a>
            </div>
          </section>

          {/* Right Column: Visual Placeholder */}
          <aside
            className="min-w-0 flex items-center justify-center"
            aria-labelledby="placeholder-heading"
          >
            {/* Hidden heading for screen readers */}
            <h2 id="placeholder-heading" className="sr-only">
              Immagine rappresentativa pellicole serigrafia
            </h2>

            {/*
             * ─── HERO IMAGE ─────────────────────────────────────────────────────────
             * Sostituire il <div> placeholder qui sotto con questo blocco <Image>
             * non appena l'asset è disponibile in /public/images/hero-pellicole.webp
             *
             * Specifiche asset richieste:
             *   • Formato  : WebP (con fallback JPG per Safari < 14)
             *   • Dimensioni: 800 × 600 px  (aspect-ratio 4/3)
             *   • Qualità  : 85 — ottimale per immagini di stampa
             *   • `priority`: OBBLIGATORIO — è LCP above-the-fold
             *   • `sizes`  : (max-width: 1024px) 100vw, 50vw
             *                corrisponde al layout grid 50/50
             *
             * <Image
             *   src="/images/hero-pellicole.webp"
             *   alt="Pellicole inkjet e laser per serigrafia professionale, Dmax > 4.0 - DTF Italia Roma"
             *   width={800}
             *   height={600}
             *   priority
             *   quality={85}
             *   sizes="(max-width: 1024px) 100vw, 50vw"
             *   className="w-full h-auto rounded-2xl shadow-2xl object-cover"
             * />
             * ────────────────────────────────────────────────────────────────────────
             */}

            {/* Placeholder visivo — rimuovere quando l'<Image> sopra è attivo */}
            <div
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
              role="presentation"
            >
              <div className="text-center">
                <FaFilm
                  className="text-5xl mb-2 mx-auto text-white/30"
                  aria-hidden="true"
                />
                <span className="text-white/30 text-sm font-medium">
                  Hero Image Placeholder
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
