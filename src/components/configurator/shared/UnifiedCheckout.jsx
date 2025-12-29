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
    isTestMode = true, // Default true for now to allow testing
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
    const shippingCost = shippingOption === 'pickup' ? 0.00 : 7.50; // Standard fixed rate

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
            const orderData = {
                billing: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    address_1: formData.address,
                    city: formData.city,
                    postcode: formData.zip,
                    country: 'IT',
                    phone: ''
                },
                shipping: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: shippingOption === 'pickup' ? 'Via dei Castelli Romani, 22' : formData.address,
                    city: shippingOption === 'pickup' ? 'Pomezia' : formData.city,
                    postcode: shippingOption === 'pickup' ? '00071' : formData.zip,
                    country: 'IT'
                },
                payment_method: paymentMethod === 'test-s3' ? 'bacs' : paymentMethod,
                payment_method_title: paymentMethod === 'test-s3' ? 'Bonifico Bancario (Test)' : paymentMethod,
                line_items: [
                    {
                        product_id: 18, // Fallback ID
                        quantity: productData.quantity || 1,
                        meta_data: [
                            { key: 'Prezzo Calcolato', value: `${priceData.totalPrice}€` },
                            { key: 'Dettagli', value: JSON.stringify(productData) }
                        ]
                    }
                ],
                meta_data: [
                    { key: '_shipping_method', value: shippingOption } // Internal tracking
                ]
            };

            // 2. Call API to Create Order
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success && result.orderId) {
                // If we have a pre-uploaded file (unlikely in current flow, but requested), link it now
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
