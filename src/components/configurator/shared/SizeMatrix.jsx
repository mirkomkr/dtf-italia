import React, { memo } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SizeMatrix = memo(function SizeMatrix({ sizes = DEFAULT_SIZES, quantities, onQuantityChange, visible = true, title = "Seleziona Taglie e Quantità" }) {
  if (!visible) return null;

  return (
    <div className="transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {title}
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {sizes.map((size) => (
           <SizeInput 
             key={size} 
             size={size} 
             parentValue={quantities[size]} 
             onCommit={onQuantityChange} 
           />
        ))}
      </div>
      <p className="text-right text-xs text-gray-500 mt-2">
        Totale Capi: <strong className="text-indigo-600">{Object.values(quantities).reduce((a, b) => a + (parseInt(b) || 0), 0)}</strong>
      </p>
    </div>
  );
}, (prevProps, nextProps) => {
    // Custom comparison for performance: 
    // re-render only if title, visible, or relevant quantity CHANGED.
    // Deep comparison of quantities object is expensive, but it's shallow here (object reference from parent).
    // If parent creates new object every render, memo is useless unless we check deeper or rely on parent memoization.
    // Assuming parent (SerigrafiaContainer) handles state updates correctly.
    // Simple prop check:
    return (
        prevProps.visible === nextProps.visible &&
        prevProps.title === nextProps.title &&
        prevProps.quantities === nextProps.quantities // Relies on immutability
    );
});

export default SizeMatrix;

function SizeInput({ size, parentValue, onCommit }) {
    const [localValue, setLocalValue] = React.useState(parentValue > 0 ? parentValue : '');

    React.useEffect(() => {
        setLocalValue(parentValue > 0 ? parentValue : '');
    }, [parentValue]);

    const handleBlur = () => {
        const val = parseInt(localValue) || 0;
        if (val !== (parseInt(parentValue) || 0)) {
           onCommit(size, val);
        }
    };

    return (
          <div className="flex flex-col gap-1">
            <label htmlFor={`qty-${size}`} className="text-xs font-bold text-gray-500 uppercase text-center">{size}</label>
            <input
              id={`qty-${size}`}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              placeholder="0"
              className={cn(
                "w-full p-2 text-center border rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium transition-colors",
                (localValue > 0) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            />
          </div>
    );
}
