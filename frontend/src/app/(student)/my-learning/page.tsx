"use client";

import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import type { EnrollmentResponse } from "@/services/enrollment/enrollment.service";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/core/components/learner/dashboard/DashboardHeader";
import { DashboardStatsRow } from "@/core/components/learner/dashboard/DashboardStatsRow";
import { MyCoursesSection } from "@/core/components/learner/dashboard/MyCoursesSection";
import { RecommendedCarousel } from "@/core/components/learner/dashboard/RecommendedCarousel";

/**
 * MyEnrollmentsScreen
 * Route: /my-learning
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Data:
 * - ENROLLMENT_GET_STUDENT_LIST (requires studentId from authStore)
 */
export default function MyEnrollmentsScreen() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const page = pageParam ? parseInt(pageParam, 10) - 1 : 0;
  const size = sizeParam ? parseInt(sizeParam, 10) : 20;
  const { studentId } = useAuthStore();
  const { data, isLoading, error } = useStudentEnrollments({
    studentId,
    page,
    size,
  });

  const enrollments = data?.items || [];
  function mapEnrollmentToMyCourse(e: EnrollmentResponse): MyCourse {
    return {
      id: String(e.id),
      slug: e.courseTitle.toLowerCase().replace(/ /g, '-'),
      title: e.courseTitle,
      instructor: e.studentName || 'Unknown',
      thumbColor: 'from-emerald-500 via-sky-500 to-indigo-500', // customize as needed
      progress: e.completionPercentage,
      lastViewed: 'Recently',
      level: 'Beginner', // or map from backend if available
      category: 'Web Development', // or map from backend if available
      rating: e.averageScore || 0,
    };
  }
  const myCourses = enrollments.map(mapEnrollmentToMyCourse);
  const recommendedCourses = myCourses.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading your courses...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error loading enrollments
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <DashboardHeader />
        <DashboardStatsRow />
        <MyCoursesSection courses={myCourses} />
        <RecommendedCarousel courses={recommendedCourses} />
      </section>
    </main>
  );
}
