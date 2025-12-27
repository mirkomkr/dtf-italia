'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getPricingLogicByCategory } from '@/lib/pricing-engine';

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

    // Theme Logic
    const isDTF = categorySlug.includes('dtf') || categorySlug.includes('service');
    const themeColor = isDTF ? '#6366f1' : '#ea580c'; // Indigo vs Orange
    const themeShadow = isDTF ? 'rgba(99, 102, 241, 0.4)' : 'rgba(234, 88, 12, 0.4)';

    return (
        <div 
            className="w-full max-w-4xl mx-auto flex flex-col gap-6"
            style={{ 
                '--brand-color': themeColor,
                '--brand-shadow': themeShadow 
            }}
        >
            {/* 1. CONFIGURATION FORM */}
            <div className={`
                transition-all duration-300
                ${variant === 'hero' 
                    ? 'bg-transparent text-left' 
                    : 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'
                }
            `}>
                {renderForm()}
            </div>

            {/* 2. FILE UPLOAD */}
            <div className={`
                 transition-all duration-300
                 ${variant === 'hero' 
                     ? 'bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-100 p-6' 
                     : 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'
                 }
            `}>
                <FileUpload 
                    fileCheck={config.options.fileCheck} 
                    onChange={handleConfigChange} 
                />
            </div>

            {/* 3. PRICE SUMMARY & ACTION (Horizontal Box at Bottom) */}
            <PriceSummary 
                quote={quote} 
                config={config} 
                product={product}
                onCheckout={() => console.log('Proceed to Checkout', quote)}
            />
        </div>
    );
}
