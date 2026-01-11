'use client';

import React, { useState } from 'react';
import { IS_DEV_MODE } from '@/lib/config';
import { cn } from '@/lib/utils';
import OrderSummary from './OrderSummary';
import ShippingSelector from './ShippingSelector';
import CustomerForm from './CustomerForm';
import PaymentActions from './PaymentActions';

export default function UnifiedCheckout({
    type, 
    priceData, 
    productData, 
    brandColor = 'indigo',
    onSuccess, 
    onBack,
    uploadedFileKey = null,
    isProCheck,
    onToggleProCheck,
    isFlashOrder,
    onToggleFlashOrder
}) {
    // --- Stato Locale ---
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: ''
    });
    const [shippingOption, setShippingOption] = useState('shipping');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Costo spedizione semplice
    const shippingCost = shippingOption === 'pickup' ? 0.00 : 7.50; 

    // --- Logica di Pagamento ---
    const handlePayment = async (paymentMethod, skipS3 = false) => {
        // Validazione Base
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert("Per favore, inserisci i dati di contatto.");
            return;
        }
        if (shippingOption === 'shipping' && !formData.address) {
            alert("Per favore, inserisci l'indirizzo di spedizione.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const payload = {
                type,
                customer: formData,
                shipping: { option: shippingOption, cost: shippingCost },
                paymentMethod,
                items: {
                    ...productData,
                    detailedQuantities: productData.quantities 
                },
                uploadedFileKey: skipS3 ? null : uploadedFileKey,
                testOptions: { skipS3 }, 
                pricing: {
                    ...priceData,
                    shippingCost,
                    finalTotal: Number((priceData.totalPrice + shippingCost).toFixed(2))
                }
            };

            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success && result.orderId) {
                onSuccess(result.orderId);
            } else {
                throw new Error(result.error || "Errore durante la creazione dell'ordine");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Styles Dinamici per Extra ---
    const extraStyles = brandColor === 'red' ? {
        active: 'bg-red-50 border-red-600',
        text: 'text-red-600',
        textBold: 'text-red-700',
        accent: 'accent-red-600 text-red-600',
        ring: 'focus:ring-red-500'
    } : {
        active: 'bg-indigo-50 border-indigo-600',
        text: 'text-indigo-600',
        textBold: 'text-indigo-700',
        accent: 'accent-indigo-600 text-indigo-600',
        ring: 'focus:ring-indigo-500'
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* PARTE SINISTRA: INPUT DATI */}
            <div className="flex-1 space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}
                
                {/* 1. Spedizione */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">1. Spedizione</h2>
                    <ShippingSelector 
                        selectedOption={shippingOption} 
                        onOptionChange={setShippingOption} 
                        brandColor={brandColor} 
                    />
                </section>

                {/* 2. Dati Cliente */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">2. I tuoi dati</h2>
                    <CustomerForm 
                        formData={formData} 
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        onAddressSelect={(addr) => setFormData(prev => ({ ...prev, ...addr }))}
                        showAddress={shippingOption === 'shipping'}
                        brandColor={brandColor}
                    />
                </section>
            </div>

            {/* PARTE DESTRA: RIEPILOGO E PAGAMENTO */}
            <div className="w-full lg:w-96 space-y-4">
                 <OrderSummary 
                    type={type} 
                    priceData={priceData} 
                    data={{ ...productData, shippingCost }} 
                    brandColor={brandColor} 
                 />

                 {/* UPGRADE SERVICES */}
                 <div className="space-y-3">
                    {onToggleProCheck && (
                        <div 
                            onClick={() => onToggleProCheck(!isProCheck)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                isProCheck 
                                ? extraStyles.active
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <input 
                                type="checkbox" 
                                checked={isProCheck}
                                onChange={() => {}} 
                                className={cn("w-5 h-5 rounded border-gray-300 pointer-events-none", extraStyles.accent, extraStyles.ring)}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-sm italic tracking-tight">Check-up Grafico Totale</span>
                                    <span className={cn("font-bold text-sm", isProCheck ? extraStyles.textBold : "text-gray-400")}>+ €7.00</span>
                                </div>
                                <p className={cn("text-xs mt-0.5 leading-snug", isProCheck ? extraStyles.text : "text-gray-500")}>
                                    {type === 'dtf' 
                                        ? "Controllo tecnico risoluzione, ottimizzazione nesting e verifica file per stampa DTF."
                                        : "Controllo tecnico risoluzione, setup margini e ottimizzazione file per la stampa."
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {onToggleFlashOrder && (
                        <div 
                            onClick={() => onToggleFlashOrder(!isFlashOrder)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                isFlashOrder 
                                ? extraStyles.active
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <input 
                                type="checkbox" 
                                checked={isFlashOrder}
                                onChange={() => {}} 
                                className={cn("w-5 h-5 rounded border-gray-300 pointer-events-none", extraStyles.accent, extraStyles.ring)}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-sm italic tracking-tight">Ordine Flash</span>
                                    <span className={cn("font-bold text-sm", isFlashOrder ? extraStyles.textBold : "text-gray-400")}>+ 10%</span>
                                </div>
                                <p className={cn("text-xs mt-0.5 leading-snug", isFlashOrder ? extraStyles.text : "text-gray-500")}>
                                    Produzione prioritaria e spedizione entro 24h.
                                </p>
                            </div>
                        </div>
                    )}
                 </div>
                 
                 <PaymentActions 
                    onPaymentSelect={handlePayment} 
                    isProcessing={isProcessing} 
                    brandColor={brandColor}
                 />

                 {onBack && (
                         <button 
                        onClick={onBack}
                        disabled={isProcessing}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                     >
                         Torna alla configurazione
                     </button>
                 )}
            </div>
        </div>
    );
}