'use client';

import LazyLoader from "@/components/common/LazyLoader";
import Link from 'next/link';
import dynamic from 'next/dynamic';

/**
 * UniversalContainer - Lazy loaded configurator component
 * Dynamic import with SSR disabled for client-side only rendering
 */
const UniversalContainer = dynamic(() => import('@/components/configurator/dtf/DTFContainer'), {
  ssr: false,
  loading: () => (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-2xl min-h-[700px] w-full flex items-center justify-center">
        <div className="animate-pulse text-slate-600 font-medium">Inizializzazione configuratore...</div>
    </div>
  )
});

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
 * - 50/50 Grid layout with column isolation (min-w-0)
 * - WCAG 2.1 Level AA compliant
 * - Semantic HTML5 structure
 * - Mobile-first responsive design
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data for configurator
 */
export default function HeroDTF({ product }) {
    // Fallback product to ensure configurator always renders
    const finalProduct = product || { 
        id: 'dtf-service', 
        name: 'Service Stampa DTF', 
        slug: 'service-stampa-dtf-roma' 
    };

    /**
     * Scroll to configurator section with instant behavior
     * Prevents smooth scroll conflicts with global CSS
     */
    const scrollToConfig = () => {
        document.getElementById('configurator-section')?.scrollIntoView({ 
            behavior: 'instant',
            block: 'start'
        });
    };

    return (
        <main 
            className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black pt-20 pb-24 min-h-screen flex items-center"
            aria-labelledby="hero-heading"
        >
            {/* Decorative Background Elements - Hidden from screen readers */}
            <div 
                className="absolute inset-0 opacity-30 pointer-events-none" 
                aria-hidden="true"
                role="presentation"
            >
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
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
                        
                        {/* Main Heading - Single h1 per page */}
                        <h1 
                            id="hero-heading"
                            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight break-words"
                        >
                            Stampa{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                                DTF
                            </span>{' '}
                            Roma
                        </h1>
                        
                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-300 max-w-lg leading-relaxed mx-auto lg:mx-0 break-words">
                            Carica pdf, ai, eps, svg, tiff, png professionali.
                            Il Service DTF di fiducia a Roma per stampe nitide, colori vibranti e consegne rapide.
                        </p>

                        {/* CTA Buttons Group */}
                        <div 
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            role="group"
                            aria-label="Azioni principali"
                        >
                            <button 
                                onClick={scrollToConfig}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50"
                                aria-label="Vai al configuratore ordine"
                            >
                                Configura Ordine
                            </button>
                            <Link 
                                href="/serigrafia"
                                className="px-8 py-4 bg-black/25 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-black/40 active:bg-black/50 transition-all flex items-center justify-center backdrop-blur-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                                aria-label="Esplora il catalogo prodotti serigrafia"
                            >
                                Scopri Catalogo
                            </Link>
                        </div>
                        
                        {/* Additional Info */}
                        <p className="text-indigo-300 text-sm font-medium" role="contentinfo">
                            <span aria-hidden="true">✓</span> Ritiro in sede a Roma o Spedizione Express in 24h
                        </p>
                    </section>

                    {/* Right Column: Configurator */}
                    <aside 
                        id="configurator-section"
                        className="min-w-0 w-full flex flex-col justify-center"
                        aria-labelledby="configurator-heading"
                    >
                        {/* Hidden heading for screen readers */}
                        <h2 id="configurator-heading" className="sr-only">
                            Configuratore ordine stampa DTF
                        </h2>
                        
                        <LazyLoader>
                            {finalProduct ? (
                                <UniversalContainer 
                                    product={finalProduct} 
                                    categorySlug="service-stampa-dtf-roma" 
                                    variant="hero" 
                                />
                            ) : (
                                <div 
                                    className="h-full w-full flex items-center justify-center"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <p className="text-white">Caricamento configuratore...</p>
                                </div>
                            )}
                        </LazyLoader>
                    </aside>
                </div>
            </div>
        </main>
    );
}
