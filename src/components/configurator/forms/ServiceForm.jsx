'use client';

import React, { useState, useEffect } from 'react';

const STANDARD_SIZES = [
  { id: 'logo', label: 'Logo Cuore (10x10 cm)', width: 10, height: 10 },
  { id: 'a4', label: 'Foglio A4 (20x29 cm)', width: 20, height: 29 },
  { id: 'a3', label: 'Foglio A3 (29x42 cm)', width: 29, height: 42 },
  { id: 'meter', label: 'Metro Lineare (56x100 cm)', width: 56, height: 100 },
  { id: 'custom', label: 'Formato Personalizzato', isCustom: true }
];

const MAX_WIDTH = 56; // Larghezza utile bobina

// import React, { useState, useEffect } from 'react'; // Already imported
import { ShieldCheck } from 'lucide-react';

// ... STANDARD_SIZES ... (keep existing)

export default function ServiceForm({ config, onChange, mode = 'dimensions', quote }) {
    const [selectedFormat, setSelectedFormat] = useState('a3'); // Default A3
    const [isCustom, setIsCustom] = useState(false);

    // Initial setup
    useEffect(() => {
        // Set default A3 on mount if nothing is set
        if (config.options.width === 0) {
           handleFormatChange('a3'); 
        }
    }, []);

    const handleFormatChange = (formatId) => {
        const format = STANDARD_SIZES.find(s => s.id === formatId);
        setSelectedFormat(formatId);
        
        if (format.isCustom) {
            setIsCustom(true);
            // Pre-fill with current values if they exist, or default to A3 dimensions if 0
            if (config.options.width === 0) {
                const defaultSize = STANDARD_SIZES.find(s => s.id === 'a3');
                onChange('width', defaultSize.width);
                onChange('height', defaultSize.height);
            }
        } else {
            setIsCustom(false);
            // Propagate standard dimensions
            onChange('width', format.width);
            onChange('height', format.height);
        }
    };

    // ... handleCustomDimensionChange ... (keep existing)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Configura Formato</h3>
                
                {/* 1. Format Selection */}
                {/* ... existing select ... */}
                <div className="mb-6">
                    <label htmlFor="format-select" className="block text-sm font-semibold text-gray-700 mb-2">
                        Seleziona Formato
                    </label>
                    <div className="relative">
                        <select
                            id="format-select"
                            value={selectedFormat}
                            onChange={(e) => handleFormatChange(e.target.value)}
                            className="w-full p-4 pr-10 appearance-none bg-white border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-indigo-500 focus:ring-0 transition-colors cursor-pointer"
                        >
                            {STANDARD_SIZES.map((size) => (
                                <option key={size.id} value={size.id}>
                                    {size.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 2. Custom Dimensions Inputs */}
                {isCustom && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100 mb-6">
                        <div>
                            <label htmlFor="custom-width" className="block text-xs font-bold text-orange-800 uppercase mb-1">
                                Base (cm)
                            </label>
                            <input
                                id="custom-width"
                                type="number"
                                min="1"
                                max={MAX_WIDTH}
                                step="0.1"
                                value={config.options.width || ''}
                                onChange={(e) => handleCustomDimensionChange(e, 'width')}
                                className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-center font-bold text-gray-900"
                                placeholder="Larghezza"
                            />
                            <p className="text-[10px] text-orange-600 mt-1">Max {MAX_WIDTH}cm</p>
                        </div>
                        <div>
                            <label htmlFor="custom-height" className="block text-xs font-bold text-orange-800 uppercase mb-1">
                                Altezza (cm)
                            </label>
                            <input
                                id="custom-height"
                                type="number"
                                min="1"
                                step="0.1"
                                value={config.options.height || ''}
                                onChange={(e) => handleCustomDimensionChange(e, 'height')}
                                className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-center font-bold text-gray-900"
                                placeholder="Altezza"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Quantity Input */}
            <div>
                {/* ... existing quantity input ... */}
                <label htmlFor="quantity-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantità {isCustom ? '(Pezzi)' : '(Copie)'}
                </label>
                <div className="flex items-center">
                    <input
                        id="quantity-input"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.quantity}
                        onChange={(e) => onChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                    />
                </div>
            </div>

            {/* 4. File Check Option */}
            <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${config.options.fileCheck ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => onChange('fileCheck', !config.options.fileCheck)}
            >
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${config.options.fileCheck ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                    {config.options.fileCheck && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                </div>
                <div>
                     <span className="font-bold text-gray-900 block text-sm">Controllo Professionale File (+€10,00)</span>
                     <span className="text-xs text-gray-500 leading-tight block mt-1">
                        Verifichiamo risoluzione, margini e trasparenze prima della stampa. Evita brutte sorprese.
                     </span>
                </div>
            </div>

            {/* 5. Linear Meters Estimation Display */}
            {quote && quote.linearMeters > 0 && (
                <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex gap-3 items-start border border-blue-100">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <p className="font-bold text-blue-900 mb-1">
                            Spazio occupato stimato: {quote.linearMeters} metri lineari
                        </p>
                        <p className="text-xs opacity-80">
                            (Calcolato con nesting automatico su bobina da 56cm)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
