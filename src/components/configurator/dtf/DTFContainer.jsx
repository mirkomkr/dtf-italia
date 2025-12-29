'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StepNavigation from '../shared/StepNavigation';
import DTFConfigStep from './DTFConfigStep';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UnifiedCheckout = dynamic(() => import('../shared/UnifiedCheckout'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Checkout...</p>,
  ssr: false
});

const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Uploader...</p>,
  ssr: false
});

const SuccessStep = dynamic(() => import('../shared/SuccessStep'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Successo...</p>,
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
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  
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

  const handleOrderSuccess = (newOrderId) => {
    setOrderId(newOrderId);
    // Stay on Step 3 but UnifiedCheckout will unmount because !orderId condition fails?
    // Wait, Step 3 in DTFContainer has: {currentStep === 3 && !orderId && ...} => Checkout
    // {currentStep === 3 && orderId && ...} => Upload
    // So setting orderId triggers the Upload view. Perfecto.
  };

  // Auto-Scroll to Top on Step Change (Instant & Precise)
  React.useEffect(() => {
    setTimeout(() => {
        const topElement = document.getElementById('configurator-top');
        if (topElement) {
            // Calculate absolute position relative to document
            const elementPosition = topElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition + 40;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'instant'
            });
        }
    }, 0);
  }, [currentStep, orderId]);

  return (
    <div id="configurator-top" className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-2xl min-h-[700px] w-full">
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
            <UnifiedCheckout 
                type="dtf"
                priceData={config.price}
                productData={{
                    format: config.format,
                    width: config.width,
                    height: config.height,
                    quantity: config.quantity,
                    isFullService: config.isFullService,
                    isFlashOrder: config.isFlashOrder
                }}
                brandColor="indigo"
                onSuccess={handleOrderSuccess}
                onBack={() => setCurrentStep(2)}
                uploadedFileKey={null} // File upload happens AFTER checkout in this flow
            />
        )}

        {currentStep === 3 && orderId && isUploadComplete ? (
            <SuccessStep orderId={orderId} brandColor="indigo" />
        ) : (
            currentStep === 3 && orderId && (
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
