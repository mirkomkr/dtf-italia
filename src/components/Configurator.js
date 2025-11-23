'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { STANDARD_SIZES, calculatePrice, formatCurrency } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Upload, AlertCircle, Check, ArrowRight, CreditCard, FileCheck, ShieldCheck, HardDrive, File, X } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function Configurator() {
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
  
  // Initialize with calculated price to ensure SSR matches Client
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
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: selectedSizeId,
            quantity: quantity,
            price: price.totalPrice,
            fileCheck: fileCheck
          }],
          gateway: gateway,
          customer: formData
        }),
      });
      
      const data = await response.json();
      if (data.session) {
        alert(`Redirecting to ${gateway} checkout... (Session ID: ${data.session.id})`);
        // In a real app: window.location.href = data.session.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Errore durante il checkout. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSizeId, quantity, price.totalPrice, fileCheck, formData]);

  // Re-calculate total price including shipping cost
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
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-lg w-full mx-auto flex flex-col">

      {/* Stepper Header */}
      {/* Stepper Header */}
      <nav className="flex justify-between mb-8 border-b border-gray-100 pb-4 flex-shrink-0" role="navigation" aria-label="Passi di Configurazione Prodotto">
        <ol className="flex justify-between w-full m-0 p-0 list-none">
          {[1, 2, 3].map((step) => {
            const isClickable = step < currentStep || isInitialSetupComplete || step === currentStep;
            const isActive = currentStep === step;
            
            return (
              <li key={step}>
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex flex-col items-center bg-transparent border-none p-0 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2",
                    isClickable ? "cursor-pointer hover:opacity-75" : "cursor-default"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep >= step ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                  )} aria-hidden="true">
                    {step}
                  </div>
                  <span className={cn(
                    "text-xs mt-1",
                    isActive ? "text-indigo-700 font-bold" : "text-gray-500"
                  )}>
                    {step === 1 ? 'Configura' : step === 2 ? 'Upload' : 'Checkout'}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Scrollable Content Area */}
      <div className="h-[650px] overflow-y-auto px-1 custom-scrollbar flex flex-col">
        {/* Step 1: Configuration */}
        {currentStep === 1 && (
          <div className="flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configura la tua Stampa</h2>

            {/* Format Selection */}
            <div className="mb-6">
              <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona Formato
              </label>
              <select
                id="format-select"
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
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
              <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="mb-6">
              <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 mb-2">
                Quantità
              </label>
              <input
                id="quantity-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="1"
              />
            </div>

            {/* File Check Option */}
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
                  <span className="text-indigo-700">Controllo risoluzione, trasparenza e dimensioni da parte del nostro staff.</span>
                </div>
              </label>
            </div>

            {/* Flash Order Option */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <label htmlFor="flash-order" className="flex items-start gap-3 cursor-pointer">
                <input 
                  id="flash-order"
                  type="checkbox" 
                  checked={flashOrder}
                  onChange={(e) => setFlashOrder(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-bold text-amber-900 block">Ordine Flash 24h (+25%)</span>
                  <span className="text-amber-700">Priorità assoluta di produzione. Spedizione garantita in 24 ore lavorative.</span>
                </div>
              </label>
            </div>

            {/* Nesting Warning */}
            {isSmallFormat && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start" role="alert">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Consiglio Pro:</p>
                  <p>Per formati piccoli come questo, ti consigliamo di acquistare un <strong>formato A3</strong> o <strong>Metro Lineare</strong> e disporre più loghi nello stesso file (nesting). Lascia almeno 0.5cm tra i loghi per facilitare il taglio.</p>
                </div>
              </div>
            )}

            <div className="mt-auto">
              {/* Price Display */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-600">Prezzo stimato</span>
                  <span className="text-3xl font-bold text-indigo-600">{formatCurrency(price.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Prezzo unitario:</span>
                  <span>{formatCurrency(price.unitPrice)}</span>
                </div>
              </div>

              {/* CTA Step 1 */}
              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Procedi al Caricamento File
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="flex-grow flex flex-col text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Carica il tuo File</h2>
            
            <div className="mb-6">
              {/* Local Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                role="button"
                tabIndex={0}
                className="border-2 border-dashed border-indigo-200 rounded-xl p-8 bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center h-64 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Clicca o premi invio per caricare un file"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                  accept=".png,.pdf"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HardDrive className="w-8 h-8 text-indigo-600" aria-hidden="true" />
                </div>
                <p className="text-indigo-900 font-bold text-lg mb-1">Clicca per Caricare</p>
                <p className="text-indigo-600 text-sm mb-2">o trascina il file qui</p>
                <p className="text-xs text-indigo-400">(max 50MB - PNG o PDF)</p>
              </div>
            </div>

            {/* File Status */}
            {(selectedFile || uploadError) && (
              <div className={cn(
                "mb-6 p-4 rounded-lg flex items-center justify-between",
                uploadError ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"
              )} role="status" aria-live="polite">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    uploadError ? "bg-red-100" : "bg-green-100"
                  )}>
                    {uploadError ? <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" /> : <File className="w-5 h-5 text-green-600" aria-hidden="true" />}
                  </div>
                  <div className="text-left">
                    <p className={cn("text-sm font-medium", uploadError ? "text-red-900" : "text-green-900")}>
                      {uploadError ? "Errore Upload" : selectedFile.name}
                    </p>
                    <p className={cn("text-xs", uploadError ? "text-red-600" : "text-green-600")}>
                      {uploadError || `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - Caricato con successo`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={resetFile} 
                  className="p-1 hover:bg-white/50 rounded-full transition-colors"
                  aria-label="Rimuovi file"
                >
                  <X className={cn("w-5 h-5", uploadError ? "text-red-400" : "text-green-400")} aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 text-left mb-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" aria-hidden="true" />
                Note Importanti
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Sfondo <strong>Trasparente</strong> Obbligatorio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Risoluzione Minima <strong>300 DPI</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Formati: <strong>PNG</strong> o <strong>PDF</strong></span>
                </li>
              </ul>
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => setCurrentStep(3)}
                disabled={!fileUploaded}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                aria-disabled={!fileUploaded}
              >
                Procedi al Checkout
              </button>
              <button 
                onClick={() => setCurrentStep(1)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Torna alla configurazione
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Checkout */}
        {currentStep === 3 && (
          <div className="flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
            
            <div className="space-y-4 mb-8 flex-grow">
              {/* Shipping Options */}
              <fieldset className="flex gap-4 mb-4">
                <legend className="sr-only">Opzioni di Spedizione</legend>
                <label className={cn(
                  "flex-1 border rounded-xl p-4 cursor-pointer transition-all",
                  shippingOption === 'shipping' ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600" : "border-gray-200 hover:border-gray-300"
                )}>
                  <input 
                    type="radio" 
                    name="shippingOption" 
                    value="shipping"
                    checked={shippingOption === 'shipping'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", shippingOption === 'shipping' ? "border-indigo-600" : "border-gray-400")}>
                      {shippingOption === 'shipping' && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                    <span className="font-bold text-gray-900">Spedizione</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">Corriere Espresso (24/48h)</p>
                </label>
                
                <label className={cn(
                  "flex-1 border rounded-xl p-4 cursor-pointer transition-all",
                  shippingOption === 'pickup' ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600" : "border-gray-200 hover:border-gray-300"
                )}>
                  <input 
                    type="radio" 
                    name="shippingOption" 
                    value="pickup"
                    checked={shippingOption === 'pickup'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", shippingOption === 'pickup' ? "border-indigo-600" : "border-gray-400")}>
                      {shippingOption === 'pickup' && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                    <span className="font-bold text-gray-900">Ritiro in Sede</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">Gratuito - Via Esempio 123</p>
                </label>
              </fieldset>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="sr-only">Nome</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Nome"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Cognome</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Cognome"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {shippingOption === 'shipping' && (
                <>
                  <div className="relative">
                    <label htmlFor="address" className="sr-only">Indirizzo</label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Indirizzo e Numero Civico"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                    />
                    {addressAutocomplete.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1" role="listbox">
                        {addressAutocomplete.map((addr, index) => (
                          <div 
                            key={index}
                            onClick={() => selectAutocomplete(addr)}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            role="option"
                            aria-selected="false"
                          >
                            {addr}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="city" className="sr-only">Città</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="Città"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="sr-only">CAP</label>
                      <input
                        id="zip"
                        type="text"
                        name="zip"
                        placeholder="CAP"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Riepilogo Ordine</h3>
              <div className="flex justify-between text-sm mb-1 text-gray-600">
                <span>{selectedSize.label} x {quantity}</span>
                <span>{formatCurrency(price.totalPrice - (fileCheck ? 10 : 0))}</span>
              </div>
              {fileCheck && (
                <div className="flex justify-between text-sm mb-1 text-indigo-600">
                  <span>Verifica File</span>
                  <span>€10,00</span>
                </div>
              )}
              <div className="flex justify-between text-sm mb-1 text-gray-600">
                <span>Spedizione ({shippingOption === 'pickup' ? 'Ritiro' : 'Corriere'})</span>
                <span>{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200 text-gray-900">
                <span>Totale</span>
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <button 
                onClick={() => handleCheckout('stripe')}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-[#635BFF] hover:bg-[#544de6] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>Paga con</span>
                <div className="w-24 max-w-full flex items-center justify-center">
                  <img src="/images/logos/Stripe/Stripe_Logo_0_white.svg" alt="Logo Stripe" className="w-20 h-auto" />
                </div>
              </button>
              
              <button 
                onClick={() => handleCheckout('paypal')}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>Paga con</span>
                <div className="w-24 max-w-full flex items-center justify-center">
                  <img src="/images/logos/PayPal/PayPal_Logo_0_white.svg" alt="Logo PayPal" className="w-20 h-auto" />
                </div>
              </button>
            </div>

            <button 
              onClick={() => setCurrentStep(2)}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Torna indietro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}