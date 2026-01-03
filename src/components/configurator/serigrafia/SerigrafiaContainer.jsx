'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
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
  const [uploadedFileKey, setUploadedFileKey] = useState(null);

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
  const handleQuantityChange = (size, value) => {
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
      updatePrice(newState, singleQuantity, frontPrint, backPrint, fileCheck);
      return newState;
    });
  };

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
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-900 text-left">
              <h3 className="font-bold mb-2 uppercase text-sm">Caricamento File Serigrafia</h3>
              <p className="text-sm mb-4">Carica il tuo file per procedere al checkout. Formati accettati: PDF, AI, EPS, SVG.</p>
            </div>
            <FileUploader 
              uploadMode="s3"
              brandColor="red"
              file={null}
              onUploadComplete={(key) => {
                setUploadedFileKey(key);
                setCurrentStep(3);
              }}
            />
            <div className="flex justify-start">
              <button onClick={() => setCurrentStep(1)} className="text-gray-600 font-bold text-xs uppercase hover:text-red-600 transition-colors">
                Indietro
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
            uploadedFileKey={uploadedFileKey}
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