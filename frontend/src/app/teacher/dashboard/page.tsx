// src/app/teacher/dashboard/page.tsx
"use client";

import { TeacherDashboardHeader } from "@/core/components/teacher/dashboard/TeacherDashboardHeader";
import { StatsRow } from "@/core/components/teacher/dashboard/StatsRow";
import { QuickSections } from "@/core/components/teacher/dashboard/QuickSections";
import { TeachingTasks } from "@/core/components/teacher/dashboard/TeachingTasks";
import { CoursesPerformanceTable } from "@/core/components/teacher/dashboard/CoursesPerformanceTable";
import { RecentReviews } from "@/core/components/teacher/dashboard/RecentReviews";
import { RevenueChart } from "@/core/components/teacher/dashboard/RevenueChart";
import { EnrollmentsChart } from "@/core/components/teacher/dashboard/EnrollmentsChart";
import { TEACHER_DASHBOARD_MOCK } from "@/lib/teacher/dashboard/types";

export default function TeacherDashboardPage() {
  const data = TEACHER_DASHBOARD_MOCK;

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-5 md:space-y-6">
        <TeacherDashboardHeader name="Teacher" />

        <StatsRow overview={data.overview} />

        {/* 🔥 Biểu đồ doanh thu & học viên */}
        <div className="grid gap-4 lg:grid-cols-2">
          <RevenueChart data={data.revenueHistory} />
          <EnrollmentsChart data={data.enrollmentByCourse} />
        </div>

        {/* Quick sections + tasks + reviews */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <QuickSections sections={data.quickSections} />
          <div className="space-y-4">
            <TeachingTasks tasks={data.tasks} />
            <RecentReviews reviews={data.reviews} />
          </div>
        </div>

        {/* Course performance table */}
        <CoursesPerformanceTable courses={data.courses} />
      </section>
    </main>
  );
}
