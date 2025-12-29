import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Home } from 'lucide-react';

export default function SuccessStep({ 
    orderId, 
    brandColor = 'indigo' 
}) {
    const isRed = brandColor === 'red';
    
    // Theme logic
    const iconWrapperClass = isRed ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600";
    const buttonPrimaryClass = isRed 
        ? "bg-red-600 hover:bg-red-700 shadow-red-200" 
        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200";

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500 py-12">
            
            {/* Success Icon */}
            <div className={cn("w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4", iconWrapperClass)}>
                <Check className="w-12 h-12" strokeWidth={3} />
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Ordine Ricevuto con Successo!</h2>
                <div className="text-slate-500 font-medium text-lg flex flex-col gap-2">
                     <span className="text-sm uppercase tracking-widest text-slate-400">Codice Ordine</span>
                     <span className="font-mono text-4xl font-extrabold text-slate-800 tracking-wider">#{orderId}</span>
                     <span className="text-xs text-slate-400 mt-1">Segna questo codice per qualsiasi richiesta di assistenza.</span>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md w-full mx-auto">
                <p className="text-slate-700 leading-relaxed font-medium">
                    Il tuo ordine è in fase di elaborazione.<br /> 
                    Riceverai a breve un'email di conferma all'indirizzo indicato.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4 justify-center">
                <button
                    onClick={() => window.location.href = '/'}
                    className={cn(
                        "w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1",
                        buttonPrimaryClass
                    )}
                >
                    <Home className="w-5 h-5" />
                    Torna alla Home
                </button>
            </div>
            
        </div>
    );
}
