'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { calculatePrice } from '@/lib/pricing-engine';

// Componenti Shared
import StepNavigation from '../shared/StepNavigation';
import UnifiedCheckout from '../shared/UnifiedCheckout';
import SuccessStep from '../shared/SuccessStep';

// Componenti Specifici DTF
import DTFConfigStep from './DTFConfigStep';

// Uploader caricato dinamicamente (no SSR)
const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-600 italic">Preparazione caricamento...</p>,
  ssr: false
});

export default function DTFContainer({ product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('order_id');

  // --- Stato Principale ---
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFileKey, setUploadedFileKey] = useState(null);

  // --- Stato Configurazione ---
  const [config, setConfig] = useState({
    format: null,
    quantity: 0,
    isFullService: false,
    isFlashOrder: false,
    width: 0,
    height: 0,
    price: null
  });

  // Recovery Mode: se l'URL contiene un order_id, vai direttamente all'upload
  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
      setCurrentStep(3);
    }
  }, [urlOrderId]);

  // --- Handlers ---
  const scrollToTop = () => {
    if (window.innerWidth < 1024) {
      document.getElementById('configurator-top')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleConfigUpdate = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleOrderSuccess = (newOrderId, meta = {}) => {
    setOrderId(newOrderId);
    setCurrentStep(4);
    scrollToTop();
  };

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Checkout' },
    { id: 4, label: 'Completato' }
  ];

  return (
    <div id="configurator-top" className="scroll-mt-32 relative w-full rounded-3xl p-4 md:p-8 border border-slate-200/50 shadow-2xl overflow-visible bg-white">
      
      {/* Navigazione Step */}
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={(step) => {
            if (step > currentStep && step > 1 && !config.price) return;
            if (step < currentStep) {
                setCurrentStep(step);
                scrollToTop();
            }
        }}
        isStepCompleted={!!orderId} 
      />
      
      <div className="mt-8">
        
        {/* STEP 1: CONFIGURAZIONE */}
        {currentStep === 1 && (
            <div className="space-y-6">
                <DTFConfigStep 
                    initialConfig={config}
                    onUpdate={handleConfigUpdate}
                />
                <div className="flex flex-col md:flex-row justify-end pt-6 border-t border-gray-100">
                    <button
                        onClick={() => {
                            if (config.price) {
                                setCurrentStep(2);
                                scrollToTop();
                            }
                        }}
                        aria-disabled={!config.price}
                        className={cn(
                            "w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-sm shadow-lg shadow-indigo-100",
                            "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                            !config.price 
                                ? "opacity-30 cursor-not-allowed" 
                                : "hover:bg-indigo-700"
                        )}
                    >
                        Upload file
                    </button>
                </div>
            </div>
        )}

        {/* STEP 2: CARICAMENTO FILE */}
        {currentStep === 2 && (
            <div className="max-w-3xl mx-auto space-y-8 text-center">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 md:p-6 text-left">
                    <h3 className="font-bold text-indigo-900 mb-2 uppercase text-sm tracking-wider">Caricamento File DTF</h3>
                    <p className="text-indigo-800 text-sm mb-4">
                        Carica il file necessario per la tua stampa.
                    </p>

                    <div className="mt-4 flex items-start gap-2 text-[0.85rem] text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-indigo-200/50">
                        <Info className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
                        <p>
                            La dimensione del file inviato verrà adattata al formato selezionato nell'ordine, mantenendo le proporzioni originali. Per un controllo tecnico della risoluzione, seleziona <strong>'Controllo File'</strong> al checkout.
                            <span className="block mt-1 font-medium text-slate-700 italic">I nostri tecnici sceglieranno sempre la dimensione migliore per la tua stampa.</span>
                        </p>
                    </div>
                </div>
                
                <FileUploader 
                    files={files}
                    onFilesChange={setFiles}
                    maxSize={100 * 1024 * 1024}
                    // accept={{ 'image/*': ['.png', '.tif', '.tiff'], 'application/pdf': ['.pdf'], 'application/postscript': ['.ai', '.eps'], 'image/svg+xml': ['.svg'] }}
                    uploadMode="s3"
                    brandColor="indigo"
                    onUploadComplete={(key) => {
                        setUploadedFileKey(key);
                    }}
                />
                
                {uploadedFileKey && <p className="text-xs text-green-600 font-bold text-center">✅ File Caricato</p>}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                    <button onClick={() => { setCurrentStep(1); scrollToTop(); }} className="order-2 md:order-1 text-gray-600 font-bold text-xs uppercase hover:text-indigo-600 transition-colors">
                        Indietro
                    </button>

                    <button
                        disabled={!uploadedFileKey}
                        onClick={() => setCurrentStep(3)}
                        className={cn(
                            "order-1 md:order-2 w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all uppercase tracking-widest text-sm shadow-lg shadow-indigo-100",
                            "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                            !uploadedFileKey 
                                ? "opacity-30 cursor-not-allowed bg-indigo-600" 
                                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1"
                        )}
                    >
                        Procedi al Checkout
                    </button>
                </div>
            </div>
        )}

        {/* STEP 3: CHECKOUT */}
        {currentStep === 3 && !orderId && (
            <UnifiedCheckout 
                type="dtf"
                priceData={config.price}
                productData={{ ...config }}
                uploadedFileKey={uploadedFileKey}
                brandColor="indigo"
                onSuccess={handleOrderSuccess}
                onBack={() => {
                    setCurrentStep(2);
                    scrollToTop();
                }}
                isProCheck={config.isFullService}
                onToggleProCheck={(val) => {
                    const newConfig = { ...config, isFullService: val };
                    const computed = calculatePrice('dtf', {
                        quantity: config.quantity,
                        format: config.format,
                        width: config.width,
                        height: config.height,
                        isFullService: val,
                        isFlashOrder: config.isFlashOrder
                    });
                    setConfig({ ...newConfig, price: computed });
                }}
                isFlashOrder={config.isFlashOrder}
                onToggleFlashOrder={(val) => {
                    const newConfig = { ...config, isFlashOrder: val };
                    const computed = calculatePrice('dtf', {
                        quantity: config.quantity,
                        format: config.format,
                        width: config.width,
                        height: config.height,
                        isFullService: config.isFullService,
                        isFlashOrder: val
                    });
                    setConfig({ ...newConfig, price: computed });
                }}
            />
        )}

        {/* STEP 4: CARICAMENTO FILE */}
        {currentStep === 4 && orderId && (
            <SuccessStep orderId={orderId} brandColor="indigo" />
        )}
      </div>
    </div>
  );
}