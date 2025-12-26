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
        {sizes.map((size) => {
            // Local state is technically handled by uncontrolled inputs via defaultValue + key reuse, 
            // OR fully controlled local state. Given the requirement to only update on blur,
            // we will use an internal component or just a controlled input that only calls onQuantityChange on Blur.
            // Using uncontrolled input with defaultValue approach is simplest for performance but sync issues can occur if parent changes props.
            // Let's use a simple controlled input wrapper to keep code clean.
            return (
              <SizeInput 
                key={size} 
                size={size} 
                parentValue={quantities[size]} 
                onCommit={onQuantityChange} 
              />
            );
        })}
      </div>
      <p className="text-right text-xs text-gray-500 mt-2">
        Totale Capi: <strong className="text-indigo-600">{Object.values(quantities).reduce((a, b) => a + (parseInt(b) || 0), 0)}</strong>
      </p>
    </div>
  );
}

// Inner component for individual input performance
function SizeInput({ size, parentValue, onCommit }) {
    const [localValue, setLocalValue] = React.useState(parentValue > 0 ? parentValue : '');

    // Sync if parent updates externally (e.g. reset)
    React.useEffect(() => {
        setLocalValue(parentValue > 0 ? parentValue : '');
    }, [parentValue]);

    const handleBlur = () => {
        const val = parseInt(localValue) || 0;
        // Only trigger update if different from parent (conceptually)
        // Check performed by parent usually, but we call commit here.
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
              // Input Mode for mobile
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
      </div>
      <p className="text-right text-xs text-gray-500 mt-2">
        Totale Capi: <strong className="text-indigo-600">{Object.values(quantities).reduce((a, b) => a + (parseInt(b) || 0), 0)}</strong>
      </p>
    </div>
  );
}
