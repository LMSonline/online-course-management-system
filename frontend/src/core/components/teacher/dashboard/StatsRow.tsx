// src/core/components/teacher/dashboard/StatsRow.tsx
import { Users, DollarSign, BookOpen, Star } from "lucide-react";
import type { TeacherOverview } from "@/lib/teacher/dashboard/types";

type Props = {
  overview: TeacherOverview;
};

export function StatsRow({ overview }: Props) {
  const items = [
    {
      icon: Users,
      label: "Total students",
      value: overview.totalStudents.toLocaleString(),
      hint: "All-time enrolled learners",
    },
    {
      icon: BookOpen,
      label: "Active courses",
      value: overview.totalCourses.toString(),
      hint: "Published & visible courses",
    },
    {
      icon: DollarSign,
      label: "Revenue (this month)",
      value: `$${overview.monthlyRevenue.toFixed(2)}`,
      hint: "Before tax & platform fees",
    },
    {
      icon: Star,
      label: "Average rating",
      value: overview.avgRating.toFixed(2),
      hint: "Weighted across all courses",
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
