
import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

export const MeterProgressBar = ({ totalMeters }) => {
  // If undefined or 0, showing empty state
  const current = totalMeters || 0;
  
  // Calculate next integer meter boundary
  // If we are exactly at an integer (e.g. 1.0), the next target is 2.0 to show 'full' meter available
  // If we are at 1.4, next is 2.0.
  const isInteger = Number.isInteger(current);
  const floor = Math.floor(current);
  const nextMultiple = floor + 1;
  
  // Progress within the current meter
  // e.g. 1.4 -> (1.4 - 1.0) / 1.0 * 100 = 40%
  // e.g. 0.8 -> (0.8 - 0.0) / 1.0 * 100 = 80%
  const decimalPart = current - floor;
  const percentage = isInteger && current > 0 ? 100 : Math.round(decimalPart * 100);

  return (
    <div className="w-full bg-slate-100 rounded-lg p-4 shadow-sm border border-slate-200">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-slate-600">
            Utilizzo Bobina
        </span>
        <span className="text-xs text-slate-400">
           {current.toFixed(2)}m / {nextMultiple}.00m
        </span>
      </div>
      
      {/* Bar container */}
      <div className="relative w-full h-6 bg-slate-200 rounded-full overflow-hidden">
        {/* Fill */}
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
            {percentage > 15 && (
                 <span className="text-[10px] text-white font-bold opacity-80">{percentage}%</span>
            )}
        </div>
        
        {/* Optional: segmented markers for 10% blocks (ASCII style simulation) */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
             {[...Array(9)].map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-white/30" />
             ))}
        </div>
      </div>
      
      <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
        <span>{floor}m</span>
        <span>{nextMultiple}m</span>
      </div>
    </div>
  );
};

export const OptimizationNudge = ({ totalMeters, piecesPerRow }) => {
  if (!totalMeters) return null;

  const current = totalMeters;
  const decimalPart = current % 1;
  const isOptimal = decimalPart === 0 || decimalPart > 0.95; // Close enough
  
  // Don't show if optimal
  if (isOptimal) return null;

  const percentageUsed = Math.round(decimalPart * 100);
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 mt-4">
      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-amber-800">Ottimizza la tua stampa!</h4>
        <p className="text-sm text-amber-700 mt-1">
          Stai usando solo il <strong>{percentageUsed}%</strong> del metro lineare corrente. 
          {piecesPerRow > 1 ? ` La bobina è larga 58cm: prova ad aggiungere altri pezzi per riempire lo spazio vuoto e azzerare gli sprechi.` : ` Aggiungi altri pezzi per sfruttare al meglio il prezzo.`}
        </p>
      </div>
    </div>
  );
};

export const TechnicalSpecsBox = () => {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start gap-3 mt-4">
      <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-indigo-900">Specifiche Tecniche</h4>
        <ul className="text-sm text-indigo-800 mt-1 space-y-1 list-disc list-inside">
          <li>File <strong>PNG trasparente</strong> (senza sfondo)</li>
          <li>Risoluzione ideale <strong>300 DPI</strong></li>
          <li>Profilo colore <strong>CMYK</strong> (convertiamo noi se invii RGB)</li>
          <li>Larghezza massima di stampa: <strong>58cm</strong></li>
        </ul>
      </div>
    </div>
  );
};

const DTFVisualizer = ({ totalMeters, piecesPerRow }) => {
  return (
    <div className="w-full">
      <MeterProgressBar totalMeters={totalMeters} />
      <OptimizationNudge totalMeters={totalMeters} piecesPerRow={piecesPerRow} />
      <TechnicalSpecsBox />
    </div>
  );
};

export default DTFVisualizer;
