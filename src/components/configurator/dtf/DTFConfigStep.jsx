'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { calculatePrice, formatCurrency } from '../../../lib/pricing-engine';
import { PRICING_CONFIG } from '../../../lib/pricing-config';
import DTFVisualizer from './DTFVisualizer';

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function DTFConfigStep({ 
    onUpdate, 
    initialConfig,
    brandColor = 'indigo' 
}) {
  const DTF_FORMATS = PRICING_CONFIG.dtf.formats;
  
  const [selectedFormat, setSelectedFormat] = useState(initialConfig?.format || '');
  const [customDims, setCustomDims] = useState({ w: '', h: '' });
  
  // Refactor: Make specific variables derived from props/state
  const quantity = initialConfig?.quantity || 0;
  
  const [priceData, setPriceData] = useState(null);

  // Sync internal state with external props if they change deeply (optional but safe)
  useEffect(() => {
      // If props for extras change outside, we might want to sync. 
      // primarily relying on 'onUpdate' to keep parent in sync.
  }, []);

  useEffect(() => {
    if(!selectedFormat || quantity <= 0) {
      setPriceData(null);
      // Avoid calling onUpdate if we are just syncing? 
      // If quantity is 0, we want to ensure parent knows price is null
      if (initialConfig?.price !== null) {
          // Only update if not already null to prevent loops? 
          // But onUpdate is safe in Container.
      }
      return;
    }
    const w = selectedFormat === 'custom' ? parseFloat(customDims.w) : DTF_FORMATS[selectedFormat]?.w;
    const h = selectedFormat === 'custom' ? parseFloat(customDims.h) : DTF_FORMATS[selectedFormat]?.h;
    if (selectedFormat === 'custom' && (!w || !h)) { setPriceData(null); return; }

    const params = {
      quantity: parseInt(quantity, 10) || 0,
      format: selectedFormat, width: w, height: h,
      isFullService: false, isFlashOrder: false
    };
    const calculated = calculatePrice('dtf', params);
    
    // Only update if price changed to avoid loop
    if (JSON.stringify(calculated) !== JSON.stringify(priceData)) {
        setPriceData(calculated);
        if (onUpdate) onUpdate({ ...params, price: calculated });
    }
  }, [selectedFormat, customDims, quantity, priceData, onUpdate, DTF_FORMATS, initialConfig?.price]); // Added dependencies

  const handleQuantityInput = (val) => {
      const newQty = val === '' ? 0 : parseInt(val, 10);
      if (onUpdate) {
         // Optimistic update: Parent will re-render us with new qty
         // We also invalidate price until effect runs
         onUpdate({ ...initialConfig, quantity: newQty, price: null });
      }
  };

  return (
    <div className="space-y-8">
        
        {/* 1. Selezione Formato */}
        <section className="space-y-3" aria-label="Selezione Formato Stampa">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">1. Scegli il Formato</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="group">
                {Object.entries(DTF_FORMATS).map(([key, value]) => {
                    const isSelected = selectedFormat === key;
                    return (
                        <button
                            key={key}
                            onClick={() => {
                                setSelectedFormat(key);
                                // Trigger update immediately for responsiveness
                                if(onUpdate) onUpdate({ ...initialConfig, format: key, price: null });
                            }}
                            aria-pressed={isSelected}
                            className={cn(
                                "relative p-4 rounded-xl border-2 text-left transition-all h-full min-h-[80px] flex flex-col justify-center",
                                isSelected 
                                    ? (brandColor === 'red' ? "border-red-600 bg-red-50 text-red-900" : "border-indigo-600 bg-indigo-50 text-indigo-900")
                                    : "border-gray-100 text-gray-600 hover:bg-gray-50 bg-white"
                            )}
                        >
                            <span className="block text-sm font-bold leading-tight mb-1">{value.label}</span>
                            <span className="block text-[10px] font-mono font-bold text-gray-500">
                                {value.isCustom ? 'MISURA PERSONALIZZATA' : `${value.w}x${value.h} cm`}
                            </span>
                            {isSelected && (
                                <div className={cn(
                                    "absolute top-2 right-2 p-0.5 rounded-full text-white",
                                    brandColor === 'red' ? "bg-red-600" : "bg-indigo-600"
                                )}>
                                    <CheckIcon className="w-3 h-3" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Input Custom con ID per Label Association */}
            {selectedFormat === 'custom' && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            <div className="flex-1 w-full space-y-2">
                                <label htmlFor="width-input" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                                    <span>Larghezza (max 58cm)</span>
                                    {customDims.w >= PRICING_CONFIG.dtf.BOBINA_WIDTH && (
                                        <span className="text-red-600 animate-pulse flex items-center gap-1 normal-case font-medium">
                                            <AlertCircle size={10} /> Limite raggiunto
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input 
                                        id="width-input"
                                        type="number" 
                                        value={customDims.w}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val <= PRICING_CONFIG.dtf.BOBINA_WIDTH) {
                                                setCustomDims(p => ({...p, w: val}));
                                            }
                                        }}
                                        aria-invalid={customDims.w >= PRICING_CONFIG.dtf.BOBINA_WIDTH}
                                        aria-describedby="width-warning"
                                        className={cn(
                                            "w-full h-12 border-2 rounded-xl px-4 font-bold outline-none transition-all",
                                            customDims.w >= PRICING_CONFIG.dtf.BOBINA_WIDTH 
                                                ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/10" 
                                                : (brandColor === 'red' ? "border-gray-200 focus:border-red-600 focus:ring-4 focus:ring-red-600/10" : "border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10")
                                        )}
                                        placeholder="cm"
                                    />
                                    <div id="width-warning" aria-live="polite" className="sr-only">
                                        {customDims.w >= PRICING_CONFIG.dtf.BOBINA_WIDTH ? "Hai raggiunto la larghezza massima di 58 centimetri" : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:block pb-3 text-gray-300 font-bold" aria-hidden="true">×</div>
                            
                            <div className="flex-1 w-full space-y-2">
                                <label htmlFor="height-input" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                                    <span>Lunghezza (max 300cm)</span>
                                    {customDims.h >= PRICING_CONFIG.dtf.MAX_CUSTOM_HEIGHT && (
                                        <span className="text-red-600 animate-pulse flex items-center gap-1 normal-case font-medium">
                                            <AlertCircle size={10} /> Limite raggiunto
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input 
                                        id="height-input"
                                        type="number" 
                                        value={customDims.h}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val <= PRICING_CONFIG.dtf.MAX_CUSTOM_HEIGHT) {
                                                setCustomDims(p => ({...p, h: val}));
                                            }
                                        }}
                                        aria-invalid={customDims.h >= PRICING_CONFIG.dtf.MAX_CUSTOM_HEIGHT}
                                        aria-describedby="height-warning"
                                        className={cn(
                                            "w-full h-12 border-2 rounded-xl px-4 font-bold outline-none transition-all",
                                            customDims.h >= PRICING_CONFIG.dtf.MAX_CUSTOM_HEIGHT 
                                                ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/10" 
                                                : (brandColor === 'red' ? "border-gray-200 focus:border-red-600 focus:ring-4 focus:ring-red-600/10" : "border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10")
                                        )}
                                        placeholder="cm"
                                    />
                                    <div id="height-warning" aria-live="polite" className="sr-only">
                                        {customDims.h >= PRICING_CONFIG.dtf.MAX_CUSTOM_HEIGHT ? "Hai raggiunto la lunghezza massima di 300 centimetri" : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* 2. Quantità e Prezzo */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100" aria-label="Riepilogo Quantità e Prezzo">
            <div className="space-y-3">
                <label htmlFor="qty-main" className="text-xs font-bold text-gray-600 uppercase tracking-widest">2. Quantità</label>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <input 
                        id="qty-main"
                        type="number"
                        value={quantity === 0 ? '' : quantity}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleQuantityInput(e.target.value)}
                        className={cn(
                            "w-32 h-12 rounded-xl border-2 border-gray-200 bg-white text-gray-900 text-lg font-bold text-center transition-all focus:outline-none",
                            brandColor === 'red' ? "focus:border-red-600 focus:ring-4 focus:ring-red-600/10" : "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
                        )}
                        placeholder="0"
                    />

                    <div className="flex flex-col md:items-end" aria-live="polite">
                        {priceData ? (
                            <>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-gray-900 tracking-tight">
                                        {formatCurrency(priceData.totalPrice)}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-600 uppercase">
                                            {formatCurrency(priceData.unitPrice)} / cad.
                                        </span>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                                            (IVA incl.)
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm font-medium text-gray-600 italic">
                                Inserisci i dati per il prezzo
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Visualizer */}
            {priceData && priceData.details && (
                <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in duration-500">
                    <DTFVisualizer 
                        totalMeters={priceData.details.totalMeters} 
                        piecesPerRow={priceData.details.piecesPerRow} 
                    />
                </div>
            )}
        </section>

    </div>
  );
}