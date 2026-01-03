// components/HeroPellicoleSerigrafia.js
import Image from 'next/image';

/**
 * CheckIcon - Inline SVG for performance (no lucide-react import)
 * @param {Object} props
 * @param {string} props.className - Tailwind classes
 */
const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * HeroPellicoleSerigrafia - Hero section for screen printing films
 * Brand identity: Emerald-500 accents on Slate-900 background
 * Accessibility: focus-visible:ring-2 on all interactive elements
 * 
 * @returns {JSX.Element} Hero section component
 */
export default function HeroPellicoleSerigrafia() {
  return (
    <section 
      className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 min-h-screen flex items-center py-20 overflow-hidden"
      aria-label="Introduzione pellicole per serigrafia"
    >
      
      {/* Background Elements (Static for Performance) */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-black/25 border border-white/10 text-white text-sm font-bold backdrop-blur-sm">
              🎯 Pellicole Professionali
            </div>

            {/* H1 SEO - Single h1 per page */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Pellicole per <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                Serigrafia Professionale
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Pellicole Inkjet e Laser professionali per la creazione di telai serigrafici. 
              Massima opacità del nero e stabilità dimensionale per registri perfetti 
              su ogni tipo di tela.
            </p>

            {/* Benefits List */}
            <ul className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {[
                "Dmax superiore a 4.0",
                "Stabilità dimensionale",
                "Compatibilità universale"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 font-medium"
                >
                  <CheckIcon className="w-5 h-5 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA */}
              <a
                href="#catalogo-pellicole"
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Vai al Catalogo
              </a>

              {/* Secondary CTA */}
              <a
                href="#schede-tecniche"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 transition-all flex items-center justify-center backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Schede Tecniche
              </a>
            </div>

          </div>

          {/* Image Area - Priority image for LCP optimization */}
          <div className="flex-1 hidden lg:flex items-center justify-center">
            {/* 
              TODO: Replace placeholder with actual hero image
              Example implementation:
              <Image 
                src="/images/pellicole-serigrafia-hero.webp"
                alt="Pellicole per serigrafia inkjet e laser professionali - DTF Italia"
                width={600}
                height={500}
                priority
                className="rounded-2xl shadow-2xl"
              />
            */}
            <div 
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="text-center">
                <span className="text-5xl mb-2 block">🎯</span>
                <span className="text-white/30 text-sm font-medium">Hero Image Placeholder</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
