import React, { useState, useEffect } from 'react';
import { 
  calculatePrice, 
  formatCurrency 
} from '../../../lib/pricing-engine';
import { PRICING_CONFIG } from '../../../lib/pricing-config';
import { Check, Info, Zap, Package } from 'lucide-react';
import DTFVisualizer from './DTFVisualizer';

const DTFConfigStep = ({ onUpdate, initialConfig }) => {
  const DTF_FORMATS = PRICING_CONFIG.dtf.formats;
  
  const [selectedFormat, setSelectedFormat] = useState(initialConfig?.format || 'a3');
  const [customDims, setCustomDims] = useState({ w: '', h: '' });
  const [quantity, setQuantity] = useState(initialConfig?.quantity || 1);
  const [extras, setExtras] = useState({
    isFullService: initialConfig?.isFullService || false,
    isFlashOrder: initialConfig?.isFlashOrder || false
  });
  const [priceData, setPriceData] = useState(null);

  // Helper to get dimensions
  const getDims = (fmt) => {
    if (fmt === 'custom') return customDims;
    return { w: DTF_FORMATS[fmt]?.w || 0, h: DTF_FORMATS[fmt]?.h || 0 };
  };

  // Recalculate price whenever inputs change
  useEffect(() => {
    const { w, h } = getDims(selectedFormat);
    
    // Validate inputs
    if (selectedFormat === 'custom' && (!w || !h)) {
        setPriceData(null);
        return;
    }

    const params = {
      quantity: parseInt(quantity, 10) || 1, // Fallback to 1 if NaN
      format: selectedFormat,
      width: parseFloat(w),
      height: parseFloat(h),
      isFullService: extras.isFullService,
      isFlashOrder: extras.isFlashOrder
    };

    const calculated = calculatePrice('dtf', params);
    setPriceData(calculated);

    // Bubble up to parent
    if (onUpdate) {
      onUpdate({ ...params, price: calculated });
    }
  }, [selectedFormat, customDims, quantity, extras]);


  const handleFormatSelect = (key) => {
    setSelectedFormat(key);
  };

  const toggleExtra = (key) => {
    setExtras(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Format Selection */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            1. Seleziona Formato
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(DTF_FORMATS).map(([key, value]) => {
            const isSelected = selectedFormat === key;
            return (
              <button
                key={key}
                onClick={() => handleFormatSelect(key)}
                className={`
                  relative flex items-center p-3 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                  }
                `}
              >
                 <div className="flex-1 min-w-0">
                     <span className="block text-sm font-bold text-slate-800 leading-tight truncate">
                        {value.label}
                     </span>
                     {!value.isCustom ? (
                        <span className="block text-xs text-slate-500 font-mono mt-0.5">
                            {value.w}x{value.h} cm
                        </span>
                     ) : (
                        <span className="block text-xs text-slate-400 font-mono mt-0.5">
                            Inserisci misure
                        </span>
                     )}
                 </div>
                 
                 {isSelected && (
                    <div className="ml-2 bg-indigo-600 text-white p-1 rounded-full flex-shrink-0">
                        <Check size={12} />
                    </div>
                 )}
              </button>
            );
          })}
        </div>

        {/* Custom Inputs */}
        {selectedFormat === 'custom' && (
           <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 flex gap-4 items-center">
              <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Larghezza (cm)</label>
                  <input 
                    type="number" 
                    value={customDims.w}
                    onChange={(e) => setCustomDims(prev => ({...prev, w: e.target.value}))}
                    className="w-full border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="es. 25"
                  />
              </div>
              <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Altezza (cm)</label>
                  <input 
                    type="number" 
                    value={customDims.h}
                    onChange={(e) => setCustomDims(prev => ({...prev, h: e.target.value}))}
                    className="w-full border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="es. 40"
                  />
              </div>
           </div>
        )}
      </section>

      {/* 2. Extra Options */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">2. Opzioni Extra</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Service */}
            <div 
                onClick={() => toggleExtra('isFullService')}
                className={`cursor-pointer p-4 rounded-lg border-2 flex items-start gap-3 transition-colors ${extras.isFullService ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}
            >
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${extras.isFullService ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400 bg-white'}`}>
                    {extras.isFullService && <Check size={14} className="text-white" />}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        Pensa a tutto DTF Italia (+10%) <Package size={16} className="text-indigo-600"/>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                        Revisione file, nesting ottimizzato e rimozione sfondo professionale.
                    </p>
                </div>
            </div>

            {/* Flash Order */}
            <div 
                onClick={() => toggleExtra('isFlashOrder')}
                className={`cursor-pointer p-4 rounded-lg border-2 flex items-start gap-3 transition-colors ${extras.isFlashOrder ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'}`}
            >
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${extras.isFlashOrder ? 'bg-amber-600 border-amber-600' : 'border-slate-400 bg-white'}`}>
                    {extras.isFlashOrder && <Check size={14} className="text-white" />}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        Ordine Flash (+10%) <Zap size={16} className="text-amber-500 fill-amber-500"/>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                        Priorità massima in produzione. Spedizione garantita in 24/48h.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Quantity */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">3. Quantità e Riepilogo</h3>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="w-full md:w-auto">
                    <label htmlFor="quantity-input" className="block text-sm font-medium text-slate-700 mb-2">Numero di Pezzi/Copie</label>
                    <input 
                        id="quantity-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                        className="block w-32 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold text-center"
                    />
                </div>

                <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-xl text-right">
                    {priceData ? (
                        <>
                            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Totale Stimato (IVA escl.)</div>
                            <div className="text-3xl font-black text-indigo-600">
                                {formatCurrency(priceData.totalPrice)}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {formatCurrency(priceData.unitPrice)} cad.
                            </div>
                            {priceData.details && (
                                <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-indigo-500 font-medium">
                                    Prezzo equivalente: {formatCurrency(priceData.details.effectiveMeterPrice)} / mt
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-slate-400 italic">Configura per vedere il prezzo</div>
                    )}
                </div>
            </div>
            
            {/* Visualizer Integration */}
            {priceData && priceData.details && (
                <div className="mt-8 border-t border-dashed border-slate-200 pt-6">
                     <DTFVisualizer 
                        totalMeters={priceData.details.totalMeters} 
                        piecesPerRow={priceData.details.piecesPerRow} 
                    />
                </div>
            )}
        </div>
      </section>

    </div>
  );
};

export default DTFConfigStep;
