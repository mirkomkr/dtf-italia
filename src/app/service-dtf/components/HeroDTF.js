// app/service-dtf/components/HeroDTF.js
import Image from 'next/image';
import HeroScrollButton from './HeroScrollButton';
import { FaPrint } from 'react-icons/fa';

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
 * HeroDTF - Hero section for DTF printing service
 * 
 * Architecture:
 * - ✅ Server Component (zero client JS except scroll button)
 * - 50/50 Grid layout with column isolation (min-w-0)
 * - WCAG 2.1 Level AA compliant
 * - Semantic HTML5 structure
 * - Mobile-first responsive design
 * - Indigo/Purple brand palette
 * 
 * @param {Object} props
 * @param {string} props.title - Optional custom title
 */
export default function HeroDTF({ title }) {
  return (
    <main 
      className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-black min-h-screen flex items-center py-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      
      {/* Decorative Background Elements - Hidden from screen readers */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none" 
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 border border-white/10 text-white text-sm font-bold backdrop-blur-sm"
              role="status"
              aria-label="Servizio numero 1 a Roma"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Service DTF N.1 a Roma
            </div>
            
            {/* Main Heading */}
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight break-words"
            >
              {title ? (
                title
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                    Stampa DTF
                  </span>{' '}
                  Roma
                </>
              )}
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-lg leading-relaxed mx-auto lg:mx-0 break-words">
              Service di stampa DTF professionale a Roma. Stampe nitide, colori vibranti e consegne rapide in 24h.
            </p>

            {/* Benefits List */}
            <ul 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto lg:mx-0"
              role="list"
              aria-label="Vantaggi del servizio"
            >
              {[
                "Spedizione 24h",
                "Nessun minimo d'ordine",
                "Alta qualità garantita",
                "Assistenza dedicata"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 font-medium"
                >
                  <CheckIcon className="w-5 h-5 text-indigo-400 shrink-0" />
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
              {/* Client Component for scroll */}
              <HeroScrollButton targetId="configurator-section" />

              <a
                href="/contatti"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 active:bg-black/50 transition-all flex items-center justify-center backdrop-blur-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50"
                aria-label="Contattaci per informazioni"
              >
                Contattaci
              </a>
            </div>
          </section>

          {/* Right Column: Image Placeholder */}
          <aside 
            className="min-w-0 flex items-center justify-center"
            aria-label="Immagine rappresentativa del servizio"
          >
            {/* Hidden heading for screen readers */}
            <h2 id="placeholder-heading" className="sr-only">
              Immagine rappresentativa stampa DTF professionale
            </h2>
            
            {/* 
              TODO: Replace placeholder with actual hero image
              Example implementation:
              <Image 
                src="/images/hero-dtf.webp"
                alt="Stampa DTF professionale - DTF Italia Roma"
                width={600}
                height={600}
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-2xl shadow-2xl"
              />
            */}
            <div 
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-indigo-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
              role="presentation"
            >
              <div className="text-center">
                <FaPrint className="text-5xl mb-2 mx-auto text-white/30" aria-hidden="true" />
                <span className="text-white/30 text-sm font-medium">Hero Image Placeholder</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
