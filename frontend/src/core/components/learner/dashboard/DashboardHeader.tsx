// src/components/learner/dashboard/DashboardHeader.tsx
import { useAuth } from "@/hooks/useAuth";
import type { MeUser } from "@/services/auth/auth.types";

export function DashboardHeader() {
  const { user, isLoading } = useAuth() as { user: MeUser | null; isLoading: boolean };

  return (
    <header className="mb-8 md:mb-10">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        My learning
      </p>

      <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
        {isLoading ? "Welcome back..." : `Welcome back, ${user?.username ?? "Learner"}`}
      </h1>

      <p className="mt-3 text-sm md:text-[15px] text-slate-300 max-w-3xl">
        Keep building in-demand skills with your active courses. Resume where you
        left off or explore new topics tailored to your goals.
      </p>
    </header>
  );
}
