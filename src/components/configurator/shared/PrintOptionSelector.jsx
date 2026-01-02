import React from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_OPTIONS = [
    { id: 'none', label: 'Nessuna Stampa' },
    { id: '1_color', label: '1 Colore' },
    { id: '2_colors', label: '2 Colori' },
    { id: 'full_color', label: 'Full Color' },
];

/**
 * CheckIcon - Decorative checkmark for selected state
 */
const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * PrintOptionSelector - Accessible print option selection component.
 * Uses fieldset/legend for semantic grouping and aria-pressed for toggle state.
 * @param {Object} props
 * @param {string} props.frontValue - Selected front print option
 * @param {string} props.backValue - Selected back print option
 * @param {Function} props.onFrontChange - Callback for front selection
 * @param {Function} props.onBackChange - Callback for back selection
 * @param {Array} props.options - Available print options
 * @param {boolean} props.showBack - Whether to show back print options
 * @param {'indigo'|'red'} props.brandColor - Brand color theme
 */
export default function PrintOptionSelector({ 
    frontValue, 
    backValue, 
    onFrontChange, 
    onBackChange, 
    options = DEFAULT_OPTIONS,
    showBack = true,
    brandColor = 'indigo'
}) {
    const isRed = brandColor === 'red';
    
    const brandStyles = {
        red: {
          active: "border-red-600 bg-red-50/50 text-red-900 shadow-sm",
          iconContainer: "bg-red-600",
          hover: "hover:border-red-200 hover:bg-red-50/30",
          focusVisible: "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        },
        indigo: {
          active: "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm",
          iconContainer: "bg-indigo-600",
          hover: "hover:border-indigo-200 hover:bg-indigo-50/30",
          focusVisible: "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        }
    };

    const currentStyle = brandStyles[brandColor] || brandStyles.indigo;

    const renderOption = (value, onChange, legendText, groupId) => (
        <fieldset className="flex-1">
            <legend className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                {legendText} <span className="text-[10px] font-bold text-gray-400 pl-1">(Max 28x38cm)</span>
            </legend>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label={legendText}>
                {options.map((opt) => {
                    const isSelected = value === opt.id;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onChange(opt.id)}
                            aria-pressed={isSelected}
                            className={cn(
                                "relative flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 text-xs font-bold leading-tight outline-none",
                                currentStyle.focusVisible,
                                isSelected 
                                    ? currentStyle.active 
                                    : cn("border-gray-100 bg-white text-gray-500", currentStyle.hover)
                            )}
                        >
                            <span className="text-center">{opt.label}</span>
                            {isSelected && (
                                <div className={cn("absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white p-0.5", currentStyle.iconContainer)}>
                                    <CheckIcon className="w-full h-full" />
                                    <span className="sr-only">Selezionato</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );

    return (
        <div className="space-y-6 pt-6 border-t border-gray-100/50">
            <div className="flex flex-col md:flex-row gap-6">
                {renderOption(frontValue, onFrontChange, "Stampa Fronte", "front-print")}
                {showBack && renderOption(backValue, onBackChange, "Stampa Retro", "back-print")}
            </div>
        </div>
    );
}