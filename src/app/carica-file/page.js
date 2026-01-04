'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FileCheck, AlertTriangle } from 'lucide-react';

const FileUploader = dynamic(() => import('../../components/configurator/shared/FileUploader'), {
  loading: () => <div className="text-center p-8 text-gray-500">Caricamento Uploader...</div>,
  ssr: false
});

function UploadPageContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [files, setFiles] = useState([]);

    if (!orderId) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">ID Ordine Mancante</h2>
                <p className="text-gray-600 max-w-md">
                    Non siamo riusciti a identificare il tuo ordine. Assicurati di aver utilizzato il link corretto ricevuto via email.
                </p>
            </div>
        );
    }

    if (isUploadComplete) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                    <FileCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-green-900 mb-4">File Caricato con Successo!</h2>
                <p className="text-green-700 text-lg max-w-md mb-8">
                    Il tuo ordine <strong>#{orderId}</strong> è ora in lavorazione. <br/>
                    Riceverai una notifica appena la produzione sarà avviata.
                </p>
                <a href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200">
                    Torna alla Home
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Carica i file per l'ordine <span className="text-indigo-600">#{orderId}</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Completa il tuo ordine caricando qui i file di stampa richiesti.
                    Accettiamo PDF, AI, PNG e TIFF ad alta risoluzione.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-6 md:p-10 border border-slate-100">
                {/* Warning Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex gap-4 items-start md:items-center">
                    <div className="p-2 bg-amber-100/50 rounded-lg flex-shrink-0">
                         <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 text-sm md:text-base">Attenzione</h3>
                        <p className="text-amber-800 text-sm md:text-sm mt-1">
                            Assicurati che i file siano pronti per la stampa (300 DPI, Sfondo Trasparente, CMYK).
                        </p>
                    </div>
                </div>

                <FileUploader 
    files={files}
    onFilesChange={setFiles}
    orderId={orderId}
    uploadMode="s3"
    brandColor="indigo"
    onUploadComplete={async (result) => {
    // 1. Identifichiamo la key. 
    // Se 'result' è un array (nuova versione), prendiamo il primo elemento.
    // Se 'result' è una stringa (vecchia versione), usiamo direttamente quella.
    const fileKey = Array.isArray(result) ? (result[0]?.key || result[0]?.s3Key) : result;

    console.log("FileKey individuata per l'ordine:", fileKey);

    if (fileKey && fileKey !== 'uploaded_via_page') {
        try {
            const response = await fetch('/api/order/update-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderId: orderId, 
                    metaData: { 
                        _s3_file_key: fileKey,
                        _file_uploaded_to_s3: 'yes'
                    }
                })
            });

            if (!response.ok) throw new Error("Errore risposta server WordPress");
            
            console.log("Metadati aggiornati con successo su WooCommerce.");
        } catch (err) {
            console.error("Errore critico aggiornamento meta:", err);
        }
    } else {
        console.error("Attenzione: fileKey mancante o errata!", result);
    }
    
    setIsUploadComplete(true);
}}
/>
            </div>
        </div>
    );
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Caricamento...</div>}>
            <UploadPageContent />
        </Suspense>
    );
}
