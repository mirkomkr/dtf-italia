// components/HeroSerigrafia.jsx
import { Check } from "lucide-react";

export default function HeroSerigrafia() {
  return (
    <section className="relative bg-gradient-to-br from-orange-700 via-red-700 to-pink-700 min-h-screen flex items-center py-20 overflow-hidden">
      
      {/* Background Elements (stesso pattern DTF) */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-500/20 border border-orange-300/30 text-orange-200 text-sm font-semibold backdrop-blur-sm">
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
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
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
                  className="flex items-center gap-2 text-gray-200 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  <Check className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#prodotti-serigrafia"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-red-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Scopri i prodotti
              </a>

              <a
                href="#come-funziona-serigrafia"
                className="inline-flex items-center justify-center rounded-lg border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Come funziona
              </a>
            </div>

          </div>

          {/* Placeholder visivo (futuro: immagine o mockup) */}
          <div className="flex-1 hidden lg:block" aria-hidden="true">
            {/* spazio volutamente lasciato per future immagini / mockup */}
          </div>

        </div>
      </div>
    </section>
  );
}
