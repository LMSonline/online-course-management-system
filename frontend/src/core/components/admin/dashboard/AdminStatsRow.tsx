// src/core/components/admin/dashboard/AdminStatsRow.tsx
import { Users, BookOpen, UserCircle2, DollarSign } from "lucide-react";
import type { AdminOverview } from "@/lib/admin/types";

type Props = {
  overview: AdminOverview;
};

export function AdminStatsRow({ overview }: Props) {
  const items = [
    {
      icon: Users,
      label: "Total users",
      value: (overview?.totalUsers ?? 0).toLocaleString(),
      hint: `${(overview?.learners ?? 0).toLocaleString()} learners · ${overview?.teachers ?? 0
        } teachers`,
    },
    {
      icon: BookOpen,
      label: "Courses",
      value: (overview?.activeCourses ?? 0).toString(),
      hint: `${overview?.pendingCourses ?? 0} pending approval`,
    },
    {
      icon: DollarSign,
      label: "Revenue (this month)",
      value: `$${(overview?.monthlyRevenue ?? 0).toFixed(2)}`,
      hint: "Before tax & platform fees",
    },
    {
      icon: UserCircle2,
      label: "Active teachers",
      value: (overview?.teachers ?? 0).toString(),
      hint: "With at least one active course",
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
            <p className="text-[11px] text-slate-500">{item.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
