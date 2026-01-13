// components/HeroSublimazione.js
import Image from 'next/image';

/**
 * CheckIcon - Inline SVG for performance (no lucide-react import)
 */
const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * HeroSublimazione - Hero section for sublimation printing services
 * Brand identity: Violet-600 palette
 * Accessibility: focus-visible:ring-2 on all interactive elements
 */
export default function HeroSublimazione() {
  return (
    <section 
      className="relative bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-700 min-h-screen flex items-center py-20 overflow-hidden"
      aria-label="Introduzione servizio sublimazione"
    >
      
      {/* Background Elements (Static for Performance) */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-black/25 border border-white/10 text-white text-sm font-bold backdrop-blur-sm">
              ✨ Stampa Sublimazione Professionale
            </div>

            {/* H1 SEO - Single h1 per page */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Sublimazione su Tessuti <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
                Colori Vibranti e Duraturi
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Ideale per abbigliamento sportivo, gadget e tessuti sintetici.
              Stampa fotografica ad alta definizione con risultati che resistono
              al tempo e ai lavaggi.
            </p>

            {/* Benefits List */}
            <ul className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {[
                "Stampa fotografica HD",
                "Perfetta su poliestere",
                "Nessun limite di colori"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 font-medium"
                >
                  <CheckIcon className="w-5 h-5 text-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA */}
              <a
                href="#prodotti-sublimazione"
                className="px-8 py-4 bg-white text-violet-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Scopri i prodotti
              </a>

              {/* Secondary CTA */}
              <a
                href="#come-funziona-sublimazione"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 transition-all flex items-center justify-center backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Come funziona
              </a>
            </div>

          </div>

          {/* Image Area - Placeholder for future hero image */}
          <div className="flex-1 hidden lg:flex items-center justify-center">
            {/* 
              Future: Add priority image for LCP optimization
              <Image 
                src="/images/sublimazione-hero.webp"
                alt="Esempio di stampa sublimazione su maglietta sportiva"
                width={600}
                height={500}
                priority
                className="rounded-2xl shadow-2xl"
              />
            */}
            <div 
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-violet-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="text-center">
                <span className="text-5xl mb-2 block">✨</span>
                <span className="text-white/30 text-sm font-medium">Hero Image Placeholder</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
