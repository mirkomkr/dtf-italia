'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getPricingLogicByCategory } from '@/lib/pricing-engine';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StepNavigation from './ui/StepNavigation';

// Dynamic Imports for Sub-Forms
const ClothingForm = dynamic(() => import('./forms/ClothingForm'), {
    loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />,
    ssr: false
});

const ServiceForm = dynamic(() => import('./forms/ServiceForm'), {
    loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />,
    ssr: false
});

const FixedItemForm = dynamic(() => import('./forms/FixedItemForm'), {
    loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />,
    ssr: false
});

const PriceSummary = dynamic(() => import('./ui/PriceSummary'), { ssr: false });
const FileUpload = dynamic(() => import('./ui/FileUpload'), { ssr: false });

export default function UniversalContainer({ product, categorySlug, variant = 'default' }) {
    // 1. State Management
    const [currentStep, setCurrentStep] = useState(1);
    const [config, setConfig] = useState({
        quantity: 1,
        productPrice: product?.price ? parseFloat(product.price) : 0,
        options: {
            // Common
            fileCheck: false,
            // Clothing
            frontColors: 0,
            backColors: 0,
            // DTF Service
            width: 0,
            height: 0,
            // Pellicole
            format: 'A4',
            // Gadget/Calendari
            model: product?.slug || '',
            category: categorySlug
        }
    });

    // 2. Pricing Logic Resolver & Quote (Memoized)
    const calculatePrice = useMemo(() => {
        return getPricingLogicByCategory(categorySlug);
    }, [categorySlug]);

    const quote = useMemo(() => {
        return calculatePrice(config.quantity, config.productPrice, config.options);
    }, [calculatePrice, config]);

    // Validation for Step 1
    const isStep1Valid = useMemo(() => {
        // Basic check: quantity > 0 and a valid price is generated
        return config.quantity > 0 && quote.totalPrice > 0;
    }, [config.quantity, quote.totalPrice]);

    // Handler to update config
    const handleConfigChange = (key, value) => {
        setConfig(prev => {
            if (['frontColors', 'backColors', 'fileCheck', 'width', 'height', 'format', 'model', 'sizes', 'fabricColor'].includes(key)) {
                return { ...prev, options: { ...prev.options, [key]: value } };
            }
            return { ...prev, [key]: value };
        });
    };

    // Navigation Handlers
    const nextStep = () => {
        if (currentStep === 1 && !isStep1Valid) return; 
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Form Selection Logic
    const renderForm = () => {
        const slug = categorySlug?.toLowerCase() || '';
        if (slug.includes('abbigliamento') || slug.includes('serigrafia')) {
            return <ClothingForm config={config} onChange={handleConfigChange} quote={quote} />;
        }
        if (slug.includes('service-stampa-dtf') || slug.includes('pellicole') || slug === 'dtf') {
            const mode = slug.includes('pellicole') ? 'format' : 'dimensions';
            return <ServiceForm config={config} onChange={handleConfigChange} mode={mode} quote={quote} />;
        }
        if (slug.includes('gadget') || slug.includes('calendari') || slug.includes('sublimazione')) {
            return <FixedItemForm config={config} onChange={handleConfigChange} quote={quote} />;
        }
        return <div className="p-4 text-red-500">Form categoria non trovato.</div>;
    };

    // Theme Logic
    const isDTF = categorySlug.includes('dtf') || categorySlug.includes('service');
    const themeColor = isDTF ? '#6366f1' : '#ea580c'; 

    return (
        <div 
            className="w-full max-w-2xl mx-auto flex flex-col gap-6"
            style={{ 
                '--brand-color': themeColor,
                '--brand-shadow': isDTF ? 'rgba(99, 102, 241, 0.4)' : 'rgba(234, 88, 12, 0.4)' 
            }}
        >
            {/* WIZARD NAVIGATION */}
            <StepNavigation currentStep={currentStep} color={themeColor} />

            {/* CONTENT AREA */}
            <div className={`
                transition-all duration-300
                ${variant === 'hero' ? 'bg-white/95 backdrop-blur-md' : 'bg-white'}
                rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative
            `}>
                
                {/* STEP 1: CONFIGURATION */}
                {currentStep === 1 && (
                    <div className="p-6 md:p-8 animate-in slide-in-from-right-8 fade-in duration-300">
                        {renderForm()}
                        
                        {/* Step 1 Footer Action */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={!isStep1Valid}
                                className={`
                                    py-3 px-8 rounded-xl font-bold text-lg flex items-center gap-2 transition-all transform active:scale-95
                                    ${isStep1Valid ? 'text-white shadow-lg hover:brightness-110' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                `}
                                style={{ backgroundColor: isStep1Valid ? themeColor : undefined }}
                            >
                                Calcola Preventivo <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: SUMMARY */}
                {currentStep === 2 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                        {/* Reusing PriceSummary but controlling the action button via wrapper or modifying prop */}
                        <div className="p-6 md:p-8 space-y-6">
                            <h3 className="text-xl font-black text-gray-900 mb-4">Riepilogo Preventivo</h3>
                            
                            <PriceSummary 
                                quote={quote} 
                                config={config} 
                                product={product}
                                actionLabel="Prosegui all'Upload"
                                onCheckout={nextStep} 
                            />
                        </div>

                         <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                            <button 
                                onClick={prevStep}
                                className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Indietro
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: UPLOAD */}
                {currentStep === 3 && (
                    <div className="p-6 md:p-8 animate-in slide-in-from-right-8 fade-in duration-300">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Caricamento File</h3>
                        
                        <FileUpload 
                            fileCheck={config.options.fileCheck} 
                            onChange={handleConfigChange} 
                        />

                        {/* Final Action Area */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
                             <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <span className="text-gray-600 font-medium">Totale da Pagare</span>
                                <span className="text-xl font-black" style={{ color: themeColor }}>
                                    {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(quote.totalPrice * 1.22)}
                                </span>
                             </div>

                             <div className="flex justify-between items-center">
                                <button 
                                    onClick={prevStep}
                                    className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2 px-4"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Indietro
                                </button>
                                
                                <button
                                    onClick={() => console.log('Final Add to Cart', quote)} // Real logic here
                                    disabled={!config.file}
                                    className={`
                                        py-4 px-6 rounded-xl font-bold text-lg text-white shadow-xl transition-all flex-1 ml-4
                                        ${config.file ? 'bg-green-600 hover:bg-green-700 hover:-translate-y-1 shadow-green-200' : 'bg-gray-300 cursor-not-allowed opacity-70'}
                                    `}
                                >
                                    Aggiungi al Carrello
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
