'use client';

import React from 'react';
// import Check from 'lucide-react/dist/esm/icons/check'; // REMOVED
import FileUploader from '../shared/FileUploader';

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function UploadStep({
  orderId,
  selectedFile,
  handleFileSelect,
  handleFileRemove,
  handleUploadSubmit,
  isProcessing,
  fileUploaded
}) {
  return (
      <div className="flex-grow flex flex-col text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8"/>
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
}
