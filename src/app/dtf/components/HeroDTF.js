'use client';

// import { Check } from 'lucide-react'; // REMOVED
import LazyLoader from "@/components/common/LazyLoader";
import SkeletonConfigurator from "@/components/ui/SkeletonConfigurator";
import { Suspense } from 'react'; // removed unused useEffect, useState
import Link from 'next/link';
import dynamic from 'next/dynamic';

const UniversalContainer = dynamic(() => import(''), {
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
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black pt-16 pb-24 min-h-screen flex items-center">
             {/* Background Elements */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Copy & Value Props */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-bold mb-6 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Service DTF N.1 a Roma
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            Stampa DTF <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                                Professionale
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-300 max-w-lg leading-relaxed mx-auto lg:mx-0">
                            Il service di stampa DTF (Direct to Film) preferito dalle aziende di Roma. 
                            Qualità fotografica, colori vibranti e resistenza industriale. 
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={scrollToConfig}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                Configura Ordine
                            </button>
                            <Link 
                                href="/serigrafia"
                                className="px-8 py-4 bg-white/10 text-white border-2 border-white/10 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
                            >
                                Scopri Catalogo
                            </Link>
                        </div>
                    </div>

                    {/* Right: Configurator */}
                    <div id="configurator-section" className="bg-white/95 backdrop-blur-md rounded-3xl p-2 border border-indigo-500/20 shadow-2xl shadow-black/20">
                       <LazyLoader>
                           <Suspense fallback={<SkeletonConfigurator height="600px" />}>
                                {product ? (
                                    <UniversalContainer 
                                        product={product} 
                                        categorySlug="service-stampa-dtf-roma" // Forced Slug for SEO
                                        variant="hero" // Full Width Mode
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
