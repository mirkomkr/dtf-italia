'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { calculatePrice, formatCurrency } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Upload, AlertCircle, Check, ArrowRight, CreditCard, FileCheck, ShieldCheck, HardDrive, File, X, Info } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.eps', '.svg', '.tiff', '.png'];

const SHIRT_COLORS = [
  { id: 'nero', label: 'Nero', hex: '#000000' },
  { id: 'bianco', label: 'Bianco', hex: '#ffffff', border: true },
  { id: 'blu_notte', label: 'Blu Notte', hex: '#1e3a8a' }, // midnight-900 approx
  { id: 'blu_royal', label: 'Blu Royal', hex: '#2563eb' }, // blue-600 approx
  { id: 'giallo', label: 'Giallo', hex: '#eab308' }, // yellow-500 approx
  { id: 'verde', label: 'Verde', hex: '#16a34a' }, // green-600 approx
  { id: 'viola', label: 'Viola', hex: '#7c3aed' }, // violet-600 approx
];

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PRINT_OPTIONS = [
  { id: 'none', label: 'Nessuna Stampa', factor: 0 },
  { id: '1_color', label: '1 Colore', factor: 1 },
  { id: '2_colors', label: '2 Colori', factor: 1.5 },
  { id: 'full_color', label: 'Full Color', factor: 2.5 },
];

