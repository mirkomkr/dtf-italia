'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getPricingLogicByCategory } from '@/lib/pricing-engine';

// Dynamic Imports for Sub-Forms to keep bundle size low
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

export default function UniversalContainer({ product, categorySlug }) {
    // 1. State Management
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

    // 2. Pricing Logic Resolver
    const calculatePrice = useMemo(() => {
        return getPricingLogicByCategory(categorySlug);
    }, [categorySlug]);

    // 3. Real-time Quote Calculation
    const quote = useMemo(() => {
        return calculatePrice(config.quantity, config.productPrice, config.options);
    }, [calculatePrice, config]);

    // Handler to update config from children
    const handleConfigChange = (key, value) => {
        setConfig(prev => {
            // Handle nested options
            if (['frontColors', 'backColors', 'fileCheck', 'width', 'height', 'format', 'model', 'sizes', 'fabricColor'].includes(key)) {
                return {
                    ...prev,
                    options: {
                        ...prev.options,
                        [key]: value
                    }
                };
            }
            // Handle top level (quantity)
            return {
                ...prev,
                [key]: value
            };
        });
    };

    // 4. Form Selection Logic
    const renderForm = () => {
        const slug = categorySlug?.toLowerCase() || '';

        if (slug.includes('abbigliamento') || slug.includes('serigrafia')) {
            return <ClothingForm config={config} onChange={handleConfigChange} quote={quote} />;
        }
        
        if (slug.includes('service-stampa-dtf') || slug.includes('pellicole') || slug === 'dtf') {
            // ServiceForm handles both Rolls (DTF) and Formats (Pellicole)
            // We can pass a 'mode' prop if the form needs to behave differently UI-wise
            const mode = slug.includes('pellicole') ? 'format' : 'dimensions';
            return <ServiceForm config={config} onChange={handleConfigChange} mode={mode} quote={quote} />;
        }

        if (slug.includes('gadget') || slug.includes('calendari') || slug.includes('sublimazione')) {
            return <FixedItemForm config={config} onChange={handleConfigChange} quote={quote} />;
        }

        return <div className="p-4 text-red-500">Form categoria non trovato.</div>;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
            {/* Left Column: Form & Inputs */}
            <div className="flex-1 space-y-8">
                
                {/* Product/Category Header (Optional, if not handled by parent page) */}
                {/* <div><h1 className="text-3xl font-bold">{product?.name || 'Configura Prodotto'}</h1></div> */}

                {/* Specific Category Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                   {renderForm()}
                </div>

                {/* File Upload Section (Universal) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <FileUpload 
                        fileCheck={config.options.fileCheck} 
                        onChange={handleConfigChange} 
                    />
                </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="w-full lg:w-[400px] xl:w-[450px]">
                <div className="sticky top-24">
                    <PriceSummary 
                        quote={quote} 
                        config={config} 
                        product={product}
                        onCheckout={() => console.log('Proceed to Checkout', quote)}
                    />
                </div>
            </div>
        </div>
    );
}
