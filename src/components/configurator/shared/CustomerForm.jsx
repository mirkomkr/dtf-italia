import React from 'react';
import { cn } from '@/lib/utils';
import { usePlacesWidget } from "react-google-autocomplete";

// Internal component for the Google-connected input
function GoogleAddressInput({ 
    value, 
    onChange, 
    onAddressSelect, 
    className, 
    placeholder, 
    required 
}) {
    const { ref } = usePlacesWidget({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
        onPlaceSelected: (place) => {
            let address = '';
            let city = '';
            let zip = '';
            
            if (place.address_components) {
                const getComponent = (type) => place.address_components.find(c => c.types.includes(type))?.long_name || '';
                
                const route = getComponent('route');
                const streetNum = getComponent('street_number');
                address = route + (streetNum ? `, ${streetNum}` : '');
                
                if(!address && place.name) address = place.name;

                city = getComponent('locality') || getComponent('administrative_area_level_3');
                zip = getComponent('postal_code');
            }

            if (onAddressSelect) {
                onAddressSelect({
                    address: address || '',
                    city: city || '',
                    zip: zip || ''
                });
            } else {
                if(address) onChange({ target: { name: 'address', value: address } });
                if(city) onChange({ target: { name: 'city', value: city } });
                if(zip) onChange({ target: { name: 'zip', value: zip } });
            }
        },
        options: {
            types: ["address"],
            componentRestrictions: { country: "it" },
            fields: ["address_components", "formatted_address", "name"]
        },
    });

    return (
        <input 
            ref={ref}
            type="text" 
            name="address" 
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange} 
            className={className}
            required={required}
            autoComplete="off"
        />
    );
}

export default function CustomerForm({ 
    formData, 
    onChange, 
    onAddressSelect,
    showAddress = true, 
    brandColor = 'indigo' 
}) {
    const isRed = brandColor === 'red';
    
    // Focus ring color
    const focusRingClass = isRed 
        ? "focus:ring-red-500 focus:border-red-500" 
        : "focus:ring-indigo-500 focus:border-indigo-500";

    const labelClass = "block text-xs font-semibold text-gray-500 mb-1 ml-1";
    const inputClass = cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">I tuoi dati</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Nome</label>
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="Mario" 
                        value={formData.firstName} 
                        onChange={onChange} 
                        className={inputClass}
                        required
                    />
                </div>
                <div>
                    <label className={labelClass}>Cognome</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Rossi" 
                        value={formData.lastName} 
                        onChange={onChange} 
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="esempio@email.com" 
                    value={formData.email} 
                    onChange={onChange} 
                    className={inputClass}
                    required
                />
            </div>

            {showAddress && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                    <div>
                        <label className={labelClass}>Indirizzo di Spedizione</label>
                        
                        <GoogleAddressInput 
                            value={formData.address}
                            onChange={onChange}
                            onAddressSelect={onAddressSelect}
                            className={inputClass}
                            placeholder="Via Roma, 1"
                            required
                        />

                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-gray-400 font-medium bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm flex items-center gap-1">
                                Powered by <span className="font-bold text-gray-500">Google</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className={labelClass}>Città</label>
                            <input 
                                type="text" 
                                name="city" 
                                placeholder="Roma" 
                                value={formData.city} 
                                onChange={onChange} 
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>CAP</label>
                            <input 
                                type="text" 
                                name="zip" 
                                placeholder="00100" 
                                value={formData.zip} 
                                onChange={onChange} 
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