export default function ConfiguratoreSerigrafia({ product }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);
  
  // Step 1 State
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Quantity Matrix State
  const [sizeQuantities, setSizeQuantities] = useState(() => {
    const initial = {};
    SHIRT_SIZES.forEach(size => initial[size] = 0);
    return initial;
  });

  const [frontPrint, setFrontPrint] = useState(PRINT_OPTIONS[1].id); // 1 Color default
  const [backPrint, setBackPrint] = useState(PRINT_OPTIONS[0].id);   // None default
  
  const [fileCheck, setFileCheck] = useState(false);
  
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
  
  const [price, setPrice] = useState({ unitPrice: 0, totalPrice: 0 });

  // Calculate Total Quantity
  const totalQuantity = SHIRT_SIZES.reduce((acc, size) => acc + (sizeQuantities[size] || 0), 0);

  // Handle Quantity Change for specific size
  const handleQuantityChange = (size, value) => {
    const newVal = Math.max(0, parseInt(value) || 0);
    setSizeQuantities(prev => ({
      ...prev,
      [size]: newVal
    }));
  };

  // Custom Pricing Logic for Serigraphy
  useEffect(() => {
    if (totalQuantity === 0) {
      setPrice({ unitPrice: 0, totalPrice: 0 });
      return;
    }

    // Base Shirt Price
    let baseUnitCost = 5.00; 

    // Print Costs
    const frontOption = PRINT_OPTIONS.find(o => o.id === frontPrint) || PRINT_OPTIONS[0];
    const backOption = PRINT_OPTIONS.find(o => o.id === backPrint) || PRINT_OPTIONS[0];

    // Example calc: Base + (FrontFactor * 2) + (BackFactor * 2)
    // Reduce unit price as quantity increases (simple volume discount logic)
    const quantityDiscount = Math.max(0, Math.min(0.5, (totalQuantity - 10) * 0.01)); // max 50% discount logic
    
    let printCost = (frontOption.factor * 3.00) + (backOption.factor * 3.00);
    let unitTotal = (baseUnitCost + printCost) * (1 - quantityDiscount);

    if (unitTotal < 1) unitTotal = 1;

    let total = unitTotal * totalQuantity;

    if (fileCheck) {
      total += 10.00;
    }

    setPrice({
      unitPrice: unitTotal,
      totalPrice: total
    });

  }, [selectedColor, sizeQuantities, totalQuantity, frontPrint, backPrint, fileCheck]);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Extension Validation
    const fileName = file.name.toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    
    if (!isValidExt) {
      setUploadError('Formato non valido. Accettiamo: PDF, AI, EPS, SVG, TIFF, PNG.');
      setSelectedFile(null);
      setFileUploaded(false);
      return;
    }

    // Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`Il file è troppo grande. Limite: 50MB.`);
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
      setShippingCost(7.50);
    }
  }, [shippingOption]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
      
      const colorLabel = SHIRT_COLORS.find(c => c.id === selectedColor)?.label || selectedColor;
      payload.append('color', colorLabel);
      
      payload.append('sizes', JSON.stringify(sizeQuantities));
      
      const frontLabel = PRINT_OPTIONS.find(o => o.id === frontPrint)?.label || frontPrint;
      const backLabel = PRINT_OPTIONS.find(o => o.id === backPrint)?.label || backPrint;
      
      payload.append('frontPrint', frontLabel);
      payload.append('backPrint', backLabel);
      payload.append('fileCheck', fileCheck);
      
      payload.append('unitPrice', price.unitPrice);
      payload.append('totalPrice', price.totalPrice + shippingCost);
      payload.append('shippingCost', shippingCost);
      payload.append('totalQuantity', totalQuantity);

      if (product && product.id) {
        payload.append('productId', product.id);
      }

      if (selectedFile) {
        payload.append('file', selectedFile);
      }

      const response = await fetch('/api/order/serigrafia', {
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
  }, [price, shippingCost, formData, shippingOption, selectedColor, sizeQuantities, frontPrint, backPrint, fileCheck, selectedFile, totalQuantity, product]);

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

      {/* Stepper Header */}
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
              <h2 className="text-2xl font-bold text-gray-900">Serigrafia Premium</h2>
              <p className="text-sm text-gray-500">Configura le tue t-shirt personalizzate</p>
            </div>

            {/* Colors Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Colore T-Shirt</label>
              <div className="flex flex-wrap gap-3">
                {SHIRT_COLORS.map((color) => {
                  const isSelected = selectedColor === color.id;
                  const isDimmed = selectedColor !== null && !isSelected;
                  
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-sm flex items-center justify-center relative group",
                        
                        // Active State (Selected)
                        isSelected && "border-indigo-600 ring-4 ring-indigo-100 scale-125 z-10 opacity-100",
                        
                        // Dimmed State (Other colors when one is selected)
                        isDimmed && "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110",
                        
                        // Initial State (No selection)
                        selectedColor === null && "border-transparent hover:scale-110 scale-100 opacity-100",

                        color.border && !isSelected ? "border-gray-200" : ""
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                      aria-label={`Seleziona colore ${color.label}`}
                    >
                      {isSelected && (
                          <Check className={cn("w-5 h-5", color.id === 'bianco' ? "text-black" : "text-white")} />
                      )}
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {color.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Matrix Grid - Shown only after color selection */}
            <div className={cn(
              "transition-all duration-500 overflow-hidden",
              selectedColor ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Seleziona Taglie e Quantità <span className="font-normal text-indigo-600">({selectedColor ? SHIRT_COLORS.find(c => c.id === selectedColor)?.label : ''})</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {SHIRT_SIZES.map((size) => (
                  <div key={size} className="flex flex-col gap-1">
                    <label htmlFor={`qty-${size}`} className="text-xs font-bold text-gray-500 uppercase text-center">{size}</label>
                    <input
                      id={`qty-${size}`}
                      type="number"
                      min="0"
                      value={sizeQuantities[size] > 0 ? sizeQuantities[size] : ''}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      placeholder="0"
                      className={cn(
                        "w-full p-2 text-center border rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium transition-colors",
                        sizeQuantities[size] > 0 ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    />
                  </div>
                ))}
              </div>
              <p className="text-right text-xs text-gray-500 mt-2">
                Totale Capi: <strong className="text-indigo-600">{totalQuantity}</strong>
              </p>
            </div>

            {/* Printing Options */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="front-print" className="block text-sm font-semibold text-gray-700 mb-2">
                       Stampa Fronte <span className="text-xs font-normal text-gray-500">(Max 28x38cm)</span>
                    </label>
                    <select
                      id="front-print"
                      value={frontPrint}
                      onChange={(e) => setFrontPrint(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {PRINT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                 </div>
                 <div>
                    <label htmlFor="back-print" className="block text-sm font-semibold text-gray-700 mb-2">
                       Stampa Retro <span className="text-xs font-normal text-gray-500">(Max 28x38cm)</span>
                    </label>
                    <select
                      id="back-print"
                      value={backPrint}
                      onChange={(e) => setBackPrint(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {PRINT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                 </div>
               </div>
            </div>

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

            {/* Pro Tip */}
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg flex gap-3 items-start">
              <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-800">
                <p className="font-bold mb-1">Consiglio Pro:</p>
                <p>Per risultati ottimali in serigrafia, assicurati di convertire tutti i testi nel file vettoriale in <strong>tracciati/curve</strong>. Questo evita problemi di font mancanti in fase di stampa.</p>
              </div>
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
                Carica il File
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="flex-grow flex flex-col text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carica Grafica</h2>
            <p className="text-gray-500 mb-8">Carica il file per la stampa (Max 50MB)</p>
            
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
                  accept={ALLOWED_EXTENSIONS.join(',')}
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
                          PDF, AI, EPS, SVG, TIFF, PNG
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
                Requisiti Tecnici
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Risoluzione: <strong>72 DPI</strong> Minimo - <strong>300 DPI</strong> Consigliato</span>
                </li>
                 <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Colori: <strong>CMYK</strong> per fedeltà cromatica</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Formati Vettoriali (.ai, .eps, .pdf) preferiti per la serigrafia</span>
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
                Modifica Configurazione
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
                  <div className="flex justify-between items-start mb-2">
                     <div className="w-full">
                        <div className="flex justify-between items-start">
                           <p className="font-bold text-indigo-900">T-Shirt Serigrafia</p>
                           <span className="font-bold text-indigo-900">x{totalQuantity}</span>
                        </div>
                        <p className="text-sm text-indigo-700 mt-1">Colore: <span className="capitalize font-semibold">{selectedColor.replace('_', ' ')}</span></p>
                        
                        {/* Size Breakdown */}
                        <div className="flex flex-wrap gap-2 mt-2">
                           {Object.entries(sizeQuantities).map(([size, qty]) => {
                             if(qty > 0) return (
                               <span key={size} className="text-xs bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-100 font-medium">
                                 {qty}x <strong>{size}</strong>
                               </span>
                             );
                             return null;
                           })}
                        </div>
                        
                        <p className="text-xs text-indigo-600 mt-2 pt-2 border-t border-indigo-200/50">Stampa: {PRINT_OPTIONS.find(p=>p.id===frontPrint)?.label} (F), {PRINT_OPTIONS.find(p=>p.id===backPrint)?.label} (R)</p>
                     </div>
                  </div>
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
                <span className="font-bold text-indigo-600 text-xl">{formatCurrency(price.totalPrice + shippingCost)}</span>
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