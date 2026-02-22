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
  orderType,
  onOrderTypeChange,
  quantityLimits,
  allowedColors,
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
  frontPosition,
  setFrontPosition,
  backPosition,
  setBackPosition,
  sleevePrints,
  setSleevePrints,
  showSleeves = false,
  price,
  totalQuantity,
  sizes = SHIRT_SIZES,
  onNext,
  brandColor = 'red',
}) {
  
  // Determine if position selection should be enabled
  // Caps and bags don't have specific positioning
  const enablePositions = genderLayout === 'clothing';
  
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
            <p className="text-sm text-gray-500 font-medium">Seleziona il tipo di ordine, i colori e inserisci le quantità desiderate.</p>
        </header>

        {/* 1. Order Type Switch */}
        <section className="space-y-3" aria-label="Tipo Ordine">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">1. Tipo di Ordine</label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Senza Minimo */}
            <button
              onClick={() => onOrderTypeChange('senza_minimo')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                orderType === 'senza_minimo'
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">Senza Minimo</span>
                {orderType === 'senza_minimo' && <CheckIcon className="text-red-600" />}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Da 1 a 10 pezzi<br/>
                Solo bianco e nero
                Lavorazione 24/48H
              </p>
            </button>

            {/* Grandi Ordini */}
            <button
              onClick={() => onOrderTypeChange('grandi_ordini')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                orderType === 'grandi_ordini'
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">Grandi Ordini</span>
                {orderType === 'grandi_ordini' && <CheckIcon className="text-red-600" />}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Da 11 pezzi in su<br/>
                Tutti i colori disponibili
                Lavorazione 7/12 giorni
              </p>
            </button>
          </div>

          {/* Info Message */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
            <span className="text-xl">ℹ️</span>
            <p className="text-blue-800 text-xs font-medium leading-relaxed">
              <strong>Senza Minimo</strong>: ideale per ordini da 1 a 10 pezzi (solo bianco/nero).<br/>
              <strong>Grandi Ordini</strong>: per ordini da 11 pezzi in su (tutti i colori disponibili).
            </p>
          </div>
        </section>

        {/* 2. Selezione Genere/Modello */}
        {showGenderSelector && (
            <section className="space-y-3" aria-label="Selezione Modello">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">2. Scegli il Modello</label>
                <div className="grid grid-cols-3 gap-2">
                    {genderOptions.map(gender => (
                        <button
                            key={gender}
                            onClick={() => setActiveGender(gender)}
                            className={cn(
                                "py-3 rounded-xl border-2 font-bold capitalize transition-colors",
                                activeGender === gender 
                                    ? "border-red-600 bg-red-50 text-red-900" 
                                    : "border-gray-100 text-gray-600 hover:bg-gray-50 bg-white"
                            )}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </section>
        )}

        {/* 3. Selezione Colore */}
         <section className="space-y-3" aria-label="Selezione Colore">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              {showGenderSelector ? '3' : '2'}. Scegli il Colore
            </label>
            <div className="flex flex-wrap gap-3">
            {SHIRT_COLORS
              .filter(color => allowedColors.includes(color.id))
              .map((color) => {
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
            
            {/* Disabled Colors Message */}
            {orderType === 'senza_minimo' && (
              <p className="text-xs text-gray-500 italic">
                Altri colori disponibili con "Grandi Ordini" (11+ pezzi)
              </p>
            )}
        </section>

        {/* 4. Selezione Quantità */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100" aria-label="Inserimento Quantità">
            {enableVariants && genderLayout === 'clothing' ? (
                <SizeMatrix 
                    brandColor="red"
                    sizes={sizes}
                    quantities={getCurrentViewQuantities()}
                    onQuantityChange={onQuantityChange}
                    visible={!!selectedColor}
                    title={`Taglie e Quantità — ${selectedColor ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : 'Seleziona colore'} / ${activeGender}`}
                />
            ) : (
                <div className="space-y-3">
                    <div className="space-y-1 mb-3">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">4. Quantità per Taglia e Colore</label>
                        <p className="text-xs text-gray-500">Seleziona un colore sopra, poi inserisci la quantità per ogni taglia.</p>
                    </div>
                    <SingleSizeSelector 
                        brandColor="red"
                        quantity={
                            (enableVariants && (genderLayout === 'caps' || genderLayout === 'none')) 
                                ? (getCurrentViewQuantities()['UNICA'] || 0) 
                                : singleQuantity
                        }
                        onQuantityChange={
                            (enableVariants && (genderLayout === 'caps' || genderLayout === 'none'))
                                ? (val) => onQuantityChange('UNICA', val) 
                                : setSingleQuantity
                        }
                        visible={!!selectedColor}
                    />
                </div>
            )}
            
        </section>

        {/* 5. Opzioni Stampa */}
        <section aria-label="Configurazione Stampa">
            <PrintOptionSelector 
                brandColor="red"
                frontValue={frontPrint}
                backValue={backPrint}
                onFrontChange={setFrontPrint}
                onBackChange={setBackPrint}
                frontPosition={frontPosition}
                backPosition={backPosition}
                onFrontPositionChange={setFrontPosition}
                onBackPositionChange={setBackPosition}
                enablePositions={enablePositions}
                showBack={genderLayout !== 'caps'}
                sleevePrints={sleevePrints}
                onSleevePrintsChange={setSleevePrints}
                showSleeves={showSleeves}
            />
        </section>



        {/* Footer: Prezzo e Procedi */}
        <footer className="pt-6 border-t border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
             <div className="flex items-baseline gap-4" aria-live="polite">
                <span className="text-4xl font-black text-gray-900">
                    {formatCurrency(price.totalPrice)}
                </span>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-600 uppercase">
                        {formatCurrency(price.unitPrice)} / cad.
                    </span>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                        (IVA incl.)
                    </p>
                </div>
             </div>
             

              <button 
                onClick={() => totalQuantity > 0 && onNext()}
                aria-disabled={totalQuantity === 0}
                className={cn(
                    "bg-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-sm shadow-lg shadow-red-100",
                    "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
                    totalQuantity === 0 
                        ? "opacity-30 cursor-not-allowed" 
                        : "hover:bg-red-700"
                )}
              >
                Upload File
              </button>
        </footer>
    </div>
  );
}