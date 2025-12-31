import React from 'react';
import { cn } from '@/lib/utils';

export default function SingleSizeSelector({ 
    quantity, 
    onQuantityChange, 
    label = "Quantità",
    min = 0,
    visible = true
}) {
  if (!visible) return null;

  return (
    <div className="mb-4 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <label htmlFor="single-qty" className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        id="single-qty"
        type="number"
        min={min}
        value={quantity || ''}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onQuantityChange(e.target.value)}
        onBlur={() => {
            if (quantity === '' || parseInt(quantity) < min) {
                onQuantityChange(min);
            }
        }}
        placeholder="0"
        className={cn(
          "w-32 p-2 text-center border rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium transition-colors",
          quantity > 0 ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-gray-300 text-gray-700 hover:border-gray-400"
        )}
      />
    </div>
  );
}