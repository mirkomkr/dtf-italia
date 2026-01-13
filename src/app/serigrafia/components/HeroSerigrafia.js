// components/HeroSerigrafia.jsx
// import { Check } from "lucide-react"; // REMOVED

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function HeroSerigrafia() {
  return (
    <section className="relative bg-gradient-to-br from-orange-700 via-red-700 to-pink-700 min-h-screen flex items-center py-20 overflow-hidden">
      
      {/* Background Elements (Static for Perf) */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-black/25 border border-white/10 text-white text-sm font-bold backdrop-blur-sm">
              🎨 Stampa Serigrafica Professionale
            </div>

            {/* H1 SEO */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Serigrafia su Abbigliamento <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300">
                Precisa e Duratura
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Ideale per felpe, t-shirt e capi personalizzati.
              Colori pieni, alta resistenza ai lavaggi e risultati professionali
              per brand, aziende ed eventi.
            </p>

            {/* Benefits */}
            <ul className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {[
                "Perfetta per grandi quantità",
                "Colori intensi e coprenti",
                "Alta durata nel tempo"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  <CheckIcon className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#prodotti-serigrafia"
                className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Scopri i prodotti
              </a>

              <a
                href="#come-funziona-serigrafia"
                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 transition-all flex items-center justify-center backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Come funziona
              </a>
            </div>

          </div>

          <div className="flex-1 hidden lg:flex items-center justify-center">
            <div 
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-red-500/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="text-center">
                <span className="text-5xl mb-2 block">🎨</span>
                <span className="text-white/30 text-sm font-medium">Hero Image Placeholder</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
