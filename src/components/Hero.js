import Configurator from './Configurator';
import { Check } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 min-h-screen flex items-center py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold backdrop-blur-sm">
              🚀 Stampa DTF Premium in 24h
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              La Tua Stampa DTF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Senza Limiti
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Qualità fotografica, colori vibranti e durata eccezionale.<br />
              Carica il tuo file, scegli il formato e ricevi le tue stampe pronte per l'applicazione.
            </p>
            
            <ul className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {['Nessun minimo d\'ordine', 'Spedizione Rapida', 'Qualità HD'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Check className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Configurator */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <Configurator />
          </div>
          
        </div>
      </div>
    </section>
  );
}
