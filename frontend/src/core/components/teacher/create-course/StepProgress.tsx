import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StepProgressProps {
    currentStep: number;
    steps: {
        number: number;
        title: string;
        icon: LucideIcon;
    }[];
}

export const StepProgress = ({ currentStep, steps }: StepProgressProps) => {
    return (
        <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700" style={{ width: 'calc(100% - 4rem)', left: '2rem' }}>
                <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
                {steps.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = step.number < currentStep;
                    const isCurrent = step.number === currentStep;

                    return (
                        <div key={step.number} className="flex flex-col items-center">
                            <div
                                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                                        : isCurrent
                                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30 scale-110"
                                            : "bg-slate-200 dark:bg-slate-800"
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-10 h-10 text-white" />
                                ) : (
                                    <Icon
                                        className={`w-10 h-10 ${isCurrent ? "text-white" : "text-slate-400 dark:text-slate-600"
                                            }`}
                                    />
                                )}

                                {/* Step Number Badge */}
                                {!isCompleted && (
                                    <div
                                        className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent
                                                ? "bg-white text-indigo-600"
                                                : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                )}
                            </div>

                            {/* Step Title */}
                            <p
                                className={`mt-4 text-sm font-semibold text-center max-w-[120px] ${isCurrent
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : isCompleted
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                {step.title}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
