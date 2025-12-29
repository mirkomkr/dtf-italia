import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.eps', '.svg', '.tiff', '.png'];

export default function FileUploader({ 
    file, 
    files = [], // Support both single and multiple for backward compatibility
    onFileSelect,
    onFileRemove,
    onFilesChange, 
    maxSize = MAX_FILE_SIZE_BYTES,
    allowedExtensions = ALLOWED_EXTENSIONS,
    uploadMode = 'local', // 'local' | 's3'
    orderId = null
}) {
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({}); // { fileName: percentage }

    // Unified File Handling
    const currentFiles = files.length > 0 ? files : (file ? [file] : []);

    const handleS3Upload = async (fileToUpload) => {
        try {
             if (!orderId) throw new Error("Order ID mancante per upload S3");
             
             setUploadProgress(prev => ({ ...prev, [fileToUpload.name]: 10 }));

             // 1. Get Presigned URL
             const res = await fetch('/api/upload', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ 
                     filename: fileToUpload.name, 
                     contentType: fileToUpload.type,
                     orderId 
                 })
             });

             if (!res.ok) throw new Error("Errore API Upload");

             const { url, key } = await res.json();
             setUploadProgress(prev => ({ ...prev, [fileToUpload.name]: 30 }));

             // 2. Upload to S3
             const uploadRes = await fetch(url, {
                 method: 'PUT',
                 headers: { 'Content-Type': fileToUpload.type },
                 body: fileToUpload
             });

             if (!uploadRes.ok) throw new Error("Errore S3 PUT");

             setUploadProgress(prev => ({ ...prev, [fileToUpload.name]: 100 }));
             return key;

        } catch (error) {
            console.error(error);
            setUploadProgress(prev => ({ ...prev, [fileToUpload.name]: -1 }));
            return null;
        }
    };

    const validateAndSelect = async (selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        
        // Convert FileList to Array
        const fileArray = Array.from(selectedFiles);
        const validFiles = [];

        for(const f of fileArray) {
             const fileName = f.name.toLowerCase();
             const isValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));
             if (!isValidExt) {
                 setUploadError(`Formato non valido: ${f.name}`);
                 continue;
             }
             if (f.size > maxSize) {
                 setUploadError(`File troppo grande: ${f.name}`);
                 continue;
             }
             validFiles.push(f);
        }

        if (validFiles.length === 0) return;

        setUploadError(null);
        
        // Handle Callbacks
        if (onFilesChange) {
            onFilesChange([...currentFiles, ...validFiles]);
        } else if (onFileSelect) {
            onFileSelect(validFiles[0]); // Fallback for single file mode
        }

        // Trigger S3 Upload
        if (uploadMode === 's3' && orderId) {
            for(const f of validFiles) {
                await handleS3Upload(f);
            }
        }
    };

    const handleFileChange = (event) => {
        validateAndSelect(event.target.files);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        validateAndSelect(e.dataTransfer.files);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleReset = (e, fileToRemove) => {
        e.stopPropagation();
        if (onFilesChange) {
            onFilesChange(currentFiles.filter(f => f !== fileToRemove));
        } else if (onFileRemove) {
            onFileRemove();
        }
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="mb-6">
            <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
                role="button"
                tabIndex={0}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[16rem] group outline-none",
                    isDragOver ? "border-indigo-400 bg-indigo-100" : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"
                )}
            >
                <input 
                    type="file" 
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept={allowedExtensions.join(',')}
                />
                
                {currentFiles.length > 0 ? (
                    <div className="w-full space-y-3">
                        {currentFiles.map((f, i) => (
                           <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden w-full">
                                    <FileCheck className="w-8 h-8 text-green-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-grow">
                                        <p className="font-bold text-sm text-gray-800 truncate">{f.name}</p>
                                        
                                        {/* Progress Bar */}
                                        {uploadMode === 's3' && (
                                            <div className="mt-1 w-full">
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-300 ${uploadProgress[f.name] === -1 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.max(5, uploadProgress[f.name] || 0)}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-right mt-0.5 font-bold text-slate-500">
                                                    {uploadProgress[f.name] === 100 ? 'CARICATO' : (uploadProgress[f.name] === -1 ? 'ERRORE' : 'IN CODA...')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={(e) => handleReset(e, f)}
                                        className="text-red-400 hover:text-red-600 font-bold px-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                  <>
                    <div className={cn(
                        "w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm transition-transform",
                        isDragOver ? "scale-110" : "group-hover:scale-110"
                    )}>
                      {uploadError ? <AlertCircle className="w-8 h-8 text-red-500"/> : <Upload className="w-8 h-8 text-indigo-500"/>}
                    </div>
                    {uploadError ? (
                       <p className="text-red-600 font-medium px-4">{uploadError}</p>
                    ) : (
                      <>
                        <p className="text-indigo-900 font-bold text-lg mb-1">{isDragOver ? 'Rilascia i file qui' : 'Clicca per caricare'}</p>
                        <p className="text-indigo-600 text-xs font-medium mb-1">
                          Accettiamo: {allowedExtensions.map(e => e.replace('.', '')).join(', ').toUpperCase()}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          Max 100MB • Risoluzione 72-300 DPI
                        </p>
                      </>
                    )}
                  </>
                )}
            </div>
        </div>
    );
}