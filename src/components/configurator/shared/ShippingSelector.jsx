import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Truck } from 'lucide-react';

export default function ShippingSelector({ 
    selectedOption, 
    onOptionChange, 
    brandColor = 'indigo' 
}) {
    const isRed = brandColor === 'red';

    const activeClass = isRed 
        ? "border-red-600 bg-red-50 ring-1 ring-red-600" 
        : "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";
        
    const hoverClass = isRed
        ? "hover:border-red-300"
        : "hover:border-indigo-300";

    const iconClass = isRed ? "text-red-600" : "text-indigo-600";
    const titleClass = isRed ? "text-red-900" : "text-indigo-900";

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {/* Spedizione */}
                <label className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 relative group",
                    hoverClass,
                    selectedOption === 'shipping' ? activeClass : "border-gray-200 bg-white"
                )}>
                    <input 
                        type="radio" 
                        name="shippingOption" 
                        value="shipping" 
                        checked={selectedOption === 'shipping'} 
                        onChange={(e) => onOptionChange(e.target.value)} 
                        className="hidden"
                    />
                    <Truck className={cn("w-6 h-6 mb-1", selectedOption === 'shipping' ? iconClass : "text-gray-400")} />
                    <span className={cn("font-bold text-sm", selectedOption === 'shipping' ? titleClass : "text-gray-600")}>
                        Spedizione Corriere
                    </span>
                    {selectedOption === 'shipping' && (
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", isRed ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700")}>
                            24/48h
                        </span>
                    )}
                </label>

                {/* Ritiro */}
                <label className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 relative group",
                    hoverClass,
                    selectedOption === 'pickup' ? activeClass : "border-gray-200 bg-white"
                )}>
                    <input 
                        type="radio" 
                        name="shippingOption" 
                        value="pickup" 
                        checked={selectedOption === 'pickup'} 
                        onChange={(e) => onOptionChange(e.target.value)} 
                        className="hidden"
                    />
                    <MapPin className={cn("w-6 h-6 mb-1", selectedOption === 'pickup' ? iconClass : "text-gray-400")} />
                    <span className={cn("font-bold text-sm", selectedOption === 'pickup' ? titleClass : "text-gray-600")}>
                        Ritiro in Sede
                    </span>
                     {selectedOption === 'pickup' && (
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", isRed ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700")}>
                            Gratis
                        </span>
                    )}
                </label>
            </div>

            {/* Address Info for Pickup */}
            {selectedOption === 'pickup' && (
                <div className={cn(
                    "text-center p-3 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2",
                    isRed ? "bg-red-50 border-red-100 text-red-800" : "bg-indigo-50 border-indigo-100 text-indigo-800"
                )}>
                    <p className="font-semibold">Punto Ritiro:</p>
                    <p>Via dei Castelli Romani, 22, Pomezia (RM)</p>
                </div>
            )}
        </div>
    );
}
