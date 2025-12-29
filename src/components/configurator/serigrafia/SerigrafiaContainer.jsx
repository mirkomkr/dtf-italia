'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { calculatePrice } from '@/lib/pricing-engine';
import dynamic from 'next/dynamic';

const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Uploader...</p>,
  ssr: false
});

// Dynamic imports for ALL steps and UI components to minimize initial TBT
const SuccessStep = dynamic(() => import('../shared/SuccessStep'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Successo...</p>,
  ssr: false
});

const StepNavigation = dynamic(() => import('../shared/StepNavigation'), {
  spacing: '0', // No placeholder needed or minimal
  ssr: true // StepNavigation is small and visual, SSR is okay but if heavy, set to false.
            // User requested "Move StepNavigation into dynamic...". 
            // Layout shift might occur if ssr: false. 
            // Given icons are optimized now, SSR true is better for CLS, but if TBT is priority...
            // Let's use ssr: true but with the optimized file.
});

const ConfigStep = dynamic(() => import('./ConfigStep'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-50 rounded-2xl" />,
    ssr: false // Defer heavy config logic
});

const UnifiedCheckout = dynamic(() => import('../shared/UnifiedCheckout'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Checkout...</p>,
  ssr: false
});

const UploadStep = dynamic(() => import('./UploadStep'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Upload...</p>,
  ssr: false
});

