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
    onBlur,
    errors = {},
    onAddressSelect,
    showAddress = true, 
    brandColor = 'indigo' 
}) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const isRed = brandColor === 'red';
    
    // Focus ring with brand colors
    const focusRingClass = isRed 
        ? "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500" 
        : "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500";

    const labelClass = "block text-xs font-semibold text-gray-600 mb-1 ml-1";
    // Helper per classi input dinamiche in base errore
    const getInputClass = (fieldName) => cn(
        "w-full h-12 px-4 border rounded-xl text-sm bg-gray-50/50 transition-all duration-200 outline-none focus-visible:bg-white",
        errors[fieldName] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300",
        !errors[fieldName] && focusRingClass
    );

    const isCompany = formData.customerType === 'company';

    const renderError = (fieldName) => errors[fieldName] && (
        <p id={`${fieldName}-error`} role="alert" className="text-red-600 text-xs mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
            {errors[fieldName]}
        </p>
    );

    return (
        <div className="space-y-6">
            
            {/* TIPO CLIENTE SWITCH */}
            <div className="flex p-1 bg-gray-100 rounded-xl" role="radiogroup" aria-label="Tipo Cliente">
                <button
                    type="button"
                    role="radio"
                    aria-checked={!isCompany}
                    onClick={() => onChange({ target: { name: 'customerType', value: 'private' } })}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400",
                        !isCompany ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Privato
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={isCompany}
                    onClick={() => onChange({ target: { name: 'customerType', value: 'company' } })}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400",
                        isCompany ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Azienda
                </button>
            </div>

            {/* DATI PRINCIPALI */}
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
                        onBlur={onBlur} 
                        className={getInputClass('firstName')}
                        autoComplete="given-name"
                        required
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                    {renderError('firstName')}
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
                        onBlur={onBlur} 
                        className={getInputClass('lastName')}
                        autoComplete="family-name"
                        required
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {renderError('lastName')}
                </div>
            </div>

            {/* DATI AZIENDALI vs PRIVATO */}
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                {isCompany ? (
                    <>
                        <div>
                            <label htmlFor="companyName" className={labelClass}>
                                Ragione Sociale <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input 
                                id="companyName"
                                type="text" 
                                name="companyName" 
                                placeholder="Nome Azienda SRL" 
                                value={formData.companyName} 
                                onChange={onChange}
                                onBlur={onBlur} 
                                className={getInputClass('companyName')}
                                required
                                aria-invalid={!!errors.companyName}
                                aria-describedby={errors.companyName ? "companyName-error" : undefined}
                            />
                            {renderError('companyName')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="partitaIva" className={labelClass}>
                                    Partita IVA <span className="text-red-500" aria-hidden="true">*</span>
                                </label>
                                <input 
                                    id="partitaIva"
                                    type="text" 
                                    inputMode="numeric"
                                    name="partitaIva" 
                                    placeholder="IT12345678901" 
                                    value={formData.partitaIva} 
                                    onChange={onChange}
                                    onBlur={onBlur} 
                                    className={getInputClass('partitaIva')}
                                    required
                                    aria-invalid={!!errors.partitaIva}
                                    aria-describedby={errors.partitaIva ? "partitaIva-error" : undefined}
                                />
                                {renderError('partitaIva')}
                            </div>
                            <div>
                                <label htmlFor="sdiCode" className={labelClass}>
                                    Codice SDI <span className="text-red-500" aria-hidden="true">*</span>
                                </label>
                                <input 
                                    id="sdiCode"
                                    type="text" 
                                    name="sdiCode" 
                                    placeholder="0000000" 
                                    value={formData.sdiCode} 
                                    onChange={(e) => onChange({ target: { name: 'sdiCode', value: e.target.value.toUpperCase() } })}
                                    onBlur={onBlur}
                                    className={getInputClass('sdiCode')}
                                    maxLength={7}
                                    required
                                    aria-invalid={!!errors.sdiCode}
                                    aria-describedby={errors.sdiCode ? "sdiCode-error" : undefined}
                                />
                                {renderError('sdiCode')}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pec" className={labelClass}>
                                PEC <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input 
                                id="pec"
                                type="email" 
                                name="pec" 
                                placeholder="azienda@pec.it" 
                                value={formData.pec} 
                                onChange={onChange}
                                onBlur={onBlur} 
                                className={getInputClass('pec')}
                                required
                                aria-invalid={!!errors.pec}
                                aria-describedby={errors.pec ? "pec-error" : undefined}
                            />
                            {renderError('pec')}
                        </div>
                    </>
                ) : (
                    <div>
                        <label htmlFor="codiceFiscale" className={labelClass}>
                            Codice Fiscale <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input 
                            id="codiceFiscale"
                            type="text" 
                            name="codiceFiscale" 
                            placeholder="RSSMRA80A01H501U" 
                            value={formData.codiceFiscale} 
                            onChange={(e) => onChange({ target: { name: 'codiceFiscale', value: e.target.value.toUpperCase() } })}
                            onBlur={onBlur}
                            className={getInputClass('codiceFiscale')}
                            maxLength={16}
                            required
                            aria-invalid={!!errors.codiceFiscale}
                            aria-describedby={errors.codiceFiscale ? "codiceFiscale-error" : undefined}
                        />
                        {renderError('codiceFiscale')}
                    </div>
                )}
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
                    onBlur={onBlur} 
                    className={getInputClass('email')}
                    autoComplete="email"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                />
                {renderError('email')}
            </div>

            {showAddress && (
                <div className="space-y-4 pt-2">
                    <div className="border-t border-gray-100 pt-4">
                         <label htmlFor="address" className={labelClass}>Indirizzo di Spedizione <span className="text-red-500" aria-hidden="true">*</span></label>
                         {/* SHIPPING ADDRESS INPUTS */}
                          {scriptLoaded ? (
                            <GoogleAddressInput 
                                value={formData.address}
                                onChange={onChange}
                                onAddressSelect={onAddressSelect}
                                className={getInputClass('address')}
                                placeholder="Via Roma, 1"
                                required
                            />
                        ) : (
                            <input 
                                disabled
                                type="text"
                                className={cn(getInputClass('address'), "cursor-not-allowed opacity-70")}
                                placeholder="In attesa di Google Maps..."
                                value={formData.address || ''}
                            />
                        )}
                        {renderError('address')}

                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-gray-600 font-medium bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm flex items-center gap-1">
                                Powered by <span className="font-bold text-gray-700">Google</span>
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            <div className="col-span-2">
                                <label htmlFor="city" className={labelClass}>Città <span className="text-red-500">*</span></label>
                                <input 
                                    id="city" 
                                    type="text" 
                                    name="city" 
                                    placeholder="Roma" 
                                    value={formData.city} 
                                    onChange={onChange}
                                    onBlur={onBlur} 
                                    className={getInputClass('city')} 
                                    required 
                                    aria-invalid={!!errors.city}
                                    aria-describedby={errors.city ? "city-error" : undefined}
                                />
                                {renderError('city')}
                            </div>
                            <div>
                                <label htmlFor="zip" className={labelClass}>CAP <span className="text-red-500">*</span></label>
                                <input 
                                    id="zip" 
                                    type="text" 
                                    name="zip" 
                                    placeholder="00100" 
                                    value={formData.zip} 
                                    onChange={onChange} 
                                    onBlur={onBlur}
                                    className={getInputClass('zip')} 
                                    required 
                                    aria-invalid={!!errors.zip}
                                    aria-describedby={errors.zip ? "zip-error" : undefined}
                                />
                                {renderError('zip')}
                            </div>
                        </div>
                    </div>

                    {/* FATTURAZIONE SEPARATA TOGGLE */}
                    <div className="flex items-center gap-3 py-2">
                        <input 
                            id="billingSameAsShipping"
                            type="checkbox"
                            checked={formData.billingSameAsShipping}
                            onChange={(e) => onChange({ target: { name: 'billingSameAsShipping', value: e.target.checked } })}
                            className={cn(
                                "w-5 h-5 rounded border-gray-300 pointer-events-auto cursor-pointer",
                                isRed ? "text-red-600 focus:ring-red-500" : "text-indigo-600 focus:ring-indigo-500"
                            )}
                        />
                        <label htmlFor="billingSameAsShipping" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                            L'indirizzo di fatturazione è uguale alla spedizione
                        </label>
                    </div>

                    {/* INDIRIZZO FATTURAZIONE (SE DIVERSO) */}
                    {!formData.billingSameAsShipping && (
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Indirizzo di Fatturazione</h3>
                            
                            <label htmlFor="billingAddress" className={labelClass}>Via e Numero Civico</label>
                             {scriptLoaded ? (
                                <GoogleAddressInput 
                                    value={formData.billingAddress}
                                    onChange={(e) => onChange({ target: { name: 'billingAddress', value: e.target.value } })}
                                    onAddressSelect={(addr) => {
                                        onChange({ target: { name: 'billingAddress', value: addr.address } });
                                        onChange({ target: { name: 'billingCity', value: addr.city } });
                                        onChange({ target: { name: 'billingZip', value: addr.zip } });
                                    }}
                                    className={cn(getInputClass('billingAddress'), "bg-white")}
                                    placeholder="Via Milano, 2"
                                />
                            ) : (
                                <input 
                                    className={cn(getInputClass('billingAddress'), "bg-white")}
                                    placeholder="Indirizzo fatturazione"
                                    value={formData.billingAddress || ''}
                                    onChange={(e) => onChange({ target: { name: 'billingAddress', value: e.target.value } })}
                                    onBlur={onBlur}
                                />
                            )}
                            {renderError('billingAddress')}

                            <div className="grid grid-cols-3 gap-4 mt-3">
                                <div className="col-span-2">
                                    <label htmlFor="billingCity" className={labelClass}>Città</label>
                                    <input 
                                        id="billingCity" 
                                        type="text" 
                                        name="billingCity" 
                                        placeholder="Milano" 
                                        value={formData.billingCity} 
                                        onChange={onChange}
                                        onBlur={onBlur} 
                                        className={cn(getInputClass('billingCity'), "bg-white")}
                                        aria-invalid={!!errors.billingCity}
                                        aria-describedby={errors.billingCity ? "billingCity-error" : undefined}
                                    />
                                    {renderError('billingCity')}
                                </div>
                                <div>
                                    <label htmlFor="billingZip" className={labelClass}>CAP</label>
                                    <input 
                                        id="billingZip" 
                                        type="text" 
                                        name="billingZip" 
                                        placeholder="20100" 
                                        value={formData.billingZip} 
                                        onChange={onChange}
                                        onBlur={onBlur} 
                                        className={cn(getInputClass('billingZip'), "bg-white")} 
                                        aria-invalid={!!errors.billingZip}
                                        aria-describedby={errors.billingZip ? "billingZip-error" : undefined}
                                    />
                                    {renderError('billingZip')}
                                </div>
                            </div>
                        </div>
                    )}

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
