'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
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
  const [quantity, setQuantity] = useState(initialConfig?.quantity || 0);
  const [extras, setExtras] = useState({
    isFullService: initialConfig?.isFullService || false,
    isFlashOrder: initialConfig?.isFlashOrder || false
  });
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    if(!selectedFormat || quantity <= 0) {
      setPriceData(null);
      if (onUpdate) onUpdate({ format: selectedFormat, quantity, price: null });
      return;
    }
    const w = selectedFormat === 'custom' ? parseFloat(customDims.w) : DTF_FORMATS[selectedFormat]?.w;
    const h = selectedFormat === 'custom' ? parseFloat(customDims.h) : DTF_FORMATS[selectedFormat]?.h;
    if (selectedFormat === 'custom' && (!w || !h)) { setPriceData(null); return; }

    const params = {
      quantity: parseInt(quantity, 10) || 1,
      format: selectedFormat, width: w, height: h,
      isFullService: extras.isFullService, isFlashOrder: extras.isFlashOrder
    };
    const calculated = calculatePrice('dtf', params);
    setPriceData(calculated);
    if (onUpdate) onUpdate({ ...params, price: calculated });
  }, [selectedFormat, customDims, quantity, extras]);

  return (
    <div className="space-y-8">
        
        {/* 1. Selezione Formato */}
        <section className="space-y-3" aria-label="Selezione Formato Stampa">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. Scegli il Formato</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="group">
                {Object.entries(DTF_FORMATS).map(([key, value]) => {
                    const isSelected = selectedFormat === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setSelectedFormat(key)}
                            aria-pressed={isSelected}
                            className={cn(
                                "relative p-4 rounded-xl border-2 text-left transition-all h-full min-h-[80px] flex flex-col justify-center",
                                isSelected 
                                    ? (brandColor === 'red' ? "border-red-600 bg-red-50 text-red-900" : "border-indigo-600 bg-indigo-50 text-indigo-900")
                                    : "border-gray-100 text-gray-400 hover:bg-gray-50 bg-white"
                            )}
                        >
                            <span className="block text-sm font-bold leading-tight mb-1">{value.label}</span>
                            <span className="block text-[10px] font-mono opacity-60">
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
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label htmlFor="width-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Larghezza (max 58cm)</label>
                            <input 
                                id="width-input"
                                type="number" 
                                value={customDims.w}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val <= 58) setCustomDims(p => ({...p, w: val}));
                                }}
                                className={cn(
                                    "w-full h-12 border-2 border-gray-200 rounded-xl px-4 font-bold outline-none transition-all",
                                    brandColor === 'red' ? "focus:border-red-600 focus:ring-4 focus:ring-red-600/10" : "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
                                )}
                                placeholder="cm"
                            />
                        </div>
                        <div className="hidden sm:block pb-3 text-gray-300 font-bold" aria-hidden="true">×</div>
                        <div className="flex-1 space-y-2">
                            <label htmlFor="height-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Altezza (cm)</label>
                            <input 
                                id="height-input"
                                type="number" 
                                value={customDims.h}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setCustomDims(p => ({...p, h: e.target.value}))}
                                className={cn(
                                    "w-full h-12 border-2 border-gray-200 rounded-xl px-4 font-bold outline-none transition-all",
                                    brandColor === 'red' ? "focus:border-red-600 focus:ring-4 focus:ring-red-600/10" : "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
                                )}
                                placeholder="cm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* 2. Servizi Aggiuntivi */}
        <section className="space-y-3" aria-label="Servizi Aggiuntivi">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Servizi Aggiuntivi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Checkbox personalizzate con aria-checked */}
                <div 
                    role="checkbox"
                    aria-checked={extras.isFullService}
                    tabIndex={0}
                    onClick={() => setExtras(p => ({...p, isFullService: !p.isFullService}))}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setExtras(p => ({...p, isFullService: !p.isFullService}));
                        }
                    }}
                    className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        extras.isFullService 
                            ? (brandColor === 'red' ? "bg-red-50 border-red-600" : "bg-indigo-50 border-indigo-600")
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        extras.isFullService 
                            ? (brandColor === 'red' ? "bg-red-600 border-red-600" : "bg-indigo-600 border-indigo-600") 
                            : "border-gray-300"
                    )}>
                        {extras.isFullService && <CheckIcon className="text-white w-3 h-3" />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Full Service (+10%)</p>
                        <p className="text-xs text-gray-500">Revisione file e ottimizzazione nesting.</p>
                    </div>
                </div>

                <div 
                    role="checkbox"
                    aria-checked={extras.isFlashOrder}
                    tabIndex={0}
                    onClick={() => setExtras(p => ({...p, isFlashOrder: !p.isFlashOrder}))}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setExtras(p => ({...p, isFlashOrder: !p.isFlashOrder}));
                        }
                    }}
                    className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        extras.isFlashOrder 
                            ? "bg-amber-50 border-amber-500"
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        extras.isFlashOrder ? "bg-amber-500 border-amber-500" : "border-gray-300"
                    )}>
                        {extras.isFlashOrder && <CheckIcon className="text-white w-3 h-3" />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Ordine Flash (+10%)</p>
                        <p className="text-xs text-gray-500">Produzione prioritaria in 24h.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Quantità e Prezzo */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100" aria-label="Riepilogo Quantità e Prezzo">
            <div className="space-y-3">
                <label htmlFor="qty-main" className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Quantità</label>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <input 
                        id="qty-main"
                        type="number"
                        value={quantity === 0 ? '' : quantity}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                            const valStr = e.target.value;
                            setQuantity(valStr === '' ? 0 : parseInt(valStr, 10));
                        }}
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
                                    <span className="text-sm font-bold text-gray-400 uppercase">
                                        {formatCurrency(priceData.unitPrice)} / cad.
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Totale Stimato (IVA escl.)
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-medium text-gray-400 italic">
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