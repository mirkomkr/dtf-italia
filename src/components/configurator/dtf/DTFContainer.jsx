'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  const handleConfigUpdate = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleOrderSuccess = (newOrderId, meta = {}) => {
    setOrderId(newOrderId);
    if (meta.skipFiles) {
      setIsUploadComplete(true);
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  };

  const steps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Checkout' },
    { id: 3, label: 'Istruzioni File'},
    { id: 4, label: 'Upload' }
  ];

  return (
    <div id="configurator-top" className="relative w-full rounded-3xl p-4 md:p-8 border border-slate-200/50 shadow-2xl overflow-visible bg-white">
      
      {/* Navigazione Step */}
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        onStepClick={(step) => {
            if (step > 2 && !orderId) return;
            if (step < currentStep || orderId) setCurrentStep(step);
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
                <div className="flex justify-end">
                    <button
                        onClick={() => config.price && setCurrentStep(2)}
                        aria-disabled={!config.price}
                        className={cn(
                            "bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-sm",
                            "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                            !config.price 
                                ? "opacity-50 cursor-not-allowed" 
                                : "hover:bg-indigo-700"
                        )}
                    >
                        Procedi al Checkout
                    </button>
                </div>
            </div>
        )}

        {/* STEP 2: CHECKOUT (PRIMA DEL PAGAMENTO) */}
        {currentStep === 2 && !orderId && (
            <UnifiedCheckout 
                type="dtf"
                priceData={config.price}
                productData={{ ...config }}
                brandColor="indigo"
                onSuccess={handleOrderSuccess}
                onBack={() => setCurrentStep(1)}
            />
        )}

        {/* STEP 3: ISTRUZIONI FILE (POST-PAGAMENTO) */}
        {currentStep === 3 && orderId && (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <h3 className="font-bold text-indigo-900 mb-2 uppercase text-sm tracking-wider">Istruzioni File</h3>
                    <p className="text-indigo-800 text-sm mb-4">
                        Il caricamento dei file avviene <strong>dopo il pagamento</strong>.
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-indigo-700 text-xs font-medium">
                        <li>• PDF, PNG, TIFF, AI</li>
                        <li>• Risoluzione 300 DPI</li>
                        <li>• Sfondo Trasparente</li>
                        <li>• Metodo CMYK</li>
                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={() => setCurrentStep(2)} className="text-gray-600 font-bold text-xs uppercase hover:text-indigo-600 transition-colors">
                        Indietro
                    </button>
                    <button onClick={() => setCurrentStep(4)} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm">
                        Vai al caricamento
                    </button>
                </div>
            </div>
        )}

        {/* STEP 4: CARICAMENTO FILE */}
        {currentStep === 4 && orderId && (
            isUploadComplete ? (
                <SuccessStep orderId={orderId} brandColor="indigo" />
            ) : (
                <div className="max-w-3xl mx-auto space-y-8 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 inline-block w-full">
                        <h2 className="text-2xl font-bold text-gray-900">Ordine #{orderId} Confermato!</h2>
                        <p className="text-green-700">Paga completato. Ora carica i tuoi file qui sotto.</p>
                    </div>
                    
                    <FileUploader 
                        files={files}
                        onFilesChange={setFiles}
                        maxSize={100 * 1024 * 1024}
                        accept={{ 'image/*': ['.png', '.tif', '.tiff'], 'application/pdf': ['.pdf'], 'application/postscript': ['.ai', '.eps'], 'image/svg+xml': ['.svg'] }}
                        uploadMode="s3"
                        orderId={orderId}
                        brandColor="indigo"
                        onUploadComplete={() => setIsUploadComplete(true)}
                    />
                </div>
            )
        )}
      </div>
    </div>
  );
}