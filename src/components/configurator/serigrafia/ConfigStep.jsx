'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing-engine';
import { SHIRT_COLORS, SHIRT_SIZES } from './constants';
import dynamic from 'next/dynamic';

// Icone Semplificate
const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

// Import dinamici
const SizeMatrix = dynamic(() => import('../shared/SizeMatrix'), { ssr: false });
const SingleSizeSelector = dynamic(() => import('../shared/SingleSizeSelector'), { ssr: false });
const PrintOptionSelector = dynamic(() => import('../shared/PrintOptionSelector'), { ssr: false });

export default function ConfigStep({
  genderLayout = 'clothing',
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
  onNext,
  brandColor = 'red'
}) {
  
  const getColorTotal = (colorId) => {
      const colorData = quantities[colorId];
      if(!colorData) return 0;
      return Object.values(colorData).reduce((accG, gQty) => 
          accG + Object.values(gQty).reduce((a, b) => a + (parseInt(b) || 0), 0) 
      , 0);
  };

  const getCurrentViewQuantities = () => {
      if(!selectedColor) return {};
      return quantities[selectedColor]?.[activeGender] || {};
  };

  const genderOptions = genderLayout === 'caps' ? ['adulto', 'bambino'] : ['uomo', 'donna', 'bambino'];
  const showGenderSelector = enableVariants && genderLayout !== 'none';

  return (
    <div className="space-y-8">
        {/* Intestazione */}
        <header>
            <h2 className="text-2xl font-bold text-gray-900">Configura il tuo prodotto</h2>
            <p className="text-sm text-gray-500 font-medium">Seleziona i colori e inserisci le quantità desiderate.</p>
        </header>

        {/* 1. Selezione Genere/Modello */}
        {showGenderSelector && (
            <section className="space-y-3" aria-label="Selezione Modello">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. Scegli il Modello</label>
                <div className="grid grid-cols-3 gap-2">
                    {genderOptions.map(gender => (
                        <button
                            key={gender}
                            onClick={() => setActiveGender(gender)}
                            className={cn(
                                "py-3 rounded-xl border-2 font-bold capitalize transition-colors",
                                activeGender === gender 
                                    ? "border-red-600 bg-red-50 text-red-900" 
                                    : "border-gray-100 text-gray-400 hover:bg-gray-50 bg-white"
                            )}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </section>
        )}

        {/* 2. Selezione Colore */}
         <section className="space-y-3" aria-label="Selezione Colore">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Scegli il Colore</label>
            <div className="flex flex-wrap gap-3">
            {SHIRT_COLORS.map((color) => {
                const isSelected = selectedColor === color.id;
                const itemsInColor = getColorTotal(color.id);

                return (
                <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    aria-pressed={isSelected}
                    className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all relative",
                        isSelected 
                            ? "border-red-600 ring-4 ring-red-50" 
                            : "border-gray-200 opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                >
                    {isSelected && (
                        <div className="flex items-center justify-center h-full">
                            <CheckIcon className={color.id === 'bianco' ? "text-black" : "text-white"} />
                        </div>
                    )}
                    {itemsInColor > 0 && !isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-white bg-red-600">
                            {itemsInColor}
                        </span>
                    )}
                </button>
                );
            })}
            </div>
        </section>

        {/* 3. Selezione Quantità */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100" aria-label="Inserimento Quantità">
            {enableVariants && genderLayout === 'clothing' ? (
                <SizeMatrix 
                    brandColor="red"
                    sizes={SHIRT_SIZES}
                    quantities={getCurrentViewQuantities()}
                    onQuantityChange={onQuantityChange}
                    visible={!!selectedColor}
                    title={`Quantità ${activeGender} - ${selectedColor || 'Seleziona colore'}`}
                />
            ) : (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Quantità</label>
                    <SingleSizeSelector 
                        brandColor="red"
                        quantity={genderLayout === 'caps' ? (getCurrentViewQuantities()['UNICA'] || 0) : singleQuantity}
                        onQuantityChange={genderLayout === 'caps' ? (val) => onQuantityChange('UNICA', val) : setSingleQuantity}
                        visible={!!selectedColor}
                    />
                </div>
            )}
        </section>

        {/* 4. Opzioni Stampa */}
        <section aria-label="Configurazione Stampa">
            <PrintOptionSelector 
                brandColor="red"
                frontValue={frontPrint}
                backValue={backPrint}
                onFrontChange={setFrontPrint}
                onBackChange={setBackPrint}
                showBack={genderLayout !== 'caps'}
            />
        </section>

        {/* 5. Extra: Controllo Professionale */}
        <section aria-label="Servizi Extra">
            <div 
                onClick={() => setFileCheck(!fileCheck)}
                className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-4",
                    fileCheck 
                        ? "bg-red-50 border-red-600" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                )}
            >
                <input 
                    type="checkbox" 
                    checked={fileCheck}
                    readOnly
                    className="w-5 h-5 rounded border-gray-300 text-red-600"
                />
                <div className="text-sm">
                    <p className="font-bold text-gray-900">Verifica File Professionale (+€10.00)</p>
                    <p className="text-gray-500">Controllo manuale risoluzione e setup colori.</p>
                </div>
            </div>
        </section>

        {/* Footer: Prezzo e Procedi */}
        <footer className="pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-baseline gap-4" aria-live="polite">
                <span className="text-4xl font-black text-gray-900">
                    {formatCurrency(price.totalPrice)}
                </span>
                <span className="text-sm font-bold text-gray-400 uppercase">
                    {formatCurrency(price.unitPrice)} / cad.
                </span>
             </div>

              <button 
                onClick={onNext}
                disabled={totalQuantity === 0}
                className="py-4 px-10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 uppercase tracking-widest shadow-lg bg-red-600 hover:bg-red-700 shadow-red-100"
              >
                Configura Spedizione
                <ArrowRightIcon />
              </button>
        </footer>
    </div>
  );
}