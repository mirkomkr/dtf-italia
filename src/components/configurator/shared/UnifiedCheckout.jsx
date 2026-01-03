'use client';

import React, { useState } from 'react';
import { IS_DEV_MODE } from '@/lib/config';
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
    uploadedFileKey = null
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
    const handlePayment = async (paymentMethod, skipFiles = false) => {
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
    skipFiles,
    // Mappiamo correttamente detailedQuantities per la route.js
    items: {
        ...productData,
        detailedQuantities: productData.quantities // Forza il nome che la API si aspetta
    },
    uploadedFileKey: skipFiles ? null : uploadedFileKey, 
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
                onSuccess(result.orderId, { skipFiles });
            } else {
                throw new Error(result.error || "Errore durante la creazione dell'ordine");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
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