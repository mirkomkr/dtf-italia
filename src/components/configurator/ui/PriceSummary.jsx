'use client';

import React, { useState } from 'react';
import { ShoppingCart, Loader2, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/pricing-engine';

export default function PriceSummary({ quote, config, product, onCheckout }) {
    const [isLoading, setIsLoading] = useState(false);

    // Safety check if quote is not ready yet
    if (!quote) return null;

    // Financial Cals
    const vatRate = 0.22;
    const vatAmount = quote.totalPrice * vatRate;
    const totalGross = quote.totalPrice + vatAmount;

    // Validations (Disable button if invalid)
    // E.g. Quantity must be > 0. 
    // For DTF Service: Width must be > 0 if not preset (though ServiceForm handles defaults)
    const isValid = config.quantity > 0 && quote.totalPrice > 0;

    const handleAddToCart = async () => {
        if (!isValid) return;
        setIsLoading(true);

        // Simulate API delay / Processing
        await new Promise(resolve => setTimeout(resolve, 800));

        const cartPayload = {
            productId: product?.id,
            productName: product?.name,
            quantity: config.quantity,
            totalPrice: totalGross, // Saving Gross Price
            tax: vatAmount,
            configuration: {
                ...config.options,
                method: quote.method || 'STANDARD',
                breakdown: quote.breakdown
            }
        };

        console.log('[AddToCart] Payload:', cartPayload);
        
        // Trigger parent handler if exists
        if (onCheckout) onCheckout(cartPayload);
        
        setIsLoading(false);
    };

    // Default Label
    const buttonLabel = onCheckout ? (props?.actionLabel || "Aggiungi al Carrello") : "Aggiungi al Carrello";

    return (
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Title */}
            <div className="flex items-center gap-3 mb-6">
                 <div className="h-8 w-1 bg-current rounded-full opacity-50" />
                 <h3 className="text-xl font-bold text-gray-900">Riepilogo Ordine</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-end">
                {/* Left: Detailed Breakdown */}
                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                        <span>Prezzo Unitario</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.unitPrice)}</span>
                    </div>
                    {quote.setupCost > 0 && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                            <span>Costi Impianto (Una Tantum)</span>
                            <span className="font-medium text-gray-900">{formatCurrency(quote.setupCost)}</span>
                        </div>
                    )}
                    {quote.extraCosts > 0 && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                            <span className="flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Controllo File
                            </span>
                            <span className="font-medium text-gray-900">{formatCurrency(quote.extraCosts)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-1">
                        <span>Imponibile</span>
                        <span className="font-bold text-gray-900">{formatCurrency(quote.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-75">
                        <span>IVA 22%</span>
                        <span>{formatCurrency(vatAmount)}</span>
                    </div>
                </div>

                {/* Right: Total & Action */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end md:justify-end md:gap-4">
                        <span className="text-gray-500 font-medium mb-1 md:mb-2">Totale Ordine</span>
                        <span className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-none">
                            {formatCurrency(totalGross)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isValid || isLoading}
                        className={`w-full py-4 px-8 rounded-xl font-black text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                            isValid 
                            ? 'text-white shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        // Use CSS variable/prop for brand color. We will set this in parent containers.
                        style={{ 
                            backgroundColor: isValid ? 'var(--brand-color, #4f46e5)' : undefined,
                            boxShadow: isValid ? '0 10px 25px -5px var(--brand-shadow, rgba(79, 70, 229, 0.4))' : 'none'
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
                                {buttonLabel}
                            </>
                        )}
                    </button>
                    {!isValid && (
                         <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium bg-red-50 py-2 rounded-lg border border-red-100">
                            <AlertCircle className="w-4 h-4" />
                            <span>Completa la configurazione per procedere</span>
                         </div>
                    )}
                </div>
            </div>
            
            {/* Mobile Sticky Bar - Only visible on small screens to ensure conversion */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-area-bottom">
                 <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <span className="block text-xs text-gray-500 uppercase font-bold">Totale</span>
                        <span className="block text-xl font-black text-gray-900 leading-none">{formatCurrency(totalGross)}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!isValid || isLoading}
                        className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider text-white shadow-lg ${!isValid ? 'opacity-50 grayscale' : ''}`}
                        style={{ backgroundColor: 'var(--brand-color, #4f46e5)' }}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : buttonLabel}
                    </button>
                 </div>
            </div>
        </div>
    );
}
