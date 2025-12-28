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
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      changeColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: BookOpen,
      label: "Active courses",
      value: overview.totalCourses.toString(),
      hint: "Published & visible courses",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      changeColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: DollarSign,
      label: "Revenue (this month)",
      value: `$${overview.monthlyRevenue.toFixed(2)}`,
      hint: "Before tax & platform fees",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      changeColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Star,
      label: "Average rating",
      value: overview.avgRating.toFixed(2),
      hint: "Weighted across all courses",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      changeColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${item.iconBg} rounded-xl`}>
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {item.label}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {item.value}
            </p>
            <p className={`text-xs ${item.changeColor}`}>{item.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
