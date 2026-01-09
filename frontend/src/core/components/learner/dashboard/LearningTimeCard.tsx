// src/components/learner/dashboard/LearningTimeCard.tsx
import { Clock3, ListChecks } from "lucide-react";
import { useAuthStore } from "@/lib/auth/authStore";
import { useLearningTime } from "@/hooks/useLearningTime";


export function LearningTimeCard() {
  const { studentId } = useAuthStore();
  const userId = studentId ? String(studentId) : undefined;
  const { data, isLoading } = useLearningTime(userId || "");
  const minutes = data?.week_minutes ?? 0;
  const goal = data?.week_goal ?? 120;
  const percent = Math.min(100, Math.round((minutes / goal) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-6 md:px-6 md:py-7 flex flex-col min-h-[170px] justify-between">
      <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-sky-500/15 blur-2xl" />
      <div className="relative flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-white/10">
            <Clock3 className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Learning time</p>
            <p className="text-xl font-bold">
              {isLoading ? "..." : `${minutes} / ${goal}`}
              <span className="text-sm font-medium text-slate-400 ml-1">mins this week</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
            <span>Weekly goal</span>
            <span>{isLoading ? "..." : `${percent}%`}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
      <button className="inline-flex items-center gap-1 text-xs mt-4 text-[var(--brand-300)] hover:text-[var(--brand-100)]">
        <ListChecks className="w-3 h-3" />
        Set learning reminder
      </button>
    </div>
  );
}
