"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";

/**
 * CourseEnrollmentsScreen
 * Route: /courses/:slug/enrollments
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Note: URL uses slug for SEO, but API calls use courseId (derived from course detail)
 */
export default function CourseEnrollmentsScreen({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; size?: string };
}) {
  const { data: course, isLoading } = useCourseDetail(params.slug);
  const courseId = course?.id;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Course not found or missing ID</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseEnrollmentsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}, Course ID: {courseId}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ENROLLMENT_GET_COURSE_LIST query with courseId: {courseId}</li>
          <li>Render enrollments list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

