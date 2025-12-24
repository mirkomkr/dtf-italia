import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function StepNavigation({ currentStep, steps, onStepClick, isStepCompleted }) {
  // steps: array of objects { id: 1, label: 'Configura' }
  const defaultSteps = [
    { id: 1, label: 'Configura' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Checkout' }
  ];
  
  const actualSteps = steps || defaultSteps;

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
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-100" 
                    : (isPast ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400")
                )}>
                  {isPast ? <Check className="w-5 h-5"/> : step.id}
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  isActive ? "text-indigo-700" : "text-gray-500"
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
