"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";

/**
 * ChapterManageScreen
 * Route: /courses/:slug/versions/:versionId/chapters
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Note: URL uses slug for SEO, but API calls use courseId (derived from course detail)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:slug (COURSE_GET_DETAIL) to get courseId
 * - GET /courses/:courseId/versions/:versionId/chapters (CHAPTER_GET_LIST)
 */
export default function ChapterManageScreen({
  params,
}: {
  params: { slug: string; versionId: string };
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
      <h1>ChapterManageScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}, Course ID: {courseId}, Version ID: {params.versionId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement CHAPTER_GET_LIST query with courseId: {courseId}, versionId: {params.versionId}</li>
          <li>Render chapters management</li>
          <li>Add create/edit/delete/reorder functionality</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

