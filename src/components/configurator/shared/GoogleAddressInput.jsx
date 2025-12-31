'use client';

import React from 'react';
import { usePlacesWidget } from "react-google-autocomplete";

export default function GoogleAddressInput({ 
    value, 
    onChange, 
    onAddressSelect, 
    className, 
    placeholder, 
    required 
}) {
    // Extra safety measure: Ensure window is available and google scripts are theoretically ready
    // though the parent component should handle the conditional rendering.
    
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
