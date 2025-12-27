"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";

/**
 * CreateVersionScreen
 * Route: /courses/:slug/versions/new
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Note: URL uses slug for SEO, but API calls use courseId (derived from course detail)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:slug (COURSE_GET_DETAIL) to get courseId
 * - POST /courses/:courseId/versions (VERSION_CREATE) on submit
 */
export default function CreateVersionScreen({
  params,
}: {
  params: { slug: string };
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
      <h1>CreateVersionScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}, Course ID: {courseId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement VERSION_CREATE mutation with courseId: {courseId}</li>
          <li>Render version creation form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

