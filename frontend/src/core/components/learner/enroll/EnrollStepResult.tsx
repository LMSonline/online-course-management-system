import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface EnrollStepResultProps {
  result?: any;
  onReset: () => void;
}

const EnrollStepResult: React.FC<EnrollStepResultProps> = ({ result, onReset }) => {
  const isSuccess = result?.success ?? true;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-900/55">
        {isSuccess ? (
          <CheckCircle className="h-12 w-12 text-emerald-400" />
        ) : (
          <XCircle className="h-12 w-12 text-red-400" />
        )}
      </div>

      <h3 className="mt-5 text-2xl font-semibold text-white">
        {isSuccess ? "You’re enrolled!" : "Payment failed"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-400">
        {isSuccess
          ? "Welcome aboard. You can start learning immediately."
          : "Please try again or choose another payment method."}
      </p>

      <div className="mt-6 w-full space-y-2">
        <button
          onClick={onReset}
          className="w-full rounded-2xl bg-[var(--brand-600)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
        >
          Let's started
        </button>

        <div className="text-[11px] text-slate-500">
          If you need help, contact support.
        </div>
      </div>
    </div>
  );
};

export default EnrollStepResult;
