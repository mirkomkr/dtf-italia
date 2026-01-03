import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing-engine';
import { SHIRT_COLORS } from '../serigrafia/constants'; // Dependency on Serigrafia constants
import { Package, Zap } from 'lucide-react';

export default function OrderSummary({ 
    type = 'serigrafia', // 'serigrafia' | 'dtf'
    priceData = { unitPrice: 0, totalPrice: 0 }, 
    data = {}, // quantities for serigrafia; config for dtf
    brandColor = 'indigo'
}) {
    const isRed = brandColor === 'red';
    
    // Dynamic Styles
    const borderClass = isRed ? "border-red-100" : "border-indigo-100";
    const bgClass = isRed ? "bg-red-50" : "bg-indigo-50";
    const borderBottomClass = isRed ? "border-red-200" : "border-indigo-200";
    const titleClass = isRed ? "text-red-900" : "text-indigo-900";
    const totalClass = isRed ? "text-red-600" : "text-indigo-600";

    return (
        <div className={cn("rounded-xl p-4 border mb-6 overflow-hidden", bgClass, borderClass)}>
            
             {/* Header */}
             <div className={cn("flex justify-between items-center mb-4 border-b pb-2", borderBottomClass)}>
                 <span className={cn("font-bold", titleClass)}>
                    Totale Ordine
                    {data.quantity || data.totalQuantity ? ` (${data.quantity || data.totalQuantity} pz)` : ''}
                 </span>
                 <span className={cn("font-bold text-lg", totalClass)}>
                     {formatCurrency(priceData.totalPrice + (data.shippingCost || 0))}
                 </span>
             </div>
             
             {/* SERIGRAFIA LOGIC */}
             {type === 'serigrafia' && data.quantities && (
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(data.quantities).map(([colorId, genderData]) => {
                         const colorLabel = SHIRT_COLORS.find(c => c.id === colorId)?.label || colorId;
                         // Check if color has any items
                         const colorTotal = Object.values(genderData).reduce((ga, gv) => ga + Object.values(gv).reduce((sa, sv) => sa + (parseInt(sv)||0), 0), 0);
                         if(colorTotal === 0) return null;

                         return (
                             <div key={colorId} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm">
                                 <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                     <span className="w-3 h-3 rounded-full border border-gray-300" style={{background: SHIRT_COLORS.find(c=>c.id===colorId)?.hex || '#ccc'}}></span>
                                     {colorLabel} ({colorTotal} pz)
                                 </div>
                                 <div className="pl-5 space-y-1">
                                    {Object.entries(genderData).map(([gender, sizes]) => {
                                         const sizeStr = Object.entries(sizes)
                                            .filter(([_, q]) => q > 0)
                                            .map(([s, q]) => `${q} ${s}`)
                                            .join(', ');
                                         if(!sizeStr) return null;
                                         return (
                                             <div key={gender} className="text-gray-600 text-xs">
                                                 <span className="capitalize font-semibold">{gender}:</span> {sizeStr}
                                             </div>
                                         )
                                    })}
                                 </div>
                             </div>
                         );
                    })}
                 </div>
             )}

             {/* DTF LOGIC */}
             {type === 'dtf' && (
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                        <span className="text-gray-600">Formato</span>
                        <span className="font-bold text-gray-900 uppercase">
                            {data.format} 
                            {(data.width && data.height) ? ` (${data.width}x${data.height} cm)` : ''}
                        </span>
                    </div>
                    
                    {priceData.details?.totalMeters && (
                        <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                             <span className="text-gray-600">Metri Totali</span>
                             <span className="font-bold text-gray-900">{priceData.details.totalMeters} mt</span>
                        </div>
                    )}

                    {data.isFullService && (
                         <div className={cn("flex justify-between items-center p-2 rounded-lg bg-white/50", isRed ? "text-red-700" : "text-indigo-700")}>
                            <span className="font-medium flex items-center gap-1"><Package size={14} aria-hidden="true" /> Pensa a tutto DTF Italia</span>
                            <span>+10%</span>
                        </div>
                    )}
                    {data.isFlashOrder && (
                         <div className="flex justify-between items-center text-amber-600 p-2 rounded-lg bg-white/50">
                            <span className="font-medium flex items-center gap-1"><Zap size={14} aria-hidden="true" /> Ordine Flash</span>
                            <span>+10%</span>
                        </div>
                    )}
                 </div>
             )}
        </div>
    );
}
