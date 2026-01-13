import { Flame } from "lucide-react";

export function WeeklyStreakCard() {
  const streakWeeks = 3;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl
      border border-emerald-500/20
      bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900
      px-8 py-6 shadow-xl"
    >
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72
        rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div className="relative flex items-center gap-6">
        {/* Icon */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center
          rounded-full border border-emerald-400/30
          bg-emerald-500/10"
        >
          <Flame className="h-7 w-7 text-emerald-400" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          {/* Label */}
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Weekly streak
          </span>

          {/* Hero number */}
          <div className="flex items-end gap-2 leading-none">
            <span className="text-4xl font-extrabold text-white">
              {streakWeeks}
            </span>
            <span className="pb-1 text-sm font-medium text-emerald-300">
              weeks
            </span>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Complete at least{" "}
            <span className="font-medium text-emerald-300">
              1 lesson each week
            </span>{" "}
            to keep your streak alive.
          </p>
        </div>
      </div>
    </div>
  );
}