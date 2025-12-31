'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StepNavigation from '../shared/StepNavigation';
import DTFConfigStep from './DTFConfigStep';
import UnifiedCheckout from '../shared/UnifiedCheckout';
import SuccessStep from '../shared/SuccessStep';
import { ShoppingCart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const FileUploader = dynamic(() => import('../shared/FileUploader'), {
  loading: () => <p className="p-10 text-center text-gray-500">Caricamento Uploader...</p>,
  ssr: false
});

// ... (other dynamic imports remain the same)

export default function DTFContainer({ product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('order_id');

  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null);

  // Recovery Mode Effect
  React.useEffect(() => {
      if (urlOrderId) {
          setOrderId(urlOrderId);
          setCurrentStep(3);
      }
  }, [urlOrderId]);
  
  // Configuration State
  const [config, setConfig] = useState({
    format: null,
    quantity: 0,
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
    { id: 2, label: 'Checkout' },
    { id: 3, label: 'Upload' }
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
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    // Prevent scroll on initial render
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    const timer = setTimeout(() => {
        const topElement = document.getElementById('configurator-top');
        if (topElement) {
            // Calculate absolute position relative to document
            const elementPosition = topElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - 40; // Keeping -40 offset from before? Reference Serigrafia used -20.
            // DTFContainer had -40 in previous edit (Step 808). Serigrafia had -20.
            // I should probably stick to -40 for DTF if that was the last specific edit for it, or standardize to -20.
            // User prompt for Serigrafia said -20.
            // I will use -40 for DTF as established, or maybe -20 to be consistent. 
            // Let's use -40 as it was the last specific tuning for DTF.
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 150);

    return () => clearTimeout(timer);
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
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                    {/* Success Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento ricevuto con successo!</h2>
                        <p className="text-green-800 font-medium">L'ordine #{orderId} è stato creato.</p>
                    </div>

                    {/* CTA / Instruction */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
                        <p className="text-amber-900 font-bold text-lg mb-2">⚠️ Azione Richiesta</p>
                        <p className="text-amber-800">
                            Ora carica il tuo file di stampa qui sotto per avviare la produzione. <br/>
                            <strong>Senza il file non potremo procedere con la stampa.</strong>
                        </p>
                    </div>
                    
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
