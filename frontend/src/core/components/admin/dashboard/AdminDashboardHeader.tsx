// src/core/components/admin/dashboard/AdminDashboardHeader.tsx
import type { AdminOverview } from "@/lib/admin/types";

type Props = {
  overview: AdminOverview;
};

export function AdminDashboardHeader({ overview }: Props) {
  return (
    <header className="mb-5 md:mb-6">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Admin dashboard
      </p>

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            System overview
          </h1>
          <p className="mt-2 text-sm md:text-[15px] text-slate-300 max-w-2xl">
            Monitor users, courses, revenue and general health of the LMS
            platform.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-xs">
          <p className="text-slate-400 mb-1">System status</p>
          <p className="flex items-center gap-2 text-slate-100 font-medium">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                overview.systemHealth === "Healthy"
                  ? "bg-emerald-400"
                  : overview.systemHealth === "Degraded"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
            />
            {overview.systemHealth}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            No critical incidents detected in the last 24 hours.
          </p>
        </div>
      </div>
    </header>
  );
}
