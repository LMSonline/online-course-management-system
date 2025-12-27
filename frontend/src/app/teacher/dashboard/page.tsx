import { Suspense } from "react";
import { TeacherDashboardHeader } from "@/core/components/teacher/dashboard/TeacherDashboardHeader";
import {
  DashboardStatsSection,
  DashboardChartsSection,
  DashboardQuickSection,
  DashboardTableSection
} from "@/core/components/teacher/dashboard/async-sections";
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton
} from "@/core/components/teacher/skeletons";

export default async function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl p-6 space-y-6">
        <TeacherDashboardHeader name="Teacher" />

        <Suspense fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        }>
          <DashboardStatsSection />
        </Suspense>

        <Suspense fallback={
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        }>
          <DashboardChartsSection />
        </Suspense>

        <Suspense fallback={
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
              <div className="h-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            </div>
          </div>
        }>
          <DashboardQuickSection />
        </Suspense>

        <Suspense fallback={<TableSkeleton rows={5} />}>
          <DashboardTableSection />
        </Suspense>
      </div>
    </div>
  );
}
