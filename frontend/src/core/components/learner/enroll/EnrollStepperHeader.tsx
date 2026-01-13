import React from "react";
import { Check } from "lucide-react";

export type EnrollStep = "course" | "payment" | "result";

const steps: { key: EnrollStep; label: string }[] = [
  { key: "course", label: "Course" },
  { key: "payment", label: "Payment" },
  { key: "result", label: "Done" },
];

export default function EnrollStepperHeader({ step }: { step: EnrollStep }) {
  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const active = idx === currentIndex;
          const done = idx < currentIndex;

          return (
            <div key={s.key} className="flex flex-1 items-center gap-3">
              <div className="relative">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition
                  ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                      ? "bg-[var(--brand-600)] text-white shadow-[0_0_18px_rgba(34,197,94,0.25)]"
                      : idx < currentIndex
                      ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {done ? <Check size={14} /> : idx + 1}
                </div>
              </div>

              <div className="min-w-0">
                <div
                  className={`text-sm ${
                    active
                      ? "text-white font-semibold"
                      : done
                      ? "text-emerald-300 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {s.label}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block h-px flex-1 bg-slate-700/60" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
