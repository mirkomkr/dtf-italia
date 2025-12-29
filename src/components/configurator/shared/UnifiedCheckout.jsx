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
    isTestMode = true // Default true for now to allow testing
}) {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        address: '', city: '', zip: ''
    });
    const [shippingOption, setShippingOption] = useState('shipping');
    const [isProcessing, setIsProcessing] = useState(false);

    // Logic for shipping cost
    const shippingCost = shippingOption === 'pickup' ? 0.00 : 7.50; // Standard fixed rate

    const handlePayment = async (method) => {
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

        try {
            const payload = {
                type,
                customer: { ...formData },
                shipping: { option: shippingOption, cost: shippingCost },
                paymentMethod: method,
                items: productData,
                pricing: {
                    ...priceData,
                    shippingCost,
                    finalTotal: priceData.totalPrice + shippingCost
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
                throw new Error(result.error || "Errore sconosciuto");
            }

        } catch (error) {
            console.error(error);
            alert("Errore durante la creazione dell'ordine: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Forms */}
            <div className="flex-1 space-y-8">
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
                        isTestMode={isTestMode} 
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
