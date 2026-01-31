// components/HeroSerigrafia.jsx
import { FaTshirt } from 'react-icons/fa';

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
 * HeroSerigrafia - Hero section for screen printing service
 * 
 * Architecture:
 * - 50/50 Grid layout with column isolation (min-w-0)
 * - WCAG 2.1 Level AA compliant
 * - Semantic HTML5 structure
 * - Mobile-first responsive design
 * - Red/Orange brand palette
 */
export default function HeroSerigrafia() {
  return (
    <main 
        className="relative bg-gradient-to-br from-orange-700 via-red-700 to-pink-700 min-h-screen flex items-center py-20 overflow-hidden"
        aria-labelledby="hero-heading"
    >
      
      {/* Decorative Background Elements - Hidden from screen readers */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
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
                aria-label="Servizio stampa serigrafica professionale"
            >
              🎨 Stampa Serigrafica Professionale
            </div>

            {/* Main Heading - Single h1 per page */}
            <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight break-words"
            >
              Serigrafia su Abbigliamento <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300">
                Precisa e Duratura
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium break-words">
              Ideale per felpe, t-shirt, cappelli, shopping bag e capi personalizzati.
            </p>
            <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium break-words">Colori pieni, alta resistenza ai lavaggi e risultati professionali
            per brand, aziende ed eventi.</p>

            {/* Benefits List */}
            <ul 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                role="list"
                aria-label="Vantaggi della serigrafia"
            >
              {[
                "Perfetta per grandi quantità",
                "Colori intensi e coprenti",
                "Alta durata nel tempo"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 font-medium"
                >
                  <CheckIcon className="w-5 h-5 text-green-400 shrink-0" />
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
                href="#prodotti-serigrafia"
                className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-gray-100 active:bg-gray-200 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                aria-label="Esplora i prodotti disponibili per serigrafia"
              >
                Scopri i prodotti
              </a>

              <a
                href="#how-it-works"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 active:bg-black/50 transition-all flex items-center justify-center backdrop-blur-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                aria-label="Scopri come funziona il processo di serigrafia"
              >
                Come funziona
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
              Immagine rappresentativa serigrafia
            </h2>
            
            <div 
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-red-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
              role="presentation"
            >
              <div className="text-center">
                <FaTshirt className="text-5xl mb-2 mx-auto text-white/30" aria-hidden="true" />
                <span className="text-white/30 text-sm font-medium">Hero Image Placeholder</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
