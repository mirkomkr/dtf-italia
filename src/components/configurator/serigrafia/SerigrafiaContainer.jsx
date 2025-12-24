'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { calculatePrice, formatCurrency } from '@/lib/pricing-engine';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, Info, ShoppingBag, Trash2 } from 'lucide-react';

// Shared Components
import StepNavigation from '../shared/StepNavigation';
import SizeMatrix from '../shared/SizeMatrix';
import SingleSizeSelector from '../shared/SingleSizeSelector';
import PrintOptionSelector from '../shared/PrintOptionSelector';
import FileUploader from '../shared/FileUploader';

const SHIRT_COLORS = [
  { id: 'nero', label: 'Nero', hex: '#000000' },
  { id: 'bianco', label: 'Bianco', hex: '#ffffff', border: true },
  { id: 'blu_notte', label: 'Blu Notte', hex: '#1e3a8a' },
  { id: 'blu_royal', label: 'Blu Royal', hex: '#2563eb' },
  { id: 'giallo', label: 'Giallo', hex: '#eab308' },
  { id: 'verde', label: 'Verde', hex: '#16a34a' },
  { id: 'viola', label: 'Viola', hex: '#7c3aed' },
];

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function SerigrafiaContainer({ product, enableVariants = true }) {
  // Steps: 1=Config, 2=Checkout, 3=Upload (Success)
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null); 
  
  // --- Step 1 State ---
  const [activeGender, setActiveGender] = useState('uomo'); 
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Multi-color & Multi-gender quantities
  // Structure: { [colorId]: { [gender]: { [size]: qty } } }
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

  // --- Derived State ---
  // Calculate total across all colors, genders, and sizes
  const totalQuantity = enableVariants 
      ? Object.values(quantities).reduce((accColor, colorQty) => 
          accColor + Object.values(colorQty).reduce((accGender, genderQty) => 
               accGender + Object.values(genderQty).reduce((a, b) => a + (parseInt(b) || 0), 0)
          , 0)
        , 0)
      : parseInt(singleQuantity) || 0;

  // --- Handlers ---
  const handleQuantityChange = (size, value) => {
    if (!selectedColor) return;
    const newVal = Math.max(0, parseInt(value) || 0);
    
    setQuantities(prev => {
        const colorData = prev[selectedColor] || {}; // Data for this color
        const genderData = colorData[activeGender] || {}; // Data for this gender
        
        // Return updated deep state
        return {
            ...prev,
            [selectedColor]: {
                ...colorData,
                [activeGender]: {
                    ...genderData,
                    [size]: newVal
                }
            }
        };
    });
  };

  const handleStepClick = (step) => {
    if(step === 3 && !orderId) return;
    if (step < currentStep || orderId) {
      setCurrentStep(step);
    }
  };

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

  // Helper to get quantities for current view (current color + gender)
  const getCurrentViewQuantities = () => {
      if(!selectedColor) return {};
      return quantities[selectedColor]?.[activeGender] || {};
  };

  // Helper to count items per color (for badges)
  const getColorTotal = (colorId) => {
      const colorData = quantities[colorId];
      if(!colorData) return 0;
      // Sum all genders, all sizes
      return Object.values(colorData).reduce((accG, gQty) => 
          accG + Object.values(gQty).reduce((a, b) => a + (parseInt(b) || 0), 0) 
      , 0);
  };

  // --- Effects ---
  useEffect(() => {
    const result = calculatePrice('serigrafia', {
        quantity: totalQuantity,
        frontPrint,
        backPrint,
        fileCheck
    });
    setPrice(result);
  }, [quantities, singleQuantity, totalQuantity, frontPrint, backPrint, fileCheck]);

  useEffect(() => {
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
      
      // Removed single 'gender'/'color' field. Now sending detailed breakdown.
      
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


  // --- Render Steps ---
  const renderStep1 = () => (
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
                        <Check className={cn("w-5 h-5", color.id === 'bianco' ? "text-black" : "text-white")} />
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
                onQuantityChange={handleQuantityChange}
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
             <div className="flex justify-between items-center mb-6">
                 <div>
                   <p className="text-sm text-gray-500">Totale stimato</p>
                   <p className="text-3xl font-bold text-indigo-600">{formatCurrency(price.totalPrice)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-gray-500">Cad.</p>
                    <p className="font-semibold text-gray-700">{formatCurrency(price.unitPrice)}</p>
                 </div>
              </div>

              <button 
                onClick={() => setCurrentStep(2)}
                disabled={totalQuantity === 0}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procedi all'Ordine
                <ArrowRight className="w-5 h-5" />
              </button>
        </div>
    </div>
  );

  const renderStep2 = () => (
      <div className="flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Riepilogo & Dati</h2>
            
            {/* Detailed Summary */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-6 overflow-hidden">
                 <div className="flex justify-between items-center mb-4 border-b border-indigo-200 pb-2">
                     <span className="font-bold text-indigo-900">Totale Ordine ({totalQuantity} pz)</span>
                     <span className="font-bold text-indigo-600 text-lg">{formatCurrency(price.totalPrice + shippingCost)}</span>
                 </div>
                 
                 {enableVariants && (
                     <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {Object.entries(quantities).map(([colorId, genderData]) => {
                             const colorLabel = SHIRT_COLORS.find(c => c.id === colorId)?.label || colorId;
                             // Check if color has any items
                             const colorTotal = Object.values(genderData).reduce((ga, gv) => ga + Object.values(gv).reduce((sa, sv) => sa + (parseInt(sv)||0), 0), 0);
                             if(colorTotal === 0) return null;

                             return (
                                 <div key={colorId} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-sm">
                                     <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                         <span className="w-3 h-3 rounded-full border border-gray-300" style={{background: SHIRT_COLORS.find(c=>c.id===colorId)?.hex}}></span>
                                         {colorLabel} ({colorTotal} pz)
                                     </div>
                                     <div className="pl-5 space-y-1">
                                        {Object.entries(genderData).map(([gender, sizes]) => {
                                             const sizeStr = Object.entries(sizes)
                                                .filter(([_, q]) => q > 0)
                                                .map(([s, q]) => `${q} ${s}`)
                                                .join(', ');
                                             if(!sizeStr) return null;
                                             return (
                                                 <div key={gender} className="text-gray-600 text-xs">
                                                     <span className="capitalize font-semibold">{gender}:</span> {sizeStr}
                                                 </div>
                                             )
                                        })}
                                     </div>
                                 </div>
                             );
                        })}
                     </div>
                 )}
            </div>

            {/* Shipping + Form inputs */}
             <div className="grid grid-cols-2 gap-3 mb-4">
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'shipping' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                  <input type="radio" name="shippingOption" value="shipping" checked={shippingOption === 'shipping'} onChange={(e) => setShippingOption(e.target.value)} className="hidden"/>
                  <span className="font-bold text-gray-900">Spedizione</span>
                </label>
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'pickup' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                   <input type="radio" name="shippingOption" value="pickup" checked={shippingOption === 'pickup'} onChange={(e) => setShippingOption(e.target.value)} className="hidden"/>
                  <span className="font-bold text-gray-900">Ritiro</span>
                </label>
              </div>

               <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="firstName" placeholder="Nome" value={formData.firstName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                    <input type="text" name="lastName" placeholder="Cognome" value={formData.lastName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                  {shippingOption === 'shipping' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <input type="text" name="address" placeholder="Indirizzo" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                        <div className="grid grid-cols-3 gap-3">
                            <input type="text" name="city" placeholder="Città" value={formData.city} onChange={handleInputChange} className="col-span-2 w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                            <input type="text" name="zip" placeholder="CAP" value={formData.zip} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                        </div>
                    </div>
                  )}
               </div>

            {/* Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleCheckout('stripe')}
                        disabled={isProcessing}
                        className="py-3 px-4 bg-[#635BFF] hover:bg-[#544de6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                    >
                        {isProcessing ? '...' : 'Paga con Carta'}
                    </button>
                    <button 
                        onClick={() => handleCheckout('paypal')}
                        disabled={isProcessing}
                        className="py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                    >
                        PayPal
                    </button>
                </div>
                <button onClick={() => setCurrentStep(1)} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">Indietro</button>
            </div>
      </div>
  );

  const renderStep3 = () => (
      <div className="flex-grow flex flex-col text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordine Confermato!</h2>
            <p className="text-gray-500 mb-8">Ordine #{orderId} creato con successo.<br/>Ora carica il tuo file.</p>
            
            <FileUploader 
                file={selectedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
            />

            <div className="mt-auto space-y-3">
              <button 
                onClick={handleUploadSubmit}
                disabled={!fileUploaded || isProcessing}
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Caricamento...' : 'Invia File e Concludi'}
              </button>
            </div>
      </div>
  );

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
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
    </div>
  );
}
