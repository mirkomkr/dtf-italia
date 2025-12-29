'use client';

import React, { useState } from 'react';
import OrderSummary from './OrderSummary';
import ShippingSelector from './ShippingSelector';
import CustomerForm from './CustomerForm';
import PaymentActions from './PaymentActions';

export default function UnifiedCheckout({
    type, // 'serigrafia' | 'dtf'
    priceData, // { unitPrice, totalPrice, details... }
    productData, // { quantities, format, ... }
    brandColor = 'indigo',
    onSuccess, // (orderId) => void
    onBack,
    uploadedFileKey = null
}) {
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

    // Logic for shipping cost
    const shippingCost = shippingOption === 'pickup' ? 0.00 : 7.50; 

    const handlePayment = async (paymentMethod) => {
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert("Compila tutti i campi obbligatori.");
            return;
        }
        if (shippingOption === 'shipping' && (!formData.address || !formData.city || !formData.zip)) {
            alert("Compila l'indirizzo di spedizione.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Prepare Order Data
            const payload = {
                type,
                customer: { ...formData },
                shipping: { 
                    option: shippingOption, 
                    cost: shippingCost 
                },
                paymentMethod,
                items: productData,
                uploadedFileKey, 
                pricing: {
                    ...priceData,
                    shippingCost,
                    finalTotal: priceData.totalPrice + shippingCost
                }
            };

            // 2. Call API to Create Order
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success && result.orderId) {
                // S3 Link update as backup if key is present
                if (uploadedFileKey) {
                    await fetch('/api/order/update-s3-meta', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            orderId: result.orderId, 
                            s3Key: uploadedFileKey 
                        })
                    }).catch(err => console.error("S3 Link Error:", err));
                }
                
                onSuccess(result.orderId);
            } else {
                throw new Error(result.error || "Errore sconosciuto");
            }

        } catch (err) {
            console.error("Payment Error:", err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Forms */}
            <div className="flex-1 space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}
                
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">1. Metodo di Consegna</h2>
                    <ShippingSelector 
                        selectedOption={shippingOption} 
                        onOptionChange={setShippingOption} 
                        brandColor={brandColor} 
                    />
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">2. I tuoi dati</h2>
                    <CustomerForm 
                        formData={formData} 
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        onAddressSelect={(addressData) => setFormData(prev => ({ ...prev, ...addressData }))}
                        showAddress={shippingOption === 'shipping'}
                        brandColor={brandColor}
                    />
                </section>
            </div>

            {/* Right Column: Summary & Payment */}
            <div className="lg:w-96 flex-shrink-0">
                 <div className="sticky top-4">
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
                            className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                         >
                             Indietro
                         </button>
                     )}
                 </div>
            </div>
        </div>
    );
}