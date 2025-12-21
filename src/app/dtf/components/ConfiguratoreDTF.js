'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { STANDARD_SIZES, calculatePrice, formatCurrency } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Upload, AlertCircle, Check, ArrowRight, CreditCard, FileCheck, ShieldCheck, HardDrive, File, X, Info } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function Configurator({ product }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);
  
  // Step 1 State
  const [selectedSizeId, setSelectedSizeId] = useState(STANDARD_SIZES[0].id);
  const [customWidth, setCustomWidth] = useState(10);
  const [customHeight, setCustomHeight] = useState(10);
  const [quantity, setQuantity] = useState(10);
  const [fileCheck, setFileCheck] = useState(false);
  const [flashOrder, setFlashOrder] = useState(false);
  
  // Step 2 State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Step 3 State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [shippingOption, setShippingOption] = useState('shipping');
  const [shippingCost, setShippingCost] = useState(0);
  const [addressAutocomplete, setAddressAutocomplete] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize with calculated price
  const [price, setPrice] = useState(() => {
    const size = STANDARD_SIZES[0];
    return calculatePrice(size.width, size.height, 10, false);
  });

  const selectedSize = STANDARD_SIZES.find(s => s.id === selectedSizeId);

  useEffect(() => {
    let width = selectedSize.width;
    let height = selectedSize.height;

    if (selectedSize.isCustom) {
      width = customWidth;
      height = customHeight;
    }

    const calculated = calculatePrice(width, height, quantity, fileCheck);
    
    // Apply Flash Order surcharge (25%)
    if (flashOrder) {
      calculated.totalPrice = calculated.totalPrice * 1.25;
    }
    
    setPrice(calculated);
  }, [selectedSizeId, customWidth, customHeight, quantity, selectedSize, fileCheck, flashOrder]);

  const isSmallFormat = !selectedSize.isCustom && (selectedSize.width <= 10 && selectedSize.height <= 10);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Extension Validation
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.png') && !fileName.endsWith('.pdf')) {
      setUploadError('Formato file non supportato. Accettiamo solo PNG e PDF.');
      setSelectedFile(null);
      setFileUploaded(false);
      return;
    }

    // Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`Il file è di ${(file.size / (1024 * 1024)).toFixed(2)} MB. Il limite è 50MB.`);
      setSelectedFile(null);
      setFileUploaded(false);
      return;
    }

    setSelectedFile(file);
    setFileUploaded(true);
    setUploadError(null);
  }, []);

  const resetFile = () => {
    setSelectedFile(null);
    setFileUploaded(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (shippingOption === 'pickup') {
      setShippingCost(0);
    } else {
      setShippingCost(7.50); // Simulated fixed shipping cost
    }
  }, [shippingOption]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Simulate Address Autocomplete
    if (name === 'address' && value.length > 3) {
      setAddressAutocomplete(['Via Roma 1, Milano', 'Via Roma 10, Roma', 'Via Roma 25, Napoli']);
    } else {
      setAddressAutocomplete([]);
    }
  }, []);

  const selectAutocomplete = (address) => {
    setFormData(prev => ({ ...prev, address: address }));
    setAddressAutocomplete([]);
  };

  const handleCheckout = useCallback(async (gateway) => {
    setIsProcessing(true);
    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('email', formData.email);
      payload.append('address', formData.address);
      payload.append('city', formData.city);
      payload.append('zip', formData.zip);
      payload.append('shippingOption', shippingOption);
      
      const sizeLabel = STANDARD_SIZES.find(s => s.id === selectedSizeId)?.label || selectedSizeId;
      payload.append('sizeLabel', sizeLabel);
      
      if (selectedSize.isCustom) {
        payload.append('customDimensions', `${customWidth}x${customHeight}cm`);
      }
      
      payload.append('quantity', quantity);
      payload.append('fileCheck', fileCheck);
      payload.append('flashOrder', flashOrder);
      
      payload.append('unitPrice', price.unitPrice);
      payload.append('totalPrice', price.totalPrice); // Shipping added in backend if needed? No, sent total
      // Actually backend expects line total. Let's send the goods total as totalPrice, and shipping cost separated.
      // Wait, backend code: total: String(totalPrice). So we should send goods total.
      // Frontent `finalPrice` includes shipping. `price.totalPrice` is just goods. Correct.
      
      payload.append('shippingCost', shippingCost);

      if (product && product.id) {
        payload.append('productId', product.id);
      }

      if (selectedFile) {
        payload.append('file', selectedFile);
      }

      const response = await fetch('/api/order/dtf', {
        method: 'POST',
        body: payload
      });
      
      const data = await response.json();
      
      if (data.success) {
         if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
         } else {
            alert('Ordine creato con successo! ID: ' + data.orderId);
         }
      } else {
        throw new Error(data.error || 'Errore sconosciuto');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Errore durante il checkout: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSizeId, quantity, price.totalPrice, price.unitPrice, fileCheck, formData, shippingOption, shippingCost, customWidth, customHeight, selectedSize, flashOrder, selectedFile, product]);

  const finalPrice = price.totalPrice + shippingCost;

  const handleStepClick = (step) => {
    if (step < currentStep || isInitialSetupComplete) {
      setCurrentStep(step);
    }
  };

  useEffect(() => {
    if (currentStep === 3 && fileUploaded) {
      setIsInitialSetupComplete(true);
    }
  }, [currentStep, fileUploaded]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-lg w-full mx-auto flex flex-col min-h-[600px]">

      {/* Stepper Header (Serigraphy Style) */}
      <nav className="flex justify-between mb-8 border-b border-gray-100 pb-4 flex-shrink-0">
        <ol className="flex justify-between w-full m-0 p-0 list-none">
          {[1, 2, 3].map((step) => {
            const isClickable = step < currentStep || isInitialSetupComplete || step === currentStep;
            const isActive = currentStep === step;
            
            return (
              <li key={step}>
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center bg-transparent border-none p-0 transition-all focus:outline-none",
                    isClickable ? "cursor-pointer hover:opacity-75" : "cursor-default opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    isActive ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-100" : (step < currentStep ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400")
                  )}>
                    {step < currentStep ? <Check className="w-5 h-5"/> : step}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 font-medium",
                    isActive ? "text-indigo-700" : "text-gray-500"
                  )}>
                    {step === 1 ? 'Configura' : step === 2 ? 'Upload' : 'Checkout'}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

        {/* Step 1: Configuration */}
        {currentStep === 1 && (
          <div className="flex-grow flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configura Stampa DTF</h2>
              <p className="text-sm text-gray-500">Scegli il formato e la quantità</p>
            </div>

            {/* Format Selection */}
            <div>
              <label htmlFor="format-select" className="block text-sm font-semibold text-gray-700 mb-2">
                Seleziona Formato
              </label>
              <select
                id="format-select"
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              >
                {STANDARD_SIZES.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label} {size.isCustom ? '' : `- ${size.width}x${size.height}cm`} {size.note ? `(${size.note})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Dimensions */}
            {selectedSize.isCustom && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-width" className="block text-sm font-medium text-gray-700 mb-2">Larghezza (cm)</label>
                  <input
                    id="custom-width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="custom-height" className="block text-sm font-medium text-gray-700 mb-2">Altezza (cm)</label>
                  <input
                    id="custom-height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label htmlFor="quantity-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Quantità
              </label>
              <input
                id="quantity-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold text-lg"
                min="1"
              />
            </div>

            {/* Options Grid */}
            <div className="grid gap-4">
                {/* File Check */}
                <div className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all",
                    fileCheck ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200 hover:border-indigo-200"
                )}>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                        type="checkbox" 
                        checked={fileCheck}
                        onChange={(e) => setFileCheck(e.target.checked)}
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                        <span className="font-bold text-gray-900 block">Verifica File (+€10.00)</span>
                        <span className="text-sm text-gray-500">Controllo professionale risoluzione e dimensioni.</span>
                        </div>
                    </label>
                </div>

                {/* Flash Order */}
                <div className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all",
                    flashOrder ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200 hover:border-amber-200"
                )}>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                        type="checkbox" 
                        checked={flashOrder}
                        onChange={(e) => setFlashOrder(e.target.checked)}
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <div>
                        <span className="font-bold text-gray-900 block flex items-center gap-2">Ordine Flash 24h (+25%) ⚡</span>
                        <span className="text-sm text-gray-500">Priorità assoluta di produzione.</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Nesting Warning */}
            {isSmallFormat && (
               <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg flex gap-3 items-start">
                  <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-sky-800">
                    <p className="font-bold mb-1">Consiglio Pro:</p>
                    <p>Per formati piccoli come questo, considera il <strong>Metro Lineare</strong> per ottimizzare i costi disponendo più loghi nello stesso file.</p>
                  </div>
                </div>
            )}

            <div className="mt-auto pt-6">
              {/* Price Display */}
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

              {/* CTA Step 1 */}
              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Carica File
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="flex-grow flex flex-col text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carica Grafica</h2>
            <p className="text-gray-500 mb-8">Carica il file per la stampa DTF (Max 50MB)</p>
            
            <div className="mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
                role="button"
                tabIndex={0}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center h-64 group outline-none",
                  fileUploaded ? "border-green-300 bg-green-50" : (uploadError ? "border-red-300 bg-red-50" : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50")
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                  accept=".png,.pdf"
                />
                
                {fileUploaded ? (
                   <div className="text-green-600 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <FileCheck className="w-16 h-16 mb-4" />
                      <p className="font-bold text-lg mb-1">{selectedFile?.name}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); resetFile(); }}
                        className="mt-4 px-4 py-2 bg-white text-green-700 text-sm font-bold rounded-full shadow-sm border border-green-200 hover:bg-green-50"
                      >
                        Cambia File
                      </button>
                   </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      {uploadError ? <AlertCircle className="w-8 h-8 text-red-500"/> : <Upload className="w-8 h-8 text-indigo-500"/>}
                    </div>
                    {uploadError ? (
                       <p className="text-red-600 font-medium px-4">{uploadError}</p>
                    ) : (
                      <>
                        <p className="text-indigo-900 font-bold text-lg mb-1">Clicca per caricare</p>
                        <p className="text-indigo-600 text-xs uppercase font-semibold tracking-wide mb-1">
                          PNG o PDF
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 text-left mb-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Specifiche DTF
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Sfondo <strong>Trasparente</strong> (.png)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Risoluzione <strong>300 DPI</strong></span>
                </li>
              </ul>
            </div>
            
            <div className="mt-auto space-y-3">
              <button 
                onClick={() => setCurrentStep(3)}
                disabled={!fileUploaded}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procedi al Checkout
              </button>
              <button 
                onClick={() => setCurrentStep(1)}
                className="block w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2"
              >
                Torna alla configurazione
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Checkout */}
        {currentStep === 3 && (
          <div className="flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completa Ordine</h2>
            
            <div className="space-y-4 mb-8 flex-grow overflow-y-auto px-1 -mx-1">
               {/* Summary Card */}
               <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-6">
                  <div className="flex justify-between items-start mb-2 text-indigo-900">
                     <div>
                        <p className="font-bold">Stampa DTF</p>
                        <p className="text-sm">{selectedSize.label} - {selectedSize.isCustom ? `${customWidth}x${customHeight}cm` : ''}</p>
                     </div>
                     <span className="font-bold">x{quantity}</span>
                  </div>
                  {flashOrder && <p className="text-xs font-bold text-amber-600 mt-1">⚡ Spedizione Flash</p>}
               </div>

              {/* Shipping Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'shipping' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                  <input 
                    type="radio" 
                    name="shippingOption" 
                    value="shipping"
                    checked={shippingOption === 'shipping'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-bold text-gray-900">Spedizione</span>
                  <span className="text-xs text-gray-500">Corriere 24/48h</span>
                </label>
                
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'pickup' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                   <input 
                    type="radio" 
                    name="shippingOption" 
                    value="pickup"
                    checked={shippingOption === 'pickup'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-bold text-gray-900">Ritiro</span>
                  <span className="text-xs text-gray-500">In Sede (Gratis)</span>
                </label>
              </div>
              
              <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nome"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    />
                     <input
                      type="text"
                      name="lastName"
                      placeholder="Cognome"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  />
                  
                  {shippingOption === 'shipping' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                       <input
                          type="text"
                          name="address"
                          placeholder="Indirizzo"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        />
                         <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              name="city"
                              placeholder="Città"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="col-span-2 w-full p-3 border border-gray-300 rounded-lg text-sm"
                            />
                             <input
                              type="text"
                              name="zip"
                              placeholder="CAP"
                              value={formData.zip}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            />
                         </div>
                    </div>
                  )}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-bold text-gray-900">Totale Ordine</span>
                <span className="font-bold text-indigo-600 text-xl">{formatCurrency(finalPrice)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleCheckout('stripe')}
                  disabled={isProcessing}
                  className="py-3 px-4 bg-[#635BFF] hover:bg-[#544de6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                >
                   Carta di Credito
                </button>
                <button 
                  onClick={() => handleCheckout('paypal')}
                  disabled={isProcessing}
                  className="py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                >
                  PayPal
                </button>
              </div>
               <button 
                onClick={() => setCurrentStep(2)}
                className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
              >
                Indietro
              </button>
            </div>
          </div>
        )}

    </div>
  );
}