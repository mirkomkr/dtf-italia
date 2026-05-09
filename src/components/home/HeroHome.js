// components/HeroHome.js
import { FaPrint, FaTshirt, FaMugHot, FaCalendarAlt, FaFilm } from 'react-icons/fa';

/**
 * HeroHome - Homepage hero section
 * 
 * Architecture:
 * - ✅ Server Component (zero client JS)
 * - Fullscreen section (100vh/100dvh)
 * - WCAG 2.1 Level AA compliant
 * - Mobile-first responsive design
 * 
 * Purpose: Brand awareness e presentazione generale servizi
 */
export default function HeroHome() {
  const services = [
    { name: 'DTF', icon: FaPrint, href: '#dtf', color: 'from-indigo-300 to-purple-300' },
    { name: 'Serigrafia', icon: FaTshirt, href: '#serigrafia', color: 'from-orange-300 to-red-300' },
    { name: 'Sublimazione', icon: FaMugHot, href: '#sublimazione', color: 'from-cyan-300 to-blue-300' },
    { name: 'Calendari', icon: FaCalendarAlt, href: '#calendari', color: 'from-amber-300 to-orange-300' },
    { name: 'Pellicole', icon: FaFilm, href: '#pellicole', color: 'from-emerald-300 to-teal-300' }
  ];

  return (
    <section 
      className="
        min-h-screen min-h-[100dvh]
        flex items-center justify-center
        bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900
        relative overflow-hidden
      "
      aria-labelledby="hero-home-heading"
    >
      
      {/* Decorative Background Elements */}
      {/* Decorative blobs — fully hidden from AT */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        aria-hidden="true"
        role="presentation"
        inert=""
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold backdrop-blur-sm"
            role="status"
            aria-label="Servizi di stampa professionale a Roma"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Servizi di Stampa Professionale Roma
          </div>
          
          {/* Main Heading */}
          <h1 
            id="hero-home-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              DTF Italia
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Stampa Professionale
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            <span className="md:whitespace-nowrap text-white font-semibold">DTF, Serigrafia, Sublimazione, Calendari e Pellicole Serigrafiche.</span>
            <br />
            <span className="md:whitespace-nowrap text-white font-semibold">Qualità garantita, spedizione 24h, ritiro gratuito a Roma.</span>
          </p>

          {/* Services Grid - Clickable Icons */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-md md:max-w-4xl mx-auto pt-8 pb-12 md:pb-0">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <a
                  key={i}
                  href={service.href}
                  className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 w-full h-20 hover:bg-white/25 hover:scale-105 transition-all group flex flex-col items-center justify-center gap-1"
                  aria-label={`Vai a ${service.name}`}
                >
                  <Icon 
                    className={`text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r ${service.color}`}
                    aria-hidden="true"
                  />
                  <div className="text-white font-bold text-base text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">{service.name}</div>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
