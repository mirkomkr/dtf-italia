import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import { IS_DEV_MODE } from '@/lib/config';

export default function PaymentActions({ 
    onPaymentSelect, 
    isProcessing, 
    brandColor = 'indigo' 
}) {
    // We keep buttons standardized (Stripe Purple / Paypal Blue) or brand them?
    // Stripe is usually purple-ish. Paypal is Blue.
    // Let's keep official brand colors for payment methods but use `brandColor` for consistent styling context if needed.
    
    return (
        <div className="mt-auto pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Metodo di Pagamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                    onClick={() => onPaymentSelect('stripe')}
                    disabled={isProcessing}
                    className="group py-4 px-4 bg-[#635BFF] hover:bg-[#544de6] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                   <CreditCard className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                   {isProcessing ? 'Elaborazione...' : 'Paga con Carta'}
                </button>
                
                <button 
                    onClick={() => onPaymentSelect('paypal')}
                    disabled={isProcessing}
                    className="group py-4 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                    {/* Simple PayPal Icon SVG */}
                    <svg className="w-5 h-5 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.438-3.158 7.12-6.549 7.12h-1.08c-.44 0-.793.337-.856.773l-.76 4.918c-.108.704-.716 1.232-1.431 1.232H7.076a.641.641 0 0 1-.633-.74l.633-4.062z"/>
                    </svg>
                    PayPal
                </button>
            </div>

            {/* DEV/TEST MODE BUTTONS */}
            {IS_DEV_MODE && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="col-span-full text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center px-2 py-1 bg-amber-100 rounded-md">
                        🛠️ Area Test Attiva
                    </div>
                    <button 
                        onClick={() => onPaymentSelect('dev', false)}
                        disabled={isProcessing}
                        className="py-3 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        Ordine Test (Vai a S3)
                    </button>
                    <button 
                        onClick={() => onPaymentSelect('dev', true)}
                        disabled={isProcessing}
                        className="py-3 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        Ordine Test (Fine Diretta)
                    </button>
                </div>
            )}
        </div>
    );
}
