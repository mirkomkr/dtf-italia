import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.eps', '.svg', '.tiff', '.png'];

export default function FileUploader({ 
    file, 
    onFileSelect, 
    onFileRemove,
    maxSize = MAX_FILE_SIZE_BYTES,
    allowedExtensions = ALLOWED_EXTENSIONS 
}) {
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const validateAndSelect = (selectedFile) => {
        if (!selectedFile) return;

        // Extension Validation
        const fileName = selectedFile.name.toLowerCase();
        const isValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));
        
        if (!isValidExt) {
            setUploadError(`Formato non valido. Accettiamo: ${allowedExtensions.join(', ')}.`);
            return;
        }

        // Size Validation
        if (selectedFile.size > maxSize) {
            setUploadError(`Il file è troppo grande. Limite: ${Math.round(maxSize/1024/1024)}MB.`);
            return;
        }

        setUploadError(null);
        onFileSelect(selectedFile);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        validateAndSelect(selectedFile);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSelect(droppedFile);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleReset = (e) => {
        e.stopPropagation();
        onFileRemove();
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center h-64 group outline-none",
                    file ? "border-green-300 bg-green-50" : (uploadError ? "border-red-300 bg-red-50" : (isDragOver ? "border-indigo-400 bg-indigo-100" : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"))
                )}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept={allowedExtensions.join(',')}
                />
                
                {file ? (
                   <div className="text-green-600 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <FileCheck className="w-16 h-16 mb-4" />
                      <p className="font-bold text-lg mb-1">{file.name}</p>
                      <button 
                        onClick={handleReset}
                        className="mt-4 px-4 py-2 bg-white text-green-700 text-sm font-bold rounded-full shadow-sm border border-green-200 hover:bg-green-50"
                      >
                        Cambia File
                      </button>
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
                        <p className="text-indigo-900 font-bold text-lg mb-1">{isDragOver ? 'Rilascia il file qui' : 'Clicca per caricare'}</p>
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