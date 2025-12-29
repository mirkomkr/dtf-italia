import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Check, Home, Package } from 'lucide-react';

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
    const buttonSecondaryClass = isRed
        ? "text-red-600 bg-red-50 hover:bg-red-100 border-red-100"
        : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-100";

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500 py-12">
            
            {/* Success Icon */}
            <div className={cn("w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4", iconWrapperClass)}>
                <Check className="w-12 h-12" strokeWidth={3} />
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Ordine Ricevuto!</h2>
                <div className="text-slate-500 font-medium text-lg">
                    ID Ordine: <span className="font-mono font-bold text-slate-800 tracking-wider">#{orderId}</span>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md w-full mx-auto">
                <p className="text-slate-700 leading-relaxed">
                    I tuoi file sono stati caricati correttamente. <br/>
                    Riceverai a breve una mail di conferma con il riepilogo e i dettagli per la spedizione o il ritiro.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                <Link 
                    href="/" 
                    className={cn(
                        "flex-1 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                        buttonPrimaryClass
                    )}
                >
                    <Home className="w-5 h-5" />
                    Torna alla Home
                </Link>
                
                <Link 
                    href="/account/orders" // Placeholder link
                    className={cn(
                        "flex-1 py-4 px-6 rounded-xl font-bold border transition-all flex items-center justify-center gap-2",
                        buttonSecondaryClass
                    )}
                >
                    <Package className="w-5 h-5" />
                    I Miei Ordini
                </Link>
            </div>
            
        </div>
    );
}
