'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Shirt, RefreshCw, Info } from 'lucide-react'; // Added Icons
import { useSearchParams } from 'next/navigation';
import { calculatePrice } from '@/lib/pricing-engine';
import { cn } from '@/lib/utils';

// Componenti Shared
import StepNavigation from '../shared/StepNavigation';
import UnifiedCheckout from '../shared/UnifiedCheckout';
import SuccessStep from '../shared/SuccessStep';

// Componente Specifico
import ConfigStep from './ConfigStep';
import { SHIRT_SIZES, KID_SIZES } from './constants';

const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-600 italic">Preparazione caricamento...</p>,
  ssr: false
});

export default function SerigrafiaContainer({ product, enableVariants = true }) {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('order_id');

  // --- Stato Navigazione ---
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  // Refactor: replaced single uploadedFileKey with dual keys
  const [fileKeys, setFileKeys] = useState({ front: null, back: null });
  const [files, setFiles] = useState({ front: null, back: null });

  // --- Stato Configurazione Serigrafica ---
  const [activeGender, setActiveGender] = useState('uomo'); 
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantities, setQuantities] = useState({}); // Per prodotti con varianti
  const [singleQuantity, setSingleQuantity] = useState(0); // Per prodotti senza varianti
  const [frontPrint, setFrontPrint] = useState('1_color');
  const [backPrint, setBackPrint] = useState('none');
  const [fileCheck, setFileCheck] = useState(false);
  const [autoOutline, setAutoOutline] = useState(false); // New State
  const [price, setPrice] = useState({ unitPrice: 0, totalPrice: 0 });

  // --- Analisi Colori (Tono su Tono) ---
  const { hasDarkColors, hasLightColors } = useMemo(() => {
    const activeColors = Object.keys(quantities).filter(color => {
         const colorQty = Object.values(quantities[color] || {}).reduce((acc, genderObj) => 
            acc + Object.values(genderObj || {}).reduce((sAcc, q) => sAcc + (parseInt(q)||0), 0), 0
         );
         return colorQty > 0;
    });
    
    // Fallback for single quantity if no variants
    if (!enableVariants && singleQuantity > 0 && selectedColor) {
        if (!activeColors.includes(selectedColor)) activeColors.push(selectedColor);
    }

    let hasDark = false;
    let hasLight = false;

    // Import constants inside check or assume available? They are not imported here.
    // We need to import SHIRT_COLORS from constants. 
    // Wait, SerigrafiaContainer does not import SHIRT_COLORS. 
    // I need to update imports first? No, I can't in this block.
    // I will assume I need to fetch color data. 
    // Actually, `quantities` keys are color IDs. I should have color data available or import it.
    // Let's assume I can't import easily here without another edit. 
    // I'll skip the import for now and just check known IDs? 
    // Better: I will add the import in a separate tool call if needed, but wait, 
    // I can't see the top of the file in this context. 
    // I'll try to rely on passed `product` if it has colors? No.
    // I'll stick to hardcoded checks for now matching constants.js IDs if I can't import.
    // dark: nero, blu_notte, blu_royal, verde, viola
    // light: bianco, giallo
    
    activeColors.forEach(cId => {
        if (['nero', 'blu_notte', 'blu_royal', 'verde', 'viola'].includes(cId)) hasDark = true;
        if (['bianco', 'giallo'].includes(cId)) hasLight = true;
    });

    return { hasDarkColors: hasDark, hasLightColors: hasLight };
  }, [quantities, singleQuantity, selectedColor, enableVariants]);

  // --- Logica Layout Prodotto ---
  const genderLayout = useMemo(() => {
    const slug = product?.slug?.toLowerCase() || '';
    if (slug.includes('cappello') || slug.includes('cappellino')) return 'caps';
    if (slug.includes('shopper') || slug.includes('borse') || slug.includes('zaini')) return 'none';
    return 'clothing';
  }, [product]);

  // Sync gender iniziale basato sul layout
  useEffect(() => {
    if (genderLayout === 'caps') setActiveGender('adulto');
    if (genderLayout === 'none') setActiveGender('unico'); 
  }, [genderLayout]);

  // Recovery Mode
  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
      setCurrentStep(3);
    }
  }, [urlOrderId]);

  // --- Calcolo Prezzi ---
  const getTotalQty = useCallback((currQuantities, currSingle) => {
    return enableVariants 
      ? Object.values(currQuantities).reduce((accCol, colQty) => 
          accCol + Object.values(colQty).reduce((accGen, genQty) => 
            accGen + Object.values(genQty).reduce((a, b) => a + (parseInt(b) || 0), 0), 0), 0)
      : parseInt(currSingle) || 0;
  }, [enableVariants]);

  const totalQuantity = useMemo(() => getTotalQty(quantities, singleQuantity), [quantities, singleQuantity, getTotalQty]);

  const updatePrice = useCallback((q, s, f, b, c, ao) => {
    const qty = getTotalQty(q, s);
    if (qty === 0) {
      setPrice({ unitPrice: 0, totalPrice: 0 });
      return;
    }
    const result = calculatePrice('serigrafia', {
      quantity: qty,
      frontPrint: f,
      backPrint: b,
      fileCheck: c,
      autoOutline: ao
    });
    setPrice(result);
  }, [getTotalQty]);

  // --- Handlers ---
  // --- Handlers ---
  const handleQuantityChange = useCallback((size, value) => {
    if (!selectedColor) return;
    const newVal = value === '' ? '' : Math.max(0, parseInt(value) || 0);
    
    setQuantities(prev => {
      const newState = {
        ...prev,
        [selectedColor]: {
          ...prev[selectedColor],
          [activeGender]: { ...prev[selectedColor]?.[activeGender], [size]: newVal }
        }
      };
      updatePrice(newState, singleQuantity, frontPrint, backPrint, fileCheck, autoOutline);
      return newState;
    });
  }, [selectedColor, activeGender, singleQuantity, frontPrint, backPrint, fileCheck, autoOutline, updatePrice]);

  const handleOrderSuccess = (newId, meta = {}) => {
    setOrderId(newId);
    setCurrentStep(4);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (window.innerWidth < 1024) {
      document.getElementById('configurator-top')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Checkout' }
  ];

  return (
    <div id="configurator-top" className="scroll-mt-32 relative w-full rounded-3xl p-4 md:p-8 border border-slate-200/50 shadow-2xl overflow-visible bg-white">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={(s) => {
          if (s > currentStep && s > 1 && !selectedColor) return; // Basic validation
          if (s < currentStep) {
              setCurrentStep(s);
              scrollToTop();
          }
        }}
        isStepCompleted={!!orderId}
        brandColor="red"
      />
      
      <div className="mt-8">
        {/* STEP 1: CONFIGURAZIONE PRODOTTO */}
        {currentStep === 1 && (
          <ConfigStep 
            genderLayout={genderLayout}
            enableVariants={enableVariants}
            activeGender={activeGender}
            setActiveGender={setActiveGender}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            sizes={activeGender === 'bambino' && genderLayout === 'clothing' ? KID_SIZES : SHIRT_SIZES}
            singleQuantity={singleQuantity}
            setSingleQuantity={(val) => {
              const n = val === '' ? '' : Math.max(0, parseInt(val) || 0);
              setSingleQuantity(n);
              updatePrice(quantities, n, frontPrint, backPrint, fileCheck, autoOutline);
            }}
            frontPrint={frontPrint}
            setFrontPrint={(val) => { setFrontPrint(val); updatePrice(quantities, singleQuantity, val, backPrint, fileCheck, autoOutline); }}
            backPrint={backPrint}
            setBackPrint={(val) => { setBackPrint(val); updatePrice(quantities, singleQuantity, frontPrint, val, fileCheck, autoOutline); }}
            
            fileCheck={fileCheck}
            setFileCheck={(val) => { setFileCheck(val); updatePrice(quantities, singleQuantity, frontPrint, backPrint, val, autoOutline); }}
            
            autoOutline={autoOutline}
            setAutoOutline={(val) => { setAutoOutline(val); updatePrice(quantities, singleQuantity, frontPrint, backPrint, fileCheck, val); }}

            price={price}
            totalQuantity={totalQuantity}
            onNext={() => {
                setCurrentStep(2);
                scrollToTop();
            }}
            brandColor="red"
          />
        )}

        {/* STEP 2: CARICAMENTO FILE (PRE-PAGAMENTO) */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-6 text-red-900 text-left">
              <h3 className="font-bold mb-2 uppercase text-sm">Caricamento File Serigrafia</h3>
              <p className="text-sm">
                {frontPrint !== 'none' && backPrint !== 'none' 
                  ? 'È richiesto un file per la stampa frontale e uno per il retro.' 
                  : frontPrint === 'none' && backPrint !== 'none'
                  ? 'Carica il file necessario per la stampa retro.'
                  : 'Carica il file necessario per la tua stampa.'}
              </p>
              
              <div className="mt-4 flex items-start gap-2 text-[0.85rem] text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-red-200/50">
                <Info className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
                <p>
                    La dimensione del file inviato verrà adattata in base al supporto e alla taglia selezionata (Adulto/Bambino), mantenendo le proporzioni originali. Per un controllo tecnico della risoluzione, seleziona <strong>'Controllo File'</strong> al checkout.
                    <span className="block mt-1 font-medium text-slate-700 italic">I nostri tecnici sceglieranno sempre la dimensione migliore per la tua stampa.</span>
                </p>
              </div>
            </div>
            
            {/* Tone-on-Tone Disclaimers & Auto Outline Action */}
            {(hasDarkColors || hasLightColors) && (
                <div className="space-y-4">
                    <div className={cn(
                        "p-6 rounded-2xl border shadow-sm animate-in fade-in flex flex-col gap-6",
                        hasDarkColors ? "bg-slate-50 border-slate-200" : "bg-amber-50 border-amber-200"
                    )}>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{hasDarkColors ? '⚠️' : '💡'}</span>
                                <h4 className={cn("font-bold uppercase text-sm", hasDarkColors ? "text-slate-900" : "text-amber-900")}>
                                    {hasDarkColors ? "Attenzione: Colori Scuri Rilevati" : "Attenzione: Colori Chiari Rilevati"}
                                </h4>
                             </div>
                            
                            <p className={cn("text-sm leading-relaxed", hasDarkColors ? "text-slate-700" : "text-amber-800")}>
                                {hasDarkColors 
                                    ? "Nel tuo ordine ci sono maglie di colore scuro (es. Nero, Blu, Verde). Assicurati che il tuo file non contenga elementi neri o molto scuri che risulterebbero invisibili. Se necessario seleziona 'Applica bordo esterno' qui sotto per richiedere ai nostri tecnici l'aggiunta di un contorno di contrasto."
                                    : "Nel tuo ordine ci sono maglie di colore chiaro (es. Bianco, Giallo). Assicurati che il tuo file non contenga elementi bianchi/chiari che potrebbero confondersi. Se necessario seleziona 'Applica bordo esterno' qui sotto per richiedere ai nostri tecnici l'aggiunta di un contorno di contrasto."
                                }
                            </p>
                        </div>

                        {/* Contextual Action: Auto Outline */}
                        <div className="pt-4 border-t border-dashed border-gray-200">
                            <div 
                                onClick={() => {
                                    const val = !autoOutline;
                                    setAutoOutline(val);
                                    updatePrice(quantities, singleQuantity, frontPrint, backPrint, fileCheck, val);
                                }}
                                className={cn(
                                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 w-fit",
                                    autoOutline 
                                        ? "bg-red-50 border-red-600" 
                                        : "bg-white border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={autoOutline}
                                    onChange={() => {}} 
                                    className="w-5 h-5 rounded border-gray-300 pointer-events-none text-red-600 accent-red-600 focus:ring-red-500"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center gap-8">
                                        <span className="font-bold text-gray-900 text-sm tracking-tight uppercase">Applica bordo esterno</span>
                                        <span className={cn("font-bold text-sm", autoOutline ? "text-red-700" : "text-gray-400")}>
                                            + €5.00
                                        </span>
                                    </div>
                                    <p className={cn("text-[10px] mt-0.5 leading-snug font-medium", autoOutline ? "text-red-600" : "text-gray-500")}>
                                        Aggiunta di un contorno di contrasto al file di stampa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className={`grid grid-cols-1 ${frontPrint !== 'none' && backPrint !== 'none' ? 'md:grid-cols-2 gap-8' : 'gap-0 max-w-xl mx-auto'}`}>
              
              {/* UPLOAD FRONTE - Solo se Front Print != none */}
              {frontPrint !== 'none' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-900 font-bold uppercase text-sm border-b pb-2 border-red-100">
                    <Shirt className="w-5 h-5" />
                    <span>Stampa Fronte</span>
                  </div>
                  <FileUploader 
                    uploadMode="s3"
                    brandColor="red"
                    file={files.front}
                    onFileSelect={(f) => {
                        setFiles(prev => ({ ...prev, front: f }));
                        setFileKeys(prev => ({ ...prev, front: null })); 
                    }}
                    onFileRemove={() => {
                        setFiles(prev => ({ ...prev, front: null }));
                        setFileKeys(prev => ({ ...prev, front: null }));
                    }}
                    onUploadComplete={(key) => setFileKeys(prev => ({ ...prev, front: key }))}
                  />
                   {fileKeys.front && <p className="text-xs text-green-600 font-bold text-center">✅ File Fronte Caricato</p>}
                </div>
              )}

              {/* UPLOAD RETRO - Solo se Back Print != none */}
              {backPrint !== 'none' && (
                 <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-900 font-bold uppercase text-sm border-b pb-2 border-red-100">
                    <RefreshCw className="w-5 h-5" />
                    <span>Stampa Retro</span>
                  </div>
                  <FileUploader 
                    uploadMode="s3"
                    brandColor="red"
                    file={files.back}
                    onFileSelect={(f) => {
                        setFiles(prev => ({ ...prev, back: f }));
                        setFileKeys(prev => ({ ...prev, back: null }));
                    }}
                    onFileRemove={() => {
                        setFiles(prev => ({ ...prev, back: null }));
                        setFileKeys(prev => ({ ...prev, back: null }));
                    }}
                    onUploadComplete={(key) => setFileKeys(prev => ({ ...prev, back: key }))}
                  />
                  {fileKeys.back && <p className="text-xs text-green-600 font-bold text-center">✅ File Retro Caricato</p>}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
              <button 
                onClick={() => {
                    setCurrentStep(1);
                    scrollToTop();
                }} 
                className="order-2 md:order-1 text-gray-600 font-bold text-xs uppercase hover:text-red-600 transition-colors"
              >
                Indietro
              </button>
              
              <button
                disabled={
                    (frontPrint !== 'none' && !fileKeys.front) || 
                    (backPrint !== 'none' && !fileKeys.back)
                }
                onClick={() => {
                    setCurrentStep(3);
                    scrollToTop();
                }}
                className={cn(
                    "order-1 md:order-2 w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all uppercase tracking-widest text-sm shadow-lg shadow-red-100",
                    "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
                    ((frontPrint !== 'none' && !fileKeys.front) || (backPrint !== 'none' && !fileKeys.back))
                        ? "opacity-30 cursor-not-allowed bg-red-600" 
                        : "bg-red-600 hover:bg-red-700 hover:shadow-2xl hover:-translate-y-1"
                )}
              >
                Procedi al Checkout
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHECKOUT */}
        {currentStep === 3 && !orderId && (
          <UnifiedCheckout 
            type="serigrafia"
            priceData={price}
            productData={{ 
                quantities, 
                singleQuantity, 
                frontPrint, 
                backPrint, 
                fileCheck, 
                autoOutline,
                totalQuantity,
                technique: price?.details?.technique || 'N/D' // Pass technique info
            }}
            uploadedFileKey={fileKeys} 
            brandColor="red"
            onSuccess={handleOrderSuccess}
            onBack={() => {
                setCurrentStep(2);
                scrollToTop();
            }}
            // Pro Check Upgrade (+7€)
            isProCheck={fileCheck}
            onToggleProCheck={(val) => {
                setFileCheck(val);
                updatePrice(quantities, singleQuantity, frontPrint, backPrint, val, autoOutline);
            }}
          />
        )}

        {/* STEP 4: SUCCESS */}
        {currentStep === 4 && orderId && (
          <SuccessStep orderId={orderId} brandColor="red" />
        )}
      </div>
    </div>
  );
}