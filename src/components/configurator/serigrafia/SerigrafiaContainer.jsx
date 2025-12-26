'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { calculatePrice } from '@/lib/pricing-engine';
import StepNavigation from '../shared/StepNavigation';
import ConfigStep from './ConfigStep';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy steps
const CheckoutStep = dynamic(() => import('./CheckoutStep'), {
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  
  // --- Step 2 (Data) State ---
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', zip: ''
  });
  const [shippingOption, setShippingOption] = useState('shipping');
  const [shippingCost, setShippingCost] = useState(0);

  // --- Pricing State ---
  const [price, setPrice] = useState({ unitPrice: 0, totalPrice: 0 });

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

  const handleFileSelect = (file) => {
      setSelectedFile(file);
      setFileUploaded(true);
  };

  const handleFileRemove = () => {
      setSelectedFile(null);
      setFileUploaded(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Effects ---
  // Replaced by direct calls in handlers.
  // Shipping cost effect is light enough to stay or can be moved to shipping selector on change.
  // For strictness, let's keep it but it's very cheap.
  React.useEffect(() => {
    setShippingCost(shippingOption === 'pickup' ? 0 : 7.50);
  }, [shippingOption]);


  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (gateway) => {
    setIsProcessing(true);
    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('email', formData.email);
      if(shippingOption === 'shipping') {
         payload.append('address', formData.address);
         payload.append('city', formData.city);
         payload.append('zip', formData.zip);
      }
      payload.append('shippingOption', shippingOption);
      
      if (enableVariants) {
          payload.append('detailedQuantities', JSON.stringify(quantities));
      } else {
          payload.append('quantity', singleQuantity);
      }
      
      const frontLabel = frontPrint === 'none' ? 'Nessuna' : (frontPrint === '1_color' ? '1 Colore' : (frontPrint === '2_colors' ? '2 Colori' : 'Full Color'));
      const backLabel = backPrint === 'none' ? 'Nessuna' : (backPrint === '1_color' ? '1 Colore' : (backPrint === '2_colors' ? '2 Colori' : 'Full Color'));
      
      payload.append('frontPrint', frontLabel);
      payload.append('backPrint', backLabel);
      payload.append('fileCheck', fileCheck);
      
      payload.append('unitPrice', price.unitPrice);
      payload.append('totalPrice', price.totalPrice + shippingCost);
      payload.append('shippingCost', shippingCost);
      payload.append('totalQuantity', totalQuantity);
      payload.append('paymentMethod', gateway);

      if (product && product.id) {
        payload.append('productId', product.id);
      }

      const response = await fetch('/api/order/serigrafia', {
        method: 'POST',
        body: payload
      });
      
      const data = await response.json();
      
      if (data.success) {
         setOrderId(data.orderId);
         setCurrentStep(3); 
      } else {
        throw new Error(data.error || 'Errore sconosciuto');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Errore durante il checkout: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadSubmit = async () => {
      if (!selectedFile || !orderId) return;
      setIsProcessing(true);
      try {
          const payload = new FormData();
          payload.append('orderId', orderId);
          payload.append('file', selectedFile);

          const response = await fetch('/api/order/uploadbox', { 
              method: 'POST', 
              body: payload 
          });
          
          if(response.ok) {
              alert("File caricato correttamente! Riceverai una mail di conferma.");
          } else {
              throw new Error("Upload fallito");
          }

      } catch (e) {
          alert(e.message);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-lg w-full mx-auto flex flex-col min-h-[600px]">
        <StepNavigation 
            currentStep={currentStep} 
            steps={[
                {id: 1, label: 'Configura'},
                {id: 2, label: 'Dati & Pagamento'},
                {id: 3, label: 'Upload'},
            ]}
            onStepClick={handleStepClick}
            isStepCompleted={!!orderId}
        />
        
        {currentStep === 1 && (
            <ConfigStep 
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
            <CheckoutStep 
                totalQuantity={totalQuantity}
                price={price}
                shippingCost={shippingCost}
                quantities={quantities}
                enableVariants={enableVariants}
                shippingOption={shippingOption}
                setShippingOption={setShippingOption}
                formData={formData}
                handleInputChange={handleInputChange}
                handleCheckout={handleCheckout}
                isProcessing={isProcessing}
                onBack={() => setCurrentStep(1)}
            />
        )}

        {currentStep === 3 && (
            <UploadStep 
                orderId={orderId}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                handleFileRemove={handleFileRemove}
                handleUploadSubmit={handleUploadSubmit}
                isProcessing={isProcessing}
                fileUploaded={fileUploaded}
            />
        )}
    </div>
  );
}
