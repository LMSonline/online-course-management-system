  "use client";
  
 

import React from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import type { EnrollmentResponse } from "@/services/enrollment/enrollment.service";
import type { CourseResponse } from "@/services/courses/course.types";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/core/components/learner/dashboard/DashboardHeader";
import { DashboardStatsRow } from "@/core/components/learner/dashboard/DashboardStatsRow";
import { MyCoursesSection } from "@/core/components/learner/dashboard/MyCoursesSection";
import { RecommendedCarousel } from "@/core/components/learner/dashboard/RecommendedCarousel";
import { courseReviewService } from "@/services/courses/course-review.service";

 // Helper: map difficulty to level
  function mapDifficultyToLevel(difficulty?: string): "Beginner" | "Intermediate" | "Advanced" {
    if (difficulty === "BEGINNER") return "Beginner";
    if (difficulty === "INTERMEDIATE") return "Intermediate";
    if (difficulty === "ADVANCED") return "Advanced";
    return "Beginner";
  }

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

  // Lấy danh sách enrollment
  const { data, isLoading, error } = useStudentEnrollments({
    studentId,
    page,
    size,
  });
  const enrollments = data?.items || [];
  const enrolledCourseIds = new Set(enrollments.map((e: EnrollmentResponse) => e.courseId));

  // Lấy danh sách tất cả khóa học active
  const { data: allCoursesData, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["active-courses"],
    queryFn: () => courseService.getCoursesActive({ page: 0, size: 100 }),
  });
  const allCourses: CourseResponse[] = (allCoursesData && 'items' in allCoursesData && Array.isArray(allCoursesData.items))
    ? allCoursesData.items
    : [];
  const unenrolledCourses: CourseResponse[] = allCourses.filter(
    (course) => !enrolledCourseIds.has(course.id)
  );

  // Map CourseResponse to MyCourse (fetch rating trung bình)
  const [recommendedCourses, setRecommendedCourses] = React.useState<MyCourse[]>([]);
  React.useEffect(() => {
    async function fetchRecommended() {
      const mapped = await Promise.all(
        unenrolledCourses.map(async (c) => {
          let rating = 0;
          try {
            const summary = await courseReviewService.getRatingSummary(c.id);
            rating = summary.averageRating || 0;
          } catch {}
          return {
            id: String(c.id),
            slug: c.slug,
            title: c.title,
            instructor: c.teacherName || 'Unknown',
            thumbColor: 'from-emerald-500 via-sky-500 to-indigo-500',
            thumbnailUrl: c.thumbnailUrl,
            progress: 0,
            lastViewed: 'New',
            level: mapDifficultyToLevel(c.difficulty),
            category: c.categoryName || 'General',
            rating,
          };
        })
      );
      setRecommendedCourses(mapped);
    }
    if (unenrolledCourses.length > 0) fetchRecommended();
    else setRecommendedCourses([]);
  }, [unenrolledCourses]);
  // Map EnrollmentResponse to MyCourse
  function mapEnrollmentToMyCourse(e: EnrollmentResponse): MyCourse {
    return {
      id: String(e.id),
      slug: e.courseTitle.toLowerCase().replace(/ /g, '-'),
      title: e.courseTitle,
      instructor: e.studentName || 'Unknown',
      thumbColor: 'from-emerald-500 via-sky-500 to-indigo-500',
      progress: e.completionPercentage,
      lastViewed: e.startAt ? new Date(e.startAt).toLocaleString() : 'Unknown',
      level: 'Beginner',
      category: 'Web Development',
      rating: e.averageScore || 0,
    };
  }

  // recommendedCourses đã được fetch ở trên
  const myCourses: MyCourse[] = enrollments.map(mapEnrollmentToMyCourse);

  if (isLoading || isCoursesLoading) {
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
