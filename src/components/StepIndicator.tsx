import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 w-full py-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={index}>
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isActive 
                  ? 'bg-accent text-accent-foreground shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                  : isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {stepNumber}
            </div>
            {index < totalSteps - 1 && (
              <div 
                className={`h-1 w-8 rounded-full transition-all ${
                  isCompleted ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
