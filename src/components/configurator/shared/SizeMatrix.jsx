import React, { memo } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SizeMatrix = memo(function SizeMatrix({ 
  sizes = DEFAULT_SIZES, 
  quantities, 
  onQuantityChange, 
  visible = true, 
  title = "Seleziona Taglie e Quantità",
  brandColor = 'indigo'
}) {
  if (!visible) return null;

  return (
    <fieldset className="transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <legend className="block text-sm font-semibold text-gray-700 mb-3">
        {title}
      </legend>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {sizes.map((size) => (
           <SizeInput 
             key={size} 
             size={size} 
             parentValue={quantities[size]} 
             onCommit={onQuantityChange} 
             brandColor={brandColor}
           />
        ))}
      </div>
      <p className="text-right text-xs text-gray-500 mt-2" aria-live="polite">
        Totale Capi: <strong className={cn(
          "font-bold",
          brandColor === 'red' ? "text-red-600" : "text-indigo-600"
        )}>{Object.values(quantities).reduce((a, b) => a + (parseInt(b) || 0), 0)}</strong>
      </p>
    </fieldset>
  );
}, (prevProps, nextProps) => {
    return (
        prevProps.visible === nextProps.visible &&
        prevProps.title === nextProps.title &&
        prevProps.brandColor === nextProps.brandColor &&
        prevProps.quantities === nextProps.quantities 
    );
});

export default SizeMatrix;

function SizeInput({ size, parentValue, onCommit, brandColor }) {
    // Logica di stile
    const brandStyles = {
        red: {
          active: "border-red-600 bg-red-50/50 text-red-900",
          focus: "focus:ring-red-600/10 focus:border-red-600"
        },
        indigo: {
          active: "border-indigo-600 bg-indigo-50/50 text-indigo-900",
          focus: "focus:ring-indigo-600/10 focus:border-indigo-600"
        }
    };
    const currentStyle = brandStyles[brandColor] || brandStyles.indigo;

    // Mapping del valore per gestire lo zero come stringa vuota (stessa logica SingleSizeSelector)
    const displayValue = (parentValue === 0 || !parentValue) ? '' : parentValue;

    return (
          <div className="flex flex-col gap-1">
            <label htmlFor={`qty-${size}`} className="text-[10px] font-bold text-gray-400 uppercase text-center">{size}</label>
            <input
              id={`qty-${size}`}
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="0"
              value={displayValue}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const valStr = e.target.value;
                if (valStr === '') {
                  onCommit(size, 0);
                  return;
                }
                const val = parseInt(valStr, 10);
                if (!isNaN(val)) {
                  onCommit(size, val);
                }
              }}
              className={cn(
                "w-full h-12 text-center border-2 rounded-xl font-bold transition-all duration-200 outline-none",
                "focus-visible:ring-4",
                brandColor === 'red'
                    ? "focus-visible:border-red-600 focus-visible:ring-red-600/10"
                    : "focus-visible:border-indigo-600 focus-visible:ring-indigo-600/10",
                (parentValue > 0) 
                  ? `${currentStyle.active}` 
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
              aria-label={`Quantita per taglia ${size}`}
            />
          </div>
    );
}