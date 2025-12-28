'use client';

import React from 'react';
import { ShoppingBag, Calendar, Image as ImageIcon } from 'lucide-react';

export default function FixedItemForm({ config, onChange, quote }) {
    
    // Helper to determine icon based on category
    const getIcon = () => {
        const slug = config.options.category?.toLowerCase() || '';
        if (slug.includes('gadget')) return <ShoppingBag className="w-6 h-6 text-indigo-600" />;
        if (slug.includes('calendari')) return <Calendar className="w-6 h-6 text-indigo-600" />;
        return <ImageIcon className="w-6 h-6 text-indigo-600" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    {getIcon()}
                    Configura Prodotto
                </h3>
                <p className="text-gray-500">Scegli la quantità desiderata per questo prodotto.</p>
            </div>

            {/* Quantity Input */}
             <div>
                <label htmlFor="quantity-input" className="block text-sm font-bold text-gray-700 mb-2">
                    Quantità
                </label>
                <div className="relative">
                    <input
                        id="quantity-input"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.quantity}
                        onChange={(e) => onChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-4 border-2 border-gray-100 rounded-xl text-xl font-bold text-gray-900 focus:border-indigo-500 focus:ring-0 outline-none transition-all shadow-sm"
                        placeholder="1"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">
                        Pezzi
                    </div>
                </div>
            </div>

            {/* Product Specific Option (Model/Variant) if needed can go here */}
            {/* Keeping it simple for Fixed Items as per request */}

            {/* Recap Box */}
            {quote && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Prezzo Unitario stimato</span>
                    <span className="text-gray-900 font-bold">{quote.unitPrice.toFixed(2)}€</span>
                </div>
            )}
        </div>
    );
}
