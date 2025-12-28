import React, { useState, useEffect, useMemo } from 'react';
import { Palette, Shirt, Layers, Lightbulb, TrendingUp } from 'lucide-react';
import { PRICING_CONFIG, getUpsellMessage } from '@/lib/pricing-engine';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// ... (Constants remain the same) ...
const PRINT_OPTIONS = [
    { value: 0, label: 'Nessuna Stampa' },
    { value: 1, label: '1 Colore' },
    { value: 2, label: '2 Colori' },
    { value: 3, label: 'Full Color / 3+ Colori' } 
];

const FABRIC_COLORS = [
  { id: 'nero', label: 'Nero', hex: '#000000' },
  { id: 'bianco', label: 'Bianco', hex: '#ffffff', border: true },
  { id: 'blu_notte', label: 'Blu Notte', hex: '#1e3a8a' },
  { id: 'blu_royal', label: 'Blu Royal', hex: '#2563eb' },
  { id: 'giallo', label: 'Giallo', hex: '#eab308' },
  { id: 'verde', label: 'Verde', hex: '#16a34a' },
  { id: 'viola', label: 'Viola', hex: '#7c3aed' },
];

export default function ClothingForm({ config, onChange, quote }) {
    // Local state for sizes
    const [sizeQuantities, setSizeQuantities] = useState({
        S: 0, M: 0, L: 0, XL: 0, XXL: 0
    });

    // Initialize from props
    useEffect(() => {
        if (config.options.sizes) {
            setSizeQuantities(config.options.sizes);
        }
    }, []);

    // Handle Size Change
    const handleSizeChange = (size, val) => {
        const newVal = Math.max(0, parseInt(val) || 0);
        const newSizes = { ...sizeQuantities, [size]: newVal };
        
        setSizeQuantities(newSizes);
        
        const totalQty = Object.values(newSizes).reduce((a, b) => a + b, 0);
        onChange('quantity', Math.max(1, totalQty)); 
        onChange('sizes', newSizes); 
    };

    // Calculate Dynamic Upsell Message
    const upsellInfo = useMemo(() => {
        const qty = config.quantity;
        const threshold = PRICING_CONFIG.ABBIGLIAMENTO.SOGLIA_IBRIDA; // 30

        // Case 1: Digital Mode (< 30) -> Suggest Serigraphy
        if (qty < threshold) {
            const diff = threshold - qty;
            return {
                type: 'threshold',
                message: `Mancano solo ${diff} pezzi per attivare la Serigrafia e accedere ai prezzi all'ingrosso!`
            };
        }

        // Case 2: Serigraphy Mode (>= 30) -> Suggest Next Tier
        const serigraphyMsg = getUpsellMessage('SERIGRAFIA', qty);
        if (serigraphyMsg) {
            return {
                type: 'tier',
                message: serigraphyMsg
            };
        }

        return null;
    }, [config.quantity]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* 1. Fabric Color Selection */}
            {/* ... (Existing Code) ... */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-indigo-600" />
                    Colore Tessuto
                </h3>
                <div className="flex flex-wrap gap-3">
                    {FABRIC_COLORS.map((color) => {
                        const isSelected = config.options.fabricColor === color.id;
                        return (
                            <button
                                key={color.id}
                                onClick={() => onChange('fabricColor', color.id)}
                                className={`border-black group relative w-12 h-12 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                                    isSelected 
                                    ? `ring-2 ring-offset-2 ring-indigo-600 ${color.border} scale-110` 
                                    : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.label}
                                aria-label={`Seleziona colore ${color.label}`}
                            >
                                {isSelected && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className={`w-6 h-6 ${['white', 'grey'].includes(color.id) ? 'text-gray-900' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="mt-2 text-sm text-gray-600 font-medium ml-1">
                    {FABRIC_COLORS.find(c => c.id === config.options.fabricColor)?.label || 'Seleziona un colore'}
                </p>
            </div>

            <div className="h-px bg-gray-100 my-6" />

            {/* 2. Print Configuration */}
            {/* ... (Existing Code) ... */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Posizione e Colori Stampa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-2">Fronte (Petto)</label>
                        <select
                            value={config.options.frontColors || 0}
                            onChange={(e) => onChange('frontColors', parseInt(e.target.value))}
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            {PRINT_OPTIONS.map(opt => (
                                <option key={`front-${opt.value}`} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-2">Retro (Schiena)</label>
                        <select
                            value={config.options.backColors || 0}
                            onChange={(e) => onChange('backColors', parseInt(e.target.value))}
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            {PRINT_OPTIONS.map(opt => (
                                <option key={`back-${opt.value}`} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 my-6" />

            {/* 3. Size Grid & Upsell */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Shirt className="w-5 h-5 text-indigo-600" />
                        Taglie e Quantità
                    </h3>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">Totale Pezzi</span>
                        <span className="text-2xl font-black text-indigo-600 leading-none">{config.quantity}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                    {SIZES.map((size) => (
                        <div key={size} className="relative">
                            <label htmlFor={`size-${size}`} className="block text-xs font-bold text-gray-500 uppercase mb-1 text-center">
                                {size}
                            </label>
                            <input
                                id={`size-${size}`}
                                type="number"
                                min="0"
                                inputMode="numeric"
                                placeholder="0"
                                value={sizeQuantities[size] || ''}
                                onChange={(e) => handleSizeChange(size, e.target.value)}
                                className="w-full p-3 border-2 border-gray-100 rounded-xl text-center text-lg font-bold text-gray-900 focus:border-indigo-500 focus:ring-0 transition-all outline-none"
                            />
                        </div>
                    ))}
                </div>

                {/* UPSELL MESSAGE BOX */}
                {upsellInfo && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 animate-in slide-in-from-top-2 duration-300 shadow-sm relative overflow-hidden">
                        <div className="bg-amber-100 p-2 rounded-full absolute -right-3 -top-3 opacity-50">
                             <TrendingUp className="w-12 h-12 text-amber-300" />
                        </div>
                        
                        <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0 animate-bounce">
                           <Lightbulb className="w-5 h-5 text-amber-600" fill="currentColor" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-amber-800 text-sm uppercase tracking-wide mb-0.5">Suggerimento Risparmio</h4>
                            <p className="text-amber-900 font-medium text-sm leading-tight">
                                {upsellInfo.message}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Visual Feedback for Pricing Tier */}
                {quote && (
                    <div className={`mt-4 p-3 rounded-lg text-sm border flex items-center gap-2 transition-colors duration-300 ${
                        quote.method === 'SERIGRAFIA' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                        : 'bg-indigo-50 text-indigo-800 border-indigo-100'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${quote.method === 'SERIGRAFIA' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                        <span className="font-semibold">{quote.method === 'SERIGRAFIA' ? 'Stampa Serigrafica Attiva (Bulk)' : 'Stampa Digitale Attiva (Retail)'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
