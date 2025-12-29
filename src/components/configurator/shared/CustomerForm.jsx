import React from 'react';
import { cn } from '@/lib/utils';

export default function CustomerForm({ 
    formData, 
    onChange, 
    showAddress = true, 
    brandColor = 'indigo' 
}) {
    const isRed = brandColor === 'red';
    
    // Focus ring color
    const focusRingClass = isRed 
        ? "focus:ring-red-500 focus:border-red-500" 
        : "focus:ring-indigo-500 focus:border-indigo-500";

    const labelClass = "block text-xs font-semibold text-gray-500 mb-1 ml-1";

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
                        className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
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
                        className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
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
                    className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
                    required
                />
            </div>

            {showAddress && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                    <div>
                        <label className={labelClass}>Indirizzo di Spedizione</label>
                        <input 
                            type="text" 
                            name="address" 
                            placeholder="Via Roma, 1" 
                            value={formData.address} 
                            onChange={onChange} 
                            className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
                            required
                        />
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
                                className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
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
                                className={cn("w-full p-3 border border-gray-300 rounded-xl text-sm transition-shadow focus:ring-2 outline-none bg-gray-50/50 focus:bg-white", focusRingClass)}
                                required
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
