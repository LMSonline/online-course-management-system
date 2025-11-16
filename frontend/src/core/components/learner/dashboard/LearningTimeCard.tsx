// src/components/learner/dashboard/LearningTimeCard.tsx
import { Clock3, ListChecks } from "lucide-react";

export function LearningTimeCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 md:px-5 md:py-5">
      <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-sky-500/15 blur-2xl" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-white/10">
            <Clock3 className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Learning time
            </p>
            <p className="text-lg font-semibold">
              0 / 30{" "}
              <span className="text-sm font-medium text-slate-400">mins this week</span>
            </p>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Weekly goal</span>
            <span>0%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-[8%] rounded-full bg-[var(--brand-600)]" />
          </div>
        </div>
        <button className="inline-flex items-center gap-1 text-xs mt-1 text-[var(--brand-300)] hover:text-[var(--brand-100)]">
          <ListChecks className="w-3 h-3" />
          Set learning reminder
        </button>
      </div>
    </div>
  );
}
