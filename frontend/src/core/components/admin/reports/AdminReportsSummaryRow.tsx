// src/core/components/admin/reports/AdminReportsSummaryRow.tsx
import type { SystemReportSummary } from "@/lib/admin/types";
import { DollarSign, Users, CheckCircle2, Star } from "lucide-react";

type Props = {
  summary: SystemReportSummary;
};

export function AdminReportsSummaryRow({ summary }: Props) {
  const items = [
    {
      icon: DollarSign,
      label: "Total revenue (all time)",
      value: `$${summary.totalRevenueAllTime.toLocaleString()}`,
    },
    {
      icon: Users,
      label: "Total enrollments",
      value: summary.totalEnrollments.toLocaleString(),
    },
    {
      icon: CheckCircle2,
      label: "Average completion rate",
      value: `${summary.avgCompletionRate.toFixed(1)}%`,
    },
    {
      icon: Star,
      label: "Average course rating",
      value: summary.avgCourseRating.toFixed(2),
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-400">
                {item.label}
              </p>
              <div className="h-8 w-8 rounded-xl bg-[var(--brand-600)]/15 flex items-center justify-center text-[var(--brand-200)]">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-50">
              {item.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
