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

    return (
        <>
            {/* ================= DESKTOP VIEW (Sticky Card) ================= */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Riepilogo Ordine</h3>
                    <p className="text-sm text-gray-500 mt-1">{product?.name}</p>
                </div>

                {/* Body: Breakdown */}
                <div className="p-6 space-y-4">
                    
                    {/* Unit Price */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Prezzo Unitario</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.unitPrice)} /cad</span>
                    </div>

                    {/* Setup Costs (if any) */}
                    {quote.setupCost > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                                Costi Impianto
                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">Una Tantum</span>
                            </span>
                            <span className="font-medium text-gray-900">{formatCurrency(quote.setupCost)}</span>
                        </div>
                    )}

                    {/* File Check (if any) */}
                    {quote.extraCosts > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                                Controllo File
                                <Check className="w-3 h-3 text-emerald-500" />
                            </span>
                            <span className="font-medium text-gray-900">{formatCurrency(quote.extraCosts)}</span>
                        </div>
                    )}

                    <div className="h-px bg-gray-100 my-2" />

                    {/* Total Net */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Totale Imponibile</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(quote.totalPrice)}</span>
                    </div>

                    {/* VAT */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">IVA (22%)</span>
                        <span className="font-medium text-gray-500">{formatCurrency(vatAmount)}</span>
                    </div>

                </div>

                {/* Footer: Total Gross & CTA */}
                <div className="bg-gray-900 p-6 text-white">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-gray-300 font-medium">Totale Ordine</span>
                        <span className="text-3xl font-black tracking-tight">{formatCurrency(totalGross)}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isValid || isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                            isValid 
                            ? 'bg-brand text-white hover:brightness-110 shadow-lg shadow-brand/25' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                        // Use CSS variable for brand color or fallback
                        style={{ backgroundColor: isValid ? 'var(--brand-color, #4f46e5)' : undefined }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-6 h-6" />
                                Aggiungi al Carrello
                            </>
                        )}
                    </button>
                    {!isValid && (
                        <p className="text-center text-xs text-red-400 mt-3 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Verifica la configurazione per procedere
                        </p>
                    )}
                </div>
            </div>


            {/* ================= MOBILE BOTTOM BAR ================= */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 safe-area-bottom">
                <div className="flex items-center gap-4 max-w-7xl mx-auto">
                    {/* Left: Price Info */}
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Totale (Iva incl.)</p>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-gray-900 leading-none">{formatCurrency(totalGross)}</span>
                             <span className="text-xs text-gray-500 font-medium">({formatCurrency(quote.unitPrice)}/cad)</span>
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!isValid || isLoading}
                        className={`py-3 px-6 rounded-xl font-bold text-base flex items-center gap-2 transition-transform active:scale-95 ${
                            isValid 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: isValid ? 'var(--brand-color, #4f46e5)' : undefined }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                <span>Aggiungi</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            {/* Spacer for mobile to prevent content being hidden behind bottom bar */}
            <div className="lg:hidden h-24" />
        </>
    );
}
