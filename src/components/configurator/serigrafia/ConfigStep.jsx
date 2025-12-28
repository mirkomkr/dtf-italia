'use client';

import React from 'react';
import { cn } from '@/lib/utils';
// import Check from 'lucide-react/dist/esm/icons/check'; // REMOVED
// import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'; // REMOVED
import { formatCurrency } from '@/lib/pricing-engine';
import { SHIRT_COLORS, SHIRT_SIZES } from './constants';
import dynamic from 'next/dynamic';

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);


// Dynamic imports for heavy UI components
const SizeMatrix = dynamic(() => import('../shared/SizeMatrix'), {
  loading: () => <div className="h-40 bg-gray-50 rounded-xl animate-pulse" />,
  ssr: false
});

const SingleSizeSelector = dynamic(() => import('../shared/SingleSizeSelector'), {
    loading: () => <div className="h-20 bg-gray-50 rounded-xl animate-pulse" />,
    ssr: false
});

const PrintOptionSelector = dynamic(() => import('../shared/PrintOptionSelector'), {
    loading: () => <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />,
    ssr: false
});

export default function ConfigStep({
  enableVariants = true,
  activeGender,
  setActiveGender,
  selectedColor,
  setSelectedColor,
  quantities,
  onQuantityChange,
  singleQuantity,
  setSingleQuantity,
  frontPrint,
  setFrontPrint,
  backPrint,
  setBackPrint,
  fileCheck,
  setFileCheck,
  price,
  totalQuantity,
  onNext
}) {
  
  // Helper to count items per color (for badges)
  const getColorTotal = (colorId) => {
      const colorData = quantities[colorId];
      if(!colorData) return 0;
      // Sum all genders, all sizes
      return Object.values(colorData).reduce((accG, gQty) => 
          accG + Object.values(gQty).reduce((a, b) => a + (parseInt(b) || 0), 0) 
      , 0);
  };

  // Helper to get quantities for current view (current color + gender)
  const getCurrentViewQuantities = () => {
      if(!selectedColor) return {};
      return quantities[selectedColor]?.[activeGender] || {};
  };

  return (
    <div className="flex-grow flex flex-col space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Configura Prodotto</h2>
            <p className="text-sm text-gray-500">Scegli taglie e colori. Puoi abbinare più colori nello stesso ordine.</p>
        </div>

        {/* Gender Selection - ONLY if variants enabled */}
        {enableVariants && (
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Modello</label>
                <div className="grid grid-cols-3 gap-3">
                    {['uomo', 'donna', 'bambino'].map(gender => (
                        <button
                            key={gender}
                            onClick={() => setActiveGender(gender)}
                            className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 capitalize",
                            activeGender === gender 
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600" 
                                : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-gray-50"
                            )}
                        >
                            <span className="font-bold text-base sm:text-lg">{gender}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Colors */}
         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Colore</label>
            <div className="flex flex-wrap gap-3">
            {SHIRT_COLORS.map((color) => {
                const isSelected = selectedColor === color.id;
                const isDimmed = selectedColor !== null && !isSelected;
                const itemsInColor = getColorTotal(color.id);

                return (
                <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-sm flex items-center justify-center relative group",
                    isSelected && "border-indigo-600 ring-4 ring-indigo-100 scale-125 z-10 opacity-100",
                    isDimmed && "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110",
                    selectedColor === null && "border-transparent hover:scale-110 scale-100 opacity-100",
                    color.border && !isSelected ? "border-gray-200" : ""
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                >
                    {isSelected && (
                        <CheckIcon className={cn("w-5 h-5", color.id === 'bianco' ? "text-black" : "text-white")} />
                    )}
                    {itemsInColor > 0 && !isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white ring-2 ring-white">
                            {itemsInColor}
                        </span>
                    )}
                </button>
                );
            })}
            </div>
        </div>



        {/* Quantity Input */}
        {enableVariants ? (
            <SizeMatrix 
                sizes={SHIRT_SIZES}
                quantities={getCurrentViewQuantities()}
                onQuantityChange={onQuantityChange}
                visible={!!selectedColor}
                title={`Taglie ${activeGender} (${selectedColor ? SHIRT_COLORS.find(c => c.id === selectedColor)?.label : 'Seleziona colore'})`}
            />
        ) : (
            <SingleSizeSelector 
                quantity={singleQuantity}
                onQuantityChange={setSingleQuantity}
                visible={!!selectedColor}
            />
        )}

        {/* Print Options */}
        <PrintOptionSelector 
            frontValue={frontPrint}
            backValue={backPrint}
            onFrontChange={setFrontPrint}
            onBackChange={setBackPrint}
        />

        {/* Extras */}
        <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <label htmlFor="file-check" className="flex items-start gap-3 cursor-pointer">
            <input 
                id="file-check"
                type="checkbox" 
                checked={fileCheck}
                onChange={(e) => setFileCheck(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div className="text-sm">
                <span className="font-bold text-indigo-900 block">Verifica File Professionale (+€10.00)</span>
                <span className="text-indigo-700">Controllo da esperto: risoluzione, tracciati e setup colori.</span>
            </div>
            </label>
        </div>

        <div className="mt-auto pt-6">
             {/* Price Display */}
             <div className="flex justify-between items-center mb-6">
                 <div>
                   <p className="text-sm text-gray-500">Totale stimato</p>
                   {/* Prevent Hydration Mismatch with Client Only rendering for price */}
                   <p className="text-3xl font-bold text-indigo-600">{formatCurrency(price.totalPrice)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-gray-500">Cad.</p>
                    <p className="font-semibold text-gray-700">{formatCurrency(price.unitPrice)}</p>
                 </div>
              </div>

              <button 
                onClick={onNext}
                disabled={totalQuantity === 0}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procedi all'Ordine
                <ArrowRightIcon className="w-5 h-5" />
              </button>
        </div>
    </div>
  );
}