export default function SerigrafiaContainer({ product, enableVariants = true }) {
  // Steps: 1=Config, 2=Checkout, 3=Upload (Success)
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null); 
  
  // --- Step 1 State ---
  const [activeGender, setActiveGender] = useState('uomo'); 
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Multi-color & Multi-gender quantities
  const [quantities, setQuantities] = useState({});

  // Single quantity for no-variant products
  const [singleQuantity, setSingleQuantity] = useState(0);

  const [frontPrint, setFrontPrint] = useState('1_color');
  const [backPrint, setBackPrint] = useState('none');
  const [fileCheck, setFileCheck] = useState(false);
  
  // --- Step 3 (Upload) State ---

  


  // Files State
  const [files, setFiles] = useState([]);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  // --- Pricing State ---
  const [price, setPrice] = useState({ unitPrice: 0, totalPrice: 0 });

  // --- Layout Logic ---
  const genderLayout = useMemo(() => {
    const slug = product?.slug?.toLowerCase() || '';
    if (slug.includes('cappello-con-visiera') || slug.includes('cappellino')) return 'caps';
    if (slug.includes('shopper-in-cotone') || slug.includes('borse') || slug.includes('zaini')) return 'none';
    return 'clothing';
  }, [product]);

  // Sync active gender with layout
  React.useEffect(() => {
    if (genderLayout === 'caps') setActiveGender('adulto');
    if (genderLayout === 'none') setActiveGender('unico'); 
  }, [genderLayout]);


  // --- Derived State with Memoization ---
  // Helper to get total qty from current state
  const getTotalQty = useCallback((currentQuantities, currentSingle) => {
      return enableVariants 
      ? Object.values(currentQuantities).reduce((accColor, colorQty) => 
          accColor + Object.values(colorQty).reduce((accGender, genderQty) => 
               accGender + Object.values(genderQty).reduce((a, b) => a + (parseInt(b) || 0), 0)
          , 0)
        , 0)
      : parseInt(currentSingle) || 0;
  }, [enableVariants]);

  // Current Total
  const totalQuantity = useMemo(() => getTotalQty(quantities, singleQuantity), [quantities, singleQuantity, getTotalQty]);


  /**
   * ON-DEMAND Price Recalculation
   * Replaces useEffect to avoid initial render blocking and unnecessary runs.
   */
  const recalculatePrice = useCallback((newQuantities, newSingle, newFront, newBack, newFileCheck) => {
      const qty = getTotalQty(newQuantities, newSingle);
      
      // Optimization: if qty is 0, reset price immediately
      if (qty === 0) {
          setPrice({ unitPrice: 0, totalPrice: 0 });
          return;
      }

      const result = calculatePrice('serigrafia', {
          quantity: qty,
          frontPrint: newFront,
          backPrint: newBack,
          fileCheck: newFileCheck
      });
      setPrice(result);
  }, [getTotalQty]);


  // --- Handlers ---
  const handleQuantityChange = useCallback((size, value) => {
    if (!selectedColor) return;
    const newVal = Math.max(0, parseInt(value) || 0);
    
    // We must update state AND recalculate price
    // Since state update is async, we pass the *future* state to the calculator
    setQuantities(prev => {
        const colorData = prev[selectedColor] || {};
        const genderData = colorData[activeGender] || {};
        
        const newQuantities = {
            ...prev,
            [selectedColor]: {
                ...colorData,
                [activeGender]: {
                    ...genderData,
                    [size]: newVal
                }
            }
        };
        
        // Trigger price recalc with NEW quantities
        recalculatePrice(newQuantities, singleQuantity, frontPrint, backPrint, fileCheck);
        
        return newQuantities;
    });
  }, [selectedColor, activeGender, singleQuantity, frontPrint, backPrint, fileCheck, recalculatePrice]);

  // Wrapper for Single Quantity change (for non-variant products)
  const handleSingleQuantityChange = useCallback((val) => {
      const newVal = parseInt(val) || 0;
      setSingleQuantity(newVal);
      recalculatePrice(quantities, newVal, frontPrint, backPrint, fileCheck);
  }, [quantities, frontPrint, backPrint, fileCheck, recalculatePrice]);

  // Wrappers for Option Changes
  const handleFrontPrintChange = useCallback((val) => {
      setFrontPrint(val);
      recalculatePrice(quantities, singleQuantity, val, backPrint, fileCheck);
  }, [quantities, singleQuantity, backPrint, fileCheck, recalculatePrice]);

  const handleBackPrintChange = useCallback((val) => {
      setBackPrint(val);
      recalculatePrice(quantities, singleQuantity, frontPrint, val, fileCheck);
  }, [quantities, singleQuantity, frontPrint, fileCheck, recalculatePrice]);

  const handleFileCheckChange = useCallback((val) => {
      setFileCheck(val);
      recalculatePrice(quantities, singleQuantity, frontPrint, backPrint, val);
  }, [quantities, singleQuantity, frontPrint, backPrint, recalculatePrice]);


  const handleStepClick = useCallback((step) => {
    if(step === 3 && !orderId) return;
    if (step < currentStep || orderId) {
      setCurrentStep(step);
    }
  }, [currentStep, orderId]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Effects ---
  // Replaced by direct calls in handlers.
  // Shipping cost effect is light enough to stay or can be moved to shipping selector on change.
  // For strictness, let's keep it but it's very cheap.



  const handleOrderSuccess = (newOrderId) => {
    setOrderId(newOrderId);
    setCurrentStep(3);
  };



  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-2xl min-h-[700px] w-full">
        <StepNavigation 
            currentStep={currentStep} 
            steps={[
                {id: 1, label: 'Configura'},
                {id: 2, label: 'Dati & Pagamento'},
                {id: 3, label: 'Upload'},
            ]}
            onStepClick={handleStepClick}
            isStepCompleted={!!orderId}
            brandColor="red"
        />
        
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
                setSingleQuantity={handleSingleQuantityChange}
                frontPrint={frontPrint}
                setFrontPrint={handleFrontPrintChange}
                backPrint={backPrint}
                setBackPrint={handleBackPrintChange}
                fileCheck={fileCheck}
                setFileCheck={handleFileCheckChange}
                price={price}
                totalQuantity={totalQuantity}
                onNext={() => setCurrentStep(2)}
            />
        )}
        
        {currentStep === 2 && (
            <UnifiedCheckout 
                type="serigrafia"
                priceData={price}
                productData={{
                    quantities,
                    singleQuantity,
                    frontPrint,
                    backPrint,
                    fileCheck,
                    totalQuantity
                }}
                brandColor="red"
                onSuccess={handleOrderSuccess}
                onBack={() => setCurrentStep(1)}
                uploadedFileKey={null}
            />
        )}

        {currentStep === 3 && orderId && isUploadComplete ? (
            <SuccessStep orderId={orderId} brandColor="red" />
        ) : (
             currentStep === 3 && orderId && (
                <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Ordine Confermato #{orderId}</h2>
                    <p className="text-slate-600 mb-8">Ora carica i tuoi file di stampa per completare l'ordine.</p>
                    
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
  );
}