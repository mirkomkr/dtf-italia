'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Shirt, RefreshCw } from 'lucide-react'; // Added Icons
import { useSearchParams } from 'next/navigation';
import { calculatePrice } from '@/lib/pricing-engine';

// Componenti Shared
import StepNavigation from '../shared/StepNavigation';
import UnifiedCheckout from '../shared/UnifiedCheckout';
import SuccessStep from '../shared/SuccessStep';

// Componente Specifico
import ConfigStep from './ConfigStep';

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
  const [price, setPrice] = useState({ unitPrice: 0, totalPrice: 0 });

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

  const updatePrice = useCallback((q, s, f, b, c) => {
    const qty = getTotalQty(q, s);
    if (qty === 0) {
      setPrice({ unitPrice: 0, totalPrice: 0 });
      return;
    }
    const result = calculatePrice('serigrafia', {
      quantity: qty,
      frontPrint: f,
      backPrint: b,
      fileCheck: c
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
      // We update price here directly or via effect? 
      // Current design calls updatePrice here. 
      // Note: updatePrice uses 'enableVariants', 'singleQuantity', etc. from closure.
      // So dependencies for useCallback must be correct.
      // Actually, updatePrice is in useCallback dependency list, so it's fine.
      updatePrice(newState, singleQuantity, frontPrint, backPrint, fileCheck);
      return newState;
    });
  }, [selectedColor, activeGender, singleQuantity, frontPrint, backPrint, fileCheck, updatePrice]);

  const handleOrderSuccess = (newId, meta = {}) => {
    setOrderId(newId);
    setCurrentStep(4);
  };

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Checkout' },
    { id: 4, label: 'Completato' }
  ];

  return (
    <div id="configurator-top" className="relative w-full rounded-3xl p-4 md:p-8 border border-slate-200/50 shadow-2xl overflow-visible bg-white">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={(s) => {
          if (s > currentStep && s > 1 && !selectedColor) return; // Basic validation
          if (s < currentStep) setCurrentStep(s);
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
            singleQuantity={singleQuantity}
            setSingleQuantity={(val) => {
              const n = val === '' ? '' : Math.max(0, parseInt(val) || 0);
              setSingleQuantity(n);
              updatePrice(quantities, n, frontPrint, backPrint, fileCheck);
            }}
            frontPrint={frontPrint}
            setFrontPrint={(val) => { setFrontPrint(val); updatePrice(quantities, singleQuantity, val, backPrint, fileCheck); }}
            backPrint={backPrint}
            setBackPrint={(val) => { setBackPrint(val); updatePrice(quantities, singleQuantity, frontPrint, val, fileCheck); }}
            
            fileCheck={fileCheck}
            setFileCheck={(val) => { setFileCheck(val); updatePrice(quantities, singleQuantity, frontPrint, backPrint, val); }}
            price={price}
            totalQuantity={totalQuantity}
            onNext={() => setCurrentStep(2)}
            brandColor="red"
          />
        )}

        {/* STEP 2: CARICAMENTO FILE (PRE-PAGAMENTO) */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-900 text-left">
              <h3 className="font-bold mb-2 uppercase text-sm">Caricamento File Serigrafia</h3>
              <p className="text-sm">Carica i file necessari per la tua configurazione. {backPrint !== 'none' ? 'È richiesto un file per il fronte e uno per il retro.' : 'Carica il file per la stampa frontale.'}</p>
            </div>

            <div className={`grid grid-cols-1 ${backPrint !== 'none' ? 'md:grid-cols-2 gap-8' : 'gap-0 max-w-xl mx-auto'}`}>
              
              {/* UPLOAD FRONTE */}
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
                      // Reset key on new file selection to force re-upload if needed? 
                      // FileUploader logic handles upload on select.
                      // We might want to clear key if file changes, but Uploader calls onUploadComplete eventually.
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

              {/* UPLOAD RETRO (Condizionale) */}
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

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <button 
                onClick={() => setCurrentStep(1)} 
                className="text-gray-600 font-bold text-xs uppercase hover:text-red-600 transition-colors"
              >
                Indietro
              </button>
              
              <button
                disabled={!fileKeys.front || (backPrint !== 'none' && !fileKeys.back)}
                onClick={() => setCurrentStep(3)}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-xl transition-all ${
                  (!fileKeys.front || (backPrint !== 'none' && !fileKeys.back))
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 hover:shadow-2xl hover:-translate-y-1'
                }`}
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
            productData={{ quantities, singleQuantity, frontPrint, backPrint, fileCheck, totalQuantity }}
            uploadedFileKey={fileKeys} // Passing object {front, back} instead of string
            brandColor="red"
            onSuccess={handleOrderSuccess}
            onBack={() => setCurrentStep(2)}
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