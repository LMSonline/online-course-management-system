"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { CourseCardSkeletonGrid } from "@/core/components/ui/CourseCardSkeleton";
import { EmptyState, ErrorState } from "@/core/components/ui/EmptyState";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * CourseRatingSummaryScreen
 * Route: /courses/:slug/rating-summary
 * Layout: PublicLayout
 * Guard: none
 * 
 * Flow:
 * 1. Get course detail by slug (COURSE_GET_DETAIL) to extract courseId
 * 2. Call REVIEW_GET_RATING_SUMMARY with courseId
 */
export default function CourseRatingSummaryScreen({
  params,
}: {
  params: { slug: string };
}) {
  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = useCourseDetail(params.slug);

  const courseId = course?.id;

  // TODO: Implement REVIEW_GET_RATING_SUMMARY hook
  // const { data: ratingSummary, isLoading: isLoadingRating, ... } = useCourseRatingSummary({
  //   courseId,
  // });

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-8" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  if (isCourseError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={courseError?.message || "Failed to load course"}
          onRetry={() => refetchCourse()}
        />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist."
        />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message="Course data incomplete. Missing course ID."
          onRetry={() => refetchCourse()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rating Summary</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Course: {course.title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Course ID: {courseId} (from slug: {params.slug})
        </p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REVIEW_GET_RATING_SUMMARY query with courseId: {courseId}</li>
          <li>Render rating summary (average, distribution, etc.)</li>
          <li>Handle error states</li>
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Note: API will use courseId ({courseId}) internally, but URL uses slug ({params.slug}) for SEO.
        </p>
      </div>
    </div>
  );
}
