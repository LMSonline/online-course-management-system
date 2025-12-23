import { Check } from 'lucide-react';

type StepType = {
  number: number;
  title: string;
  icon: React.ElementType;
};

interface StepProgressProps {
  steps: StepType[];
  currentStep: number;
  isStepComplete: (step: number) => boolean;
}

export default function StepProgress({ steps, currentStep, isStepComplete }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep === step.number
                ? 'bg-[#00ff00] border-[#00ff00] text-black'
                : currentStep > step.number || !!isStepComplete(step.number)
                ? 'bg-green-900/30 border-green-400 text-green-400'
                : 'bg-[#1a2237] border-gray-700 text-gray-500'
            }`}>
              {currentStep > step.number || !!isStepComplete(step.number) ? (
                <Check className="w-6 h-6" />
              ) : (
                <step.icon className="w-6 h-6" />
              )}
            </div>
            <div className="mt-3 text-center">
              <div className={`text-sm font-medium ${
                currentStep === step.number ? 'text-[#00ff00]' : 'text-gray-400'
              }`}>
                Step {step.number}
              </div>
              <div className={`text-xs mt-1 ${
                currentStep === step.number ? 'text-white' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-4 -mt-10 ${
              currentStep > step.number ? 'bg-green-400' : 'bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}