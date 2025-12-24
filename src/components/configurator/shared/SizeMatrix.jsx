import React from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function SizeMatrix({ sizes = DEFAULT_SIZES, quantities, onQuantityChange, visible = true, title = "Seleziona Taglie e Quantità" }) {
  if (!visible) return null;

  return (
    <div className="transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {title}
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col gap-1">
            <label htmlFor={`qty-${size}`} className="text-xs font-bold text-gray-500 uppercase text-center">{size}</label>
            <input
              id={`qty-${size}`}
              type="number"
              min="0"
              value={quantities[size] > 0 ? quantities[size] : ''}
              onChange={(e) => onQuantityChange(size, e.target.value)}
              placeholder="0"
              className={cn(
                "w-full p-2 text-center border rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium transition-colors",
                (quantities[size] > 0) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            />
          </div>
        ))}
      </div>
      <p className="text-right text-xs text-gray-500 mt-2">
        Totale Capi: <strong className="text-indigo-600">{Object.values(quantities).reduce((a, b) => a + (parseInt(b) || 0), 0)}</strong>
      </p>
    </div>
  );
}
