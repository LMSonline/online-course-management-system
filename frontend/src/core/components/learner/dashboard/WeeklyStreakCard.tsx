// src/components/learner/dashboard/WeeklyStreakCard.tsx


import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";



export function WeeklyStreakCard() {
  const { data: streak, isLoading } = useStreak();
  const streakCount = isLoading ? 0 : streak ?? 0;
  const hasStreak = streakCount > 0;
  const streakGoal = 7;
  const progress = Math.min(streakCount / streakGoal, 1);

  // Styles for active streak
  const cardClass = hasStreak
    ? "relative overflow-hidden rounded-2xl border border-yellow-400/60 bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 shadow-lg px-4 py-6 md:px-5 md:py-7 animate-pulse flex flex-col justify-between min-h-[170px]"
    : "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-6 md:px-5 md:py-7 flex flex-col justify-between min-h-[170px]";
  const flameClass = hasStreak ? "w-5 h-5 text-yellow-400 drop-shadow-glow" : "w-5 h-5 text-[var(--brand-400)]";
  const borderClass = hasStreak ? "border-yellow-400/80" : "border-[var(--brand-600)]/60";
  const spinClass = hasStreak ? "border-yellow-400/80" : "border-[var(--brand-600)]/60";

  return (
    <div className={cardClass}>
      {hasStreak ? (
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-300/40 blur-2xl animate-pulse" />
      ) : (
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--brand-600)]/20 blur-2xl" />
      )}
      <div className="relative flex items-center gap-4">
        <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border ${borderClass}`}>
          <div className={`absolute inset-1 rounded-full border ${spinClass} border-t-transparent animate-spin-slow`} />
          <Flame className={flameClass} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Daily streak</p>
          <p className="text-lg font-semibold">
            {isLoading ? "..." : streakCount}{" "}
            <span className="text-sm font-medium text-slate-400">day{streakCount === 1 ? "" : "s"} in a row</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {hasStreak
              ? "Great job! Keep your learning streak alive by coming back every day."
              : "Log in and learn every day to start your streak!"}
          </p>
        </div>
      </div>
      {/* Progress bar section */}
      <div className="mt-6 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Weekly goal</span>
          <span>{Math.min(streakCount, streakGoal)} / {streakGoal} days</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={
              hasStreak
                ? "h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 transition-all duration-500"
                : "h-full rounded-full bg-[var(--brand-600)]/80 transition-all duration-500"
            }
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
