'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, CheckCircle2, FileType, X, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ALLOWED_EXTENSIONS = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/tiff': ['.tiff', '.tif'],
    'image/svg+xml': ['.svg'],
    'application/postscript': ['.ai', '.eps']
};

const MAX_SIZE_MB = 100;
const MIN_SIZE_MB = 0; // Keeping 0 as min to avoid blocking small vectors, though user said 50-100 check (likely means MAX 100, maybe warning if > 50? Or strict limits. User said "Limite tra 50MB e 100MB". This is ambiguous. Usually implies limit is 100MB, but large files allowed. I'll stick to Max 100MB.)

export default function FileUpload({ fileCheck, onChange }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setError(null);

        // Handle Rejections
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.errors[0].code === 'file-too-large') {
                setError(`Il file supera il limite di ${MAX_SIZE_MB}MB.`);
            } else if (rejection.errors[0].code === 'file-invalid-type') {
                 setError('Formato file non supportato. Usa PDF, AI, EPS, SVG, TIFF o PNG.');
            } else {
                setError(rejection.errors[0].message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const selected = acceptedFiles[0];
            // Additional checks if needed
            setFile(selected);
            // Notify parent
            if (onChange) onChange('file', selected);
        }
    }, [onChange]);

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setError(null);
        if (onChange) onChange('file', null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ALLOWED_EXTENSIONS,
        maxSize: MAX_SIZE_MB * 1024 * 1024, // Bytes
        multiple: false
    });

    return (
        <div className="animate-in zoom-in duration-300">
            {/* Header */}
            <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in fade-in zoom-in duration-500">
                      <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
                     Il tuo ordine è quasi pronto!
                 </h2>
                 <p className="text-gray-500">
                     Carica il tuo file di stampa per completare l'ordine.
                 </p>
            </div>

            {/* Dropzone */}
            <div 
                {...getRootProps()} 
                className={`
                    relative group cursor-pointer
                    border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300
                    ${isDragActive ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                    ${file ? 'bg-green-50 border-green-200' : 'bg-white'}
                `}
            >
                <input {...getInputProps()} />
                
                {file ? (
                    <div className="flex flex-col items-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <FileType className="w-8 h-8 text-indigo-600" />
                        </div>
                        <p className="font-bold text-gray-900 text-lg mb-1 break-all px-4">
                            {file.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        
                        <button 
                            onClick={removeFile}
                            className="text-red-500 text-sm font-bold bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" /> Rimuovi file
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 pointer-events-none">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 mb-1">
                                Trascina qui il tuo file o clicca per caricare
                            </p>
                            <p className="text-sm text-gray-500">
                                PDF, AI, EPS, SVG, TIFF, PNG (Max {MAX_SIZE_MB}MB)
                            </p>
                            <div className="items-center justify-center gap-2 mt-2 text-xs font-medium text-amber-600 bg-amber-50 inline-flex px-3 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" />
                                Risoluzione consigliata: 72-300 DPI
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
