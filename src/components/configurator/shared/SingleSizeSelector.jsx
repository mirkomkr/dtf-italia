import React from 'react';
import { cn } from '@/lib/utils';

export default function SingleSizeSelector({ 
    quantity, 
    onQuantityChange, 
    label = "Quantità",
    min = 0,
    visible = true,
    brandColor = 'indigo'
}) {
  if (!visible) return null;
const brandStyles = {
  red: {
    active: "border-red-600 bg-red-50/50",
    focus: "focus:border-red-600 focus:ring-red-600/20"
  },
  indigo: {
    active: "border-indigo-600 bg-indigo-50/50",
    focus: "focus:border-indigo-600 focus:ring-indigo-600/20"
  }
};

const currentStyle = brandStyles[brandColor] || brandStyles.indigo;

return (
    <div className="mb-4 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <label htmlFor="single-qty" className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input 
      id="single-qty"
      type="number"
      placeholder="0"
      value={quantity === 0 ? '' : quantity}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const valStr = e.target.value;
        if (valStr === '') {
          onQuantityChange(0);
          return;
        }
        const val = parseInt(valStr, 10);
        if (!isNaN(val)) {
          onQuantityChange(val);
        }
      }}
      className={cn(
        "block w-32 mx-auto h-12 rounded-xl border-2 border-gray-200 \
               bg-white text-gray-900 text-lg font-bold text-center \
               transition-all duration-200 \
               placeholder:text-gray-300",
        brandColor === 'red' 
          ? "focus:border-red-600 focus:ring-4 focus:ring-red-600/10 focus:outline-none" 
          : "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none"
      )}
    />
    </div>
  );
}