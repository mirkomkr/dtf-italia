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

  const handleOrderSuccess = (newId) => {
    setOrderId(newId);
    setCurrentStep(3);
  };

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Checkout' },
    { id: 3, label: 'Istruzioni File'},
    { id: 4, label: 'Upload' }
  ];

  return (
    <div id="configurator-top" className="relative w-full rounded-3xl p-4 md:p-8 border border-slate-200/50 shadow-2xl overflow-visible bg-white">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={(s) => {
          if (s > 2 && !orderId) return;
          if (s < currentStep || orderId) setCurrentStep(s);
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

        {/* STEP 2: CHECKOUT */}
        {currentStep === 2 && !orderId && (
          <UnifiedCheckout 
            type="serigrafia"
            priceData={price}
            productData={{ quantities, singleQuantity, frontPrint, backPrint, fileCheck, totalQuantity }}
            brandColor="red"
            onSuccess={handleOrderSuccess}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* STEP 3: ISTRUZIONI FILE (POST-PAGAMENTO) */}
        {currentStep === 3 && orderId && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-900">
              <h3 className="font-bold mb-2 uppercase text-sm">Preparazione File Serigrafia</h3>
              <p className="text-sm mb-4">L'upload avviene dopo la conferma dell'ordine.</p>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium opacity-80">
                <li>• PDF Vettoriale o AI</li>
                <li>• Testi convertiti in tracciati</li>
                <li>• Colori spot (Pantone) consigliati</li>
                <li>• Risoluzione 300 DPI per raster</li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentStep(2)} className="text-gray-600 font-bold text-xs uppercase hover:text-red-600 transition-colors">
                Indietro
              </button>
              <button onClick={() => setCurrentStep(4)} className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm">
                Vai al caricamento
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS & UPLOAD */}
        {currentStep === 4 && orderId && (
          isUploadComplete ? (
            <SuccessStep orderId={orderId} brandColor="red" />
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 text-center">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 w-full">
                <h2 className="text-2xl font-bold text-gray-900">Ordine Serigrafia #{orderId}</h2>
                <p className="text-green-700">Pagamento confermato. Carica i file per la messa in produzione.</p>
              </div>
              <FileUploader 
                orderId={orderId}
                uploadMode="s3"
                brandColor="red"
                files={[]} 
                onUploadComplete={() => setIsUploadComplete(true)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}