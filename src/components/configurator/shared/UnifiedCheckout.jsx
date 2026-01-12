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
        zip: '',
        // Nuovi campi per fatturazione
        customerType: 'private', // 'private' | 'company'
        codiceFiscale: '',
        companyName: '',
        partitaIva: '',
        sdiCode: '',
        pec: '',
        billingSameAsShipping: true,
        billingAddress: '',
        billingCity: '',
        billingZip: ''
    });
    const [shippingOption, setShippingOption] = useState('shipping');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Costo spedizione semplice
    const shippingCost = shippingOption === 'pickup' ? 0.00 : 7.50; 

    // --- Helpers Validazione ---
    const validateField = (name, value, formData) => {
        let error = null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex CF: 16 char, 6 letters, 2 digits, 1 letter, 2 digits, 1 letter, 3 digits, 1 letter
        const cfRegex = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i;
        const pivaRegex = /^[0-9]{11}$/;
        const sdiRegex = /^[A-Z0-9]{7}$/i;

        switch (name) {
            case 'firstName':
            case 'lastName':
            case 'email':
            case 'address':
            case 'city':
            case 'zip':
                if (!value) error = 'Campo obbligatorio';
                if (name === 'email' && value && !emailRegex.test(value)) error = 'Email non valida';
                break;
            
            case 'codiceFiscale':
                if (formData.customerType === 'private') {
                    if (!value) error = 'Codice Fiscale obbligatorio';
                    else if (!cfRegex.test(value)) error = 'Formato non valido (es. RSSMRA80A01H501U)';
                }
                break;

            case 'companyName':
            case 'partitaIva':
            case 'sdiCode':
            case 'pec':
                if (formData.customerType === 'company') {
                    if (!value) error = 'Campo obbligatorio per aziende';
                    else if (name === 'partitaIva' && !pivaRegex.test(value)) error = 'Partita IVA deve contenere 11 numeri';
                    else if (name === 'sdiCode' && !sdiRegex.test(value)) error = 'SDI deve essere 7 caratteri';
                    else if (name === 'pec' && !emailRegex.test(value)) error = 'PEC non valida';
                }
                break;

            case 'billingAddress':
            case 'billingCity':
            case 'billingZip':
                if (!formData.billingSameAsShipping && !value) error = 'Campo obbligatorio';
                break;
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, formData);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // --- Logica di Pagamento ---
    const handlePayment = async (paymentMethod, skipS3 = false) => {
        // Validazione Completa
        const newErrors = {};
        let isValid = true;
        
        // Elenco campi da validare in base al tipo
        const fieldsToValidate = [
            'firstName', 'lastName', 'email', 
            ...(shippingOption === 'shipping' ? ['address', 'city', 'zip'] : []),
            ...(formData.customerType === 'private' ? ['codiceFiscale'] : ['companyName', 'partitaIva', 'sdiCode', 'pec']),
            ...(!formData.billingSameAsShipping ? ['billingAddress', 'billingCity', 'billingZip'] : [])
        ];

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field], formData);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (!isValid) {
            // Focus sul primo errore
            const firstErrorField = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) element.focus();
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
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-10">
            
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
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
                            // Clear error on change if desired, or keep until blur
                            if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
                        }}
                        onBlur={handleBlur}
                        errors={errors}
                        onAddressSelect={(addr) => {
                            setFormData(prev => ({ ...prev, ...addr }));
                            setErrors(prev => ({ ...prev, address: null, city: null, zip: null }));
                        }}
                        showAddress={shippingOption === 'shipping'}
                        brandColor={brandColor}
                    />
                </section>
            </div>

            {/* PARTE BASSA: RIEPILOGO E PAGAMENTO */}
            <div className="w-full space-y-6 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Riepilogo</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* COLONNA SINISTRA: RIEPILOGO */}
                    <OrderSummary 
                        type={type} 
                        priceData={priceData} 
                        data={{ ...productData, shippingCost }} 
                        brandColor={brandColor} 
                    />

                    {/* COLONNA DESTRA: UPGRADE SERVICES */}
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
                                        <span className="font-bold text-gray-900 text-sm tracking-tight">Controllo File</span>
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
                                        <span className="font-bold text-gray-900 text-sm tracking-tight">Ordine Flash</span>
                                        <span className={cn("font-bold text-sm", isFlashOrder ? extraStyles.textBold : "text-gray-400")}>+ 10%</span>
                                    </div>
                                    <p className={cn("text-xs mt-0.5 leading-snug", isFlashOrder ? extraStyles.text : "text-gray-500")}>
                                        Produzione prioritaria e spedizione entro 24h.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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