// src/app/(instructor)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { InstructorDashboardHeader } from "@/core/components/instructor/dashboard/InstructorDashboardHeader";
import { StatsRow } from "@/core/components/instructor/dashboard/StatsRow";
import { QuickSections } from "@/core/components/instructor/dashboard/QuickSections";
import { TeachingTasks } from "@/core/components/instructor/dashboard/TeachingTasks";
import { CoursesPerformanceTable } from "@/core/components/instructor/dashboard/CoursesPerformanceTable";
import { RecentReviews } from "@/core/components/instructor/dashboard/RecentReviews";
import { RevenueChart } from "@/core/components/instructor/dashboard/RevenueChart";
import { EnrollmentsChart } from "@/core/components/instructor/dashboard/EnrollmentsChart";
import { getInstructorDashboard } from "@/features/instructor/services/instructor.service";
import type { InstructorDashboardData } from "@/features/instructor/types/dashboard.types";

export default function InstructorDashboardPage() {
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const dashboardData = await getInstructorDashboard();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <p className="text-white p-6">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-6">Error: {error}</p>;
  }

  if (!data) {
    return <p className="text-white p-6">No data available</p>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-5 md:space-y-6">
        <InstructorDashboardHeader name="Teacher" />

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
