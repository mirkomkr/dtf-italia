import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Truck, ExternalLink } from 'lucide-react';

/**
 * ShippingSelector - Accessible radio group for delivery method selection.
 * Uses fieldset/legend for semantic grouping (legend is visually hidden).
 * @param {Object} props
 * @param {'shipping'|'pickup'} props.selectedOption - Currently selected option
 * @param {Function} props.onOptionChange - Callback when selection changes
 * @param {'indigo'|'red'} props.brandColor - Brand color theme
 */
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

    // Focus-visible ring for keyboard navigation (brand-consistent)
    const focusVisibleClass = isRed
        ? "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        : "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

    const iconClass = isRed ? "text-red-600" : "text-indigo-600";
    const titleClass = isRed ? "text-red-900" : "text-indigo-900";

    return (
        <fieldset className="space-y-4">
            {/* Visually hidden legend for screen readers */}
            <legend className="sr-only">Seleziona metodo di consegna</legend>
            
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Metodo di consegna">
                {/* Spedizione Corriere */}
                <label 
                    className={cn(
                        "border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center gap-2 relative group",
                        "transition-all duration-200",
                        "border-gray-200 bg-white",
                        "has-[:checked]:border-2",
                        isRed ? "has-[:checked]:border-red-600 has-[:checked]:bg-red-50" : "has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50",
                        focusVisibleClass,
                        hoverClass
                    )}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onOptionChange('shipping'); }}}
                >
                    <input 
                        type="radio" 
                        name="shippingOption" 
                        value="shipping" 
                        checked={selectedOption === 'shipping'} 
                        onChange={(e) => onOptionChange(e.target.value)} 
                        className="peer sr-only"
                        aria-label="Spedizione con corriere in 24/48h"
                    />
                    <Truck className={cn("w-6 h-6 mb-1 text-gray-400 peer-checked:text-inherit", isRed ? "peer-checked:text-red-600" : "peer-checked:text-indigo-600")} aria-hidden="true" />
                    <span className={cn("font-bold text-sm text-gray-600", isRed ? "peer-checked:text-red-900" : "peer-checked:text-indigo-900")}>
                        Spedizione Corriere
                    </span>
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity",
                        isRed ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                    )}>
                        24/48h
                    </span>
                </label>

                {/* Ritiro in Sede */}
                <label 
                    className={cn(
                        "border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center gap-2 relative group",
                        "transition-all duration-200",
                        "border-gray-200 bg-white",
                        "has-[:checked]:border-2",
                        isRed ? "has-[:checked]:border-red-600 has-[:checked]:bg-red-50" : "has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50",
                        focusVisibleClass,
                        hoverClass
                    )}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onOptionChange('pickup'); }}}
                >
                    <input 
                        type="radio" 
                        name="shippingOption" 
                        value="pickup" 
                        checked={selectedOption === 'pickup'} 
                        onChange={(e) => onOptionChange(e.target.value)} 
                        className="peer sr-only"
                        aria-label="Ritiro gratuito in sede a Via Margutta, Roma"
                    />
                    <MapPin className={cn("w-6 h-6 mb-1 text-gray-400", isRed ? "peer-checked:text-red-600" : "peer-checked:text-indigo-600")} aria-hidden="true" />
                    <span className={cn("font-bold text-sm text-gray-600", isRed ? "peer-checked:text-red-900" : "peer-checked:text-indigo-900")}>
                        Ritiro in Sede
                    </span>
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity",
                        isRed ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                    )}>
                        Gratis
                    </span>
                </label>
            </div>

            {/* Address Info for Pickup */}
            {selectedOption === 'pickup' && (
                <a
                    href="https://www.google.com/maps/search/?api=1&query=Via+Margutta+Roma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "block text-center p-4 rounded-xl border text-sm animate-in fade-in slide-in-from-top-2 group relative overflow-hidden",
                        "transition-all duration-300 hover:shadow-md active:scale-[0.98] cursor-pointer",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        isRed 
                            ? "bg-red-50 border-red-100 text-red-900 hover:border-red-300 focus-visible:ring-red-500" 
                            : "bg-indigo-50 border-indigo-100 text-indigo-900 hover:border-indigo-300 focus-visible:ring-indigo-500"
                    )}
                    aria-label="Avvia navigazione GPS verso Via Margutta, Roma"
                >
                    <div className="flex flex-col items-center gap-1 relative z-10">
                        <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-xs opacity-70 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>Punto Ritiro</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg leading-tight underline decoration-2 decoration-transparent group-hover:decoration-current transition-all">
                                Via Margutta, Roma
                            </span>
                            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <span className="text-[10px] uppercase font-bold tracking-widest mt-2 px-2 py-1 bg-white/50 rounded-md border border-black/5 group-hover:bg-white/80 transition-colors">
                            Clicca per navigazione GPS
                        </span>
                    </div>

                    {/* Hover Effect Background */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        isRed 
                            ? "bg-gradient-to-r from-transparent via-red-100/20 to-transparent" 
                            : "bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent"
                    )} />
                </a>
            )}
        </fieldset>
    );
}
