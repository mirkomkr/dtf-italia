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
      text: 'text-indigo-600'
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
                  "flex flex-col items-center bg-transparent border-none p-0 transition-all focus:outline-none group", // Aggiunto 'group'
                  isClickable ? "cursor-pointer" : "cursor-default opacity-50"
                )}
              >
                {/* IL CERCHIO: Il cuore della Brand Identity */}
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isActive 
                    ? `${theme.bg} text-white shadow-md ring-2 ring-offset-2 ring-offset-white` // 'ring-offset' per pulizia
                    : (isPast ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"),
                  isClickable && !isActive && "group-hover:scale-110" // Feedback al passaggio del mouse
                )}>
                  {isPast ? <CheckIcon className="w-5 h-5"/> : step.id}
                </div>

                {/* LA SCRITTA: Nota come manteniamo il nero/grigio per accessibilità */}
                <span className={cn(
                  "text-[10px] uppercase tracking-wider mt-2 font-bold transition-colors duration-300",
                  isActive ? theme.text : "text-gray-600"
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