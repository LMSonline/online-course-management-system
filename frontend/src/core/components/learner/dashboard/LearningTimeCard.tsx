import { Clock3, ListChecks } from "lucide-react";

export function LearningTimeCard() {

  // Set cứng dữ liệu learning time
  const minutes = 75;
  const goal = 120;
  const percent = Math.min(100, Math.round((minutes / goal) * 100));
  const isLoading = false;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-900 px-6 py-6 shadow-lg min-h-[170px] flex flex-col justify-between">
      <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-sky-400/10 blur-2xl" />
      <div className="relative flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-sky-400/20">
            <Clock3 className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-300 mb-1 font-semibold">Learning time</p>
            <p className="text-xl font-bold text-white">
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
      <button className="inline-flex items-center gap-1 text-xs mt-4 text-sky-300 hover:text-sky-100">
        <ListChecks className="w-3 h-3" />
        Set learning reminder
      </button>
    </div>
  );
}