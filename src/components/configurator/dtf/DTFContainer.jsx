'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StepNavigation from '../shared/StepNavigation';
import DTFConfigStep from './DTFConfigStep';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Uploader...</p>,
  ssr: false
});

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function DTFContainer({ product }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  
  // Configuration State
  const [config, setConfig] = useState({
    format: 'a3',
    quantity: 1,
    isFullService: false,
    isFlashOrder: false,
    width: 0,
    height: 0,
    price: null
  });

  // Files State
  const [files, setFiles] = useState([]);
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Revisione' },
    { id: 3, label: orderId ? 'Upload File' : 'Riepilogo' }
  ];

  const handleConfigUpdate = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleFilesChange = (newFiles) => {
    // Enforce max 2 files
    if (newFiles.length > 2) {
        alert("Puoi caricare massimo 2 file per ordine.");
        return;
    }
    setFiles(newFiles);
  };

  const handleStepClick = (step) => {
    if (step === 3 && !orderId) return; // Prevent jump to upload if not confirmed
    if (step < currentStep || orderId) {
      setCurrentStep(step);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
        if (!config.price) throw new Error("Prezzo non calcolato");
        
        const payload = {
            productId: product?.id || 0,
            quantity: config.quantity, 
            meta: {
                totalMeters: config.price.details.totalMeters,
                format: config.format,
                extras: {
                    fullService: config.isFullService,
                    flashOrder: config.isFlashOrder
                }
            }
        };

        // Simulate API
        // In real app use fetch('/api/checkout/create-session', ...)
        await new Promise(r => setTimeout(r, 1500));
        
        // Mock Success
        const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
        setOrderId(newOrderId);
        setCurrentStep(3); // Advance/Refresh to Upload View
        
        // alert(`Ordine ${newOrderId} creato! Procedi con l'upload.`);

    } catch (error) {
        console.error("Checkout error:", error);
        alert("Errore durante il checkout");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-2xl min-h-[700px] w-full">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={handleStepClick}
        isStepCompleted={!!orderId} 
      />
      
      <div className="mt-8 flex-grow">
        {currentStep === 1 && (
            <div>
                <DTFConfigStep 
                    initialConfig={config}
                    onUpdate={handleConfigUpdate}
                />
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Procedi &rarr;
                    </button>
                </div>
            </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Prepara i tuoi file</h3>
                
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <h4 className="font-bold text-indigo-900 mb-2">Istruzioni per l'upload</h4>
                    <p className="text-indigo-800 text-sm mb-4">
                        Per garantire la massima qualità di stampa, caricherai i tuoi file nel prossimo step, 
                        <strong> dopo aver confermato l'ordine</strong>.
                    </p>
                    <ul className="list-disc list-inside text-indigo-700 text-sm space-y-1">
                        <li>Formati accettati: <strong>PDF, AI, EPS, SVG, TIFF, PNG</strong></li>
                        <li>Risoluzione consigliata: <strong>300 DPI</strong></li>
                        <li>Sfondo: <strong>Trasparente</strong></li>
                        <li>Metodo colore: <strong>CMYK</strong> (convertiamo noi se invii RGB)</li>
                    </ul>
                </div>

                 <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => setCurrentStep(1)}
                        className="text-slate-500 font-medium hover:text-indigo-600 transition-colors"
                    >
                        &larr; Torna alla Configurazione
                    </button>
                    <button
                        onClick={() => setCurrentStep(3)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Vai al Riepilogo &rarr;
                    </button>
                </div>
            </div>
        )}

        {currentStep === 3 && !orderId && config.price && (
            <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Riepilogo Ordine DTF</h3>
                
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                        <span className="text-slate-600">Formato</span>
                        <span className="font-bold text-slate-900 uppercase">{config.format} ({config.width || '?'}x{config.height || '?'} cm)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                         <span className="text-slate-600">Quantità Pezzi</span>
                         <span className="font-bold text-slate-900">{config.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                         <span className="text-slate-600">Metri Lineari Totali</span>
                         <span className="font-bold text-slate-900">{config.price.details.totalMeters} mt</span>
                    </div>
                    
                    {config.isFullService && (
                         <div className="flex justify-between items-center text-indigo-600">
                            <span className="font-medium">Opzione: Pensa a tutto DTF Italia</span>
                            <span>+10%</span>
                        </div>
                    )}
                    {config.isFlashOrder && (
                         <div className="flex justify-between items-center text-amber-600">
                            <span className="font-medium">Opzione: Ordine Flash</span>
                            <span>+10%</span>
                        </div>
                    )}
                    
                    <div className="pt-4 flex justify-between items-end">
                        <span className="text-lg font-bold text-slate-800">Totale</span>
                        <span className="text-3xl font-black text-indigo-600">€{config.price.totalPrice?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentStep(2)}
                        className="text-slate-500 font-medium hover:text-indigo-600 transition-colors"
                    >
                        &larr; Indietro
                    </button>
                    
                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2"
                    >
                       {isProcessing ? 'Elaborazione...' : (
                           <>
                             <ShoppingCart size={20} /> Conferma e Paga
                           </>
                       )}
                    </button>
                </div>
            </div>
        )}

        {currentStep === 3 && orderId && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ordine Confermato #{orderId}</h2>
                <p className="text-slate-600 mb-8">Ora carica i tuoi file di stampa per completare l'ordine.</p>
                
                <FileUploader 
                    files={files}
                    onFilesChange={handleFilesChange}
                    maxSize={100 * 1024 * 1024}
                    accept={{ 'image/png': ['.png'], 'application/pdf': ['.pdf'], 'image/tiff': ['.tif', '.tiff'], 'image/svg+xml': ['.svg'], 'application/postscript': ['.ai', '.eps'] }}
                    uploadMode="s3"
                    orderId={orderId}
                />
            </div>
        )}
      </div>
    </div>
  );
}
