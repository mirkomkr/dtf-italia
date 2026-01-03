import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { cn } from '@/lib/utils';


const GoogleAddressInput = dynamic(() => import('./GoogleAddressInput'), { 
    ssr: false,
    loading: () => <input disabled className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-gray-50/50" placeholder="Caricamento ricerca indirizzi..." />
});

export default function CustomerForm({ 
    formData, 
    onChange, 
    onAddressSelect,
    showAddress = true, 
    brandColor = 'indigo' 
}) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const isRed = brandColor === 'red';
    
    // Focus ring with brand colors (focus-visible for keyboard-only)
    const focusRingClass = isRed 
        ? "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500" 
        : "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500";

    const labelClass = "block text-xs font-semibold text-gray-600 mb-1 ml-1";
    const inputClass = cn(
        "w-full h-12 px-4 border border-gray-300 rounded-xl text-sm bg-gray-50/50",
        "transition-all duration-200 outline-none",
        "focus-visible:bg-white",
        focusRingClass
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">I tuoi dati</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className={labelClass}>
                        Nome <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input 
                        id="firstName"
                        type="text" 
                        name="firstName" 
                        placeholder="Mario" 
                        value={formData.firstName} 
                        onChange={onChange} 
                        className={inputClass}
                        autoComplete="given-name"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className={labelClass}>
                        Cognome <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input 
                        id="lastName"
                        type="text" 
                        name="lastName" 
                        placeholder="Rossi" 
                        value={formData.lastName} 
                        onChange={onChange} 
                        className={inputClass}
                        autoComplete="family-name"
                        required
                        aria-required="true"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className={labelClass}>
                    Email <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input 
                    id="email"
                    type="email" 
                    name="email" 
                    placeholder="esempio@email.com" 
                    value={formData.email} 
                    onChange={onChange} 
                    className={inputClass}
                    autoComplete="email"
                    required
                    aria-required="true"
                />
            </div>

            {showAddress && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                    <div>
                        <label htmlFor="address" className={labelClass}>Indirizzo di Spedizione</label>
                        
                        {scriptLoaded ? (
                            <GoogleAddressInput 
                                value={formData.address}
                                onChange={onChange}
                                onAddressSelect={onAddressSelect}
                                className={inputClass}
                                placeholder="Via Roma, 1"
                                required
                            />
                        ) : (
                            <input 
                                disabled
                                type="text"
                                className={cn(inputClass, "cursor-not-allowed opacity-70")}
                                placeholder="In attesa di Google Maps..."
                                value={formData.address || ''}
                            />
                        )}

                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-gray-600 font-medium bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm flex items-center gap-1">
                                Powered by <span className="font-bold text-gray-700">Google</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label htmlFor="city" className={labelClass}>
                                Città <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input 
                                id="city"
                                type="text" 
                                name="city" 
                                placeholder="Roma" 
                                value={formData.city} 
                                onChange={onChange} 
                                className={inputClass}
                                autoComplete="address-level2"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="zip" className={labelClass}>
                                CAP <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input 
                                id="zip"
                                type="text" 
                                name="zip" 
                                placeholder="00100" 
                                value={formData.zip} 
                                onChange={onChange} 
                                className={inputClass}
                                autoComplete="postal-code"
                                required
                                aria-required="true"
                            />
                        </div>
                    </div>
                </div>
            )}
            {showAddress && (
                <Script
                    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                    strategy="lazyOnload"
                    onLoad={() => setScriptLoaded(true)}
                />
            )}
        </div>
    );
}
