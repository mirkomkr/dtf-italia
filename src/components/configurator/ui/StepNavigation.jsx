'use client';

import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Configura', short: '1' },
    { id: 2, label: 'Riepilogo', short: '2' },
    { id: 3, label: 'Upload File', short: '3' },
];

export default function StepNavigation({ currentStep, color = '#6366f1' }) {
    return (
        <div className="flex items-center justify-between relative mb-8 px-2">
            {/* Connecting Line background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
            
            {/* Active Line (Progress) */}
            <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-current transition-all duration-500 ease-out -z-10 rounded-full"
                style={{ 
                    width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                    color 
                }}
            />

            {STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isPending = currentStep < step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                        <div 
                            className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-all duration-300 z-10 bg-white
                                ${isCompleted ? 'border-transparent text-white' : ''}
                                ${isCurrent ? 'border-current scale-110 shadow-lg' : ''}
                                ${isPending ? 'border-gray-200 text-gray-400' : ''}
                            `}
                            style={{ 
                                backgroundColor: isCompleted ? color : 'white',
                                borderColor: isCurrent ? color : undefined,
                                color: isCurrent ? color : (isCompleted ? 'white' : undefined)
                            }}
                        >
                            {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : step.short}
                        </div>
                        <span 
                            className={`
                                text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white px-1 transition-colors duration-300
                                ${isCurrent ? 'text-gray-900' : 'text-gray-400'}
                            `}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
