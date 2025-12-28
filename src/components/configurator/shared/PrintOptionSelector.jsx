import React from 'react';

const DEFAULT_OPTIONS = [
    { id: 'none', label: 'Nessuna Stampa' },
    { id: '1_color', label: '1 Colore' },
    { id: '2_colors', label: '2 Colori' },
    { id: 'full_color', label: 'Full Color' },
];

export default function PrintOptionSelector({ 
    frontValue, 
    backValue, 
    onFrontChange, 
    onBackChange, 
    options = DEFAULT_OPTIONS 
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <label htmlFor="front-print" className="block text-sm font-semibold text-gray-700 mb-2">
               Stampa Fronte <span className="text-xs font-normal text-gray-500">(Max 28x38cm)</span>
            </label>
            <select
              id="front-print"
              value={frontValue}
              onChange={(e) => onFrontChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
         </div>
         <div>
            <label htmlFor="back-print" className="block text-sm font-semibold text-gray-700 mb-2">
               Stampa Retro <span className="text-xs font-normal text-gray-500">(Max 28x38cm)</span>
            </label>
            <select
              id="back-print"
              value={backValue}
              onChange={(e) => onBackChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
         </div>
       </div>
    </div>
  );
}