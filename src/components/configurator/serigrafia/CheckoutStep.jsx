'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing-engine';
import { SHIRT_COLORS } from './constants';

export default function CheckoutStep({
  totalQuantity,
  price,
  shippingCost,
  quantities,
  enableVariants = true,
  shippingOption,
  setShippingOption,
  formData,
  handleInputChange,
  handleCheckout,
  isProcessing,
  onBack
}) {
  return (
      <div className="flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Riepilogo & Dati</h2>
            
            {/* Detailed Summary */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-6 overflow-hidden">
                 <div className="flex justify-between items-center mb-4 border-b border-indigo-200 pb-2">
                     <span className="font-bold text-indigo-900">Totale Ordine ({totalQuantity} pz)</span>
                     <span className="font-bold text-indigo-600 text-lg">{formatCurrency(price.totalPrice + shippingCost)}</span>
                 </div>
                 
                 {enableVariants && (
                     <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {Object.entries(quantities).map(([colorId, genderData]) => {
                             const colorLabel = SHIRT_COLORS.find(c => c.id === colorId)?.label || colorId;
                             // Check if color has any items
                             const colorTotal = Object.values(genderData).reduce((ga, gv) => ga + Object.values(gv).reduce((sa, sv) => sa + (parseInt(sv)||0), 0), 0);
                             if(colorTotal === 0) return null;

                             return (
                                 <div key={colorId} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-sm">
                                     <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                         <span className="w-3 h-3 rounded-full border border-gray-300" style={{background: SHIRT_COLORS.find(c=>c.id===colorId)?.hex}}></span>
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
            </div>

            {/* Shipping + Form inputs */}
             <div className="grid grid-cols-2 gap-3 mb-4">
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'shipping' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                  <input type="radio" name="shippingOption" value="shipping" checked={shippingOption === 'shipping'} onChange={(e) => setShippingOption(e.target.value)} className="hidden"/>
                  <span className="font-bold text-gray-900">Spedizione</span>
                </label>
                <label className={cn(
                  "border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-300",
                  shippingOption === 'pickup' ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                )}>
                   <input type="radio" name="shippingOption" value="pickup" checked={shippingOption === 'pickup'} onChange={(e) => setShippingOption(e.target.value)} className="hidden"/>
                  <span className="font-bold text-gray-900">Ritiro</span>
                </label>
              </div>

               <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="firstName" placeholder="Nome" value={formData.firstName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                    <input type="text" name="lastName" placeholder="Cognome" value={formData.lastName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                  {shippingOption === 'shipping' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <input type="text" name="address" placeholder="Indirizzo" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                        <div className="grid grid-cols-3 gap-3">
                            <input type="text" name="city" placeholder="Città" value={formData.city} onChange={handleInputChange} className="col-span-2 w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                            <input type="text" name="zip" placeholder="CAP" value={formData.zip} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm"/>
                        </div>
                    </div>
                  )}
               </div>

            {/* Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleCheckout('stripe')}
                        disabled={isProcessing}
                        className="py-3 px-4 bg-[#635BFF] hover:bg-[#544de6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                    >
                        {isProcessing ? '...' : 'Paga con Carta'}
                    </button>
                    <button 
                        onClick={() => handleCheckout('paypal')}
                        disabled={isProcessing}
                        className="py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                    >
                        PayPal
                    </button>
                </div>
                <button onClick={onBack} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">Indietro</button>
            </div>
      </div>
  );
}
