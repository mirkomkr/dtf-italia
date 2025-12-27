'use client';

// import { Check } from 'lucide-react'; // REMOVED
import LazyLoader from "@/components/common/LazyLoader";
import SkeletonConfigurator from "@/components/ui/SkeletonConfigurator";
import { Suspense } from 'react'; // removed unused useEffect, useState
import Link from 'next/link';
import dynamic from 'next/dynamic';

const UniversalContainer = dynamic(() => import('@/components/configurator/UniversalContainer'), {
  ssr: false,
  loading: () => <SkeletonConfigurator height="600px" />
});

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function Hero({ product }) {
    // product is now passed from Server Component (app/page.js)

    const scrollToConfig = () => {
        document.getElementById('configurator-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative overflow-hidden bg-white pt-16 pb-24">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Copy & Value Props */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Service DTF N.1 a Roma
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                            Stampa DTF <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Professionale
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                            Il service di stampa DTF (Direct to Film) preferito dalle aziende di Roma. 
                            Qualità fotografica, colori vibranti e resistenza industriale. 
                            <span className="block mt-2 font-semibold text-gray-900">
                                Ordina ora, ritira in giornata o ricevi domani.
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={scrollToConfig}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                Configura Ordine
                            </button>
                            <Link 
                                href="/serigrafia"
                                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                            >
                                Scopri Catalogo
                            </Link>
                        </div>

                        <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                            {[
                                "Inchiostri Certificati OEKO-TEX",
                                "Bobina 60cm (Utilizzo 56cm)",
                                "Nessun minimo d'ordine",
                                "Spedizione 24/48h"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600">
                                        <CheckIcon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Configurator / Visual */}
                    <div id="configurator-section" className="bg-gray-50 rounded-3xl p-2 border border-gray-200 shadow-2xl shadow-indigo-100/50">
                       <LazyLoader>
                           <Suspense fallback={<SkeletonConfigurator height="600px" />}>
                                {product ? (
                                    <UniversalContainer 
                                        product={product} 
                                        categorySlug="service-stampa-dtf-roma" // Forced Slug for SEO
                                    />
                                ) : (
                                    <SkeletonConfigurator height="600px" />
                                )}
                           </Suspense>
                       </LazyLoader>
                    </div>
                </div>
            </div>
        </section>
    );
}
