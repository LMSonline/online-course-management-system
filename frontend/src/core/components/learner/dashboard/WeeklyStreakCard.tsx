// src/components/learner/dashboard/WeeklyStreakCard.tsx


import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";

export function WeeklyStreakCard() {
  const { data: streak, isLoading } = useStreak();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 md:px-5 md:py-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--brand-600)]/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border border-[var(--brand-600)]/60">
          <div className="absolute inset-1 rounded-full border border-[var(--brand-600)]/60 border-t-transparent animate-spin-slow" />
          <Flame className="w-5 h-5 text-[var(--brand-400)]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Daily streak</p>
          <p className="text-lg font-semibold">
            {isLoading ? "..." : streak ?? 0} <span className="text-sm font-medium text-slate-400">ngày liên tiếp</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Đăng nhập mỗi ngày để duy trì streak của bạn!
          </p>
        </div>
      </div>
    </div>
  );
}
