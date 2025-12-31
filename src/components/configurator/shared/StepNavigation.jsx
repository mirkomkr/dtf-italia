'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function StepNavigation({ currentStep, steps, onStepClick, isStepCompleted, brandColor = 'indigo' }) {
  
  // 1. Definiamo i passi di default (fondamentale per non avere errori)
  const defaultSteps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Checkout' }
  ];
  
  const actualSteps = steps || defaultSteps;

  // 2. Mappa dei colori (Molto pulita!)
  const colorMap = {
    red: {
      bg: 'bg-red-600 ring-red-100',
      text: 'text-red-700'
    },
    indigo: {
      bg: 'bg-indigo-600 ring-indigo-100',
      text: 'text-indigo-700'
    }
  };

  // Selezioniamo il tema in base alla prop
  const theme = colorMap[brandColor] || colorMap.indigo;

  return (
    <nav className="flex justify-between mb-8 border-b border-gray-100 pb-4 flex-shrink-0 w-full">
      <ol className="flex justify-between w-full m-0 p-0 list-none">
        {actualSteps.map((step) => {
          const isClickable = step.id < currentStep || isStepCompleted || step.id === currentStep;
          const isActive = currentStep === step.id;
          const isPast = step.id < currentStep;

          return (
            <li key={step.id}>
              <button
                onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center bg-transparent border-none p-0 transition-all focus:outline-none",
                  isClickable ? "cursor-pointer hover:opacity-75" : "cursor-default opacity-50"
                )}
              >
                {/* IL CERCHIO CON IL NUMERO */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm",
                  isActive 
                    ? `${theme.bg} text-white shadow-md ring-2` 
                    : (isPast ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400")
                )}>
                  {isPast ? <CheckIcon className="w-5 h-5"/> : step.id}
                </div>

                {/* LA SCRITTA SOTTO */}
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors",
                  isActive ? theme.text : "text-gray-500"
                )}>
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}