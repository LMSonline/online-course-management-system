"use client";
// src/app/(learner)/dashboard/page.tsx
import { DashboardHeader } from "@/core/components/learner/dashboard/DashboardHeader";
import { DashboardStatsRow } from "@/core/components/learner/dashboard/DashboardStatsRow";
import MyCoursesSection from "@/core/components/learner/dashboard/MyCoursesSection";
// import { MOCK_COURSES, RECOMMENDED_COURSES, } from "@/lib/learner/dashboard/types";
import { useCourses } from "@/hooks/learner/useCourse";
import { useAuth } from "@/hooks/useAuth";
import { RecommendedCarousel } from "@/core/components/learner/dashboard/RecommendedCarousel";


export default function LearnerDashboardPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <DashboardHeader />
        <DashboardStatsRow />
        <MyCoursesSection/>
        {/* Recommended courses: lấy 12 khoá học chưa đăng ký */}
        <RecommendedCarousel />
      </section>
    </main>
  );
}

