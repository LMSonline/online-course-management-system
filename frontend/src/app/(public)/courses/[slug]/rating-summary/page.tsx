"use client";

import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseRatingSummary } from "@/hooks/public/useCourseRatingSummary";
import { Loader2, ArrowLeft, AlertCircle, Star } from "lucide-react";

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

  // Fetch rating summary
  const {
    data: ratingSummary,
    isLoading: isLoadingRating,
    isError: isRatingError,
    error: ratingError,
    refetch: refetchRating,
  } = useCourseRatingSummary(courseId);

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {courseError?.message || "The course you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => refetchCourse()}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const averageRating = ratingSummary?.averageRating || 0;
  const totalReviews = ratingSummary?.totalReviews || 0;
  const ratingDistribution = ratingSummary?.ratingDistribution || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${params.slug}`}
          className="inline-flex items-center gap-2 text-[var(--brand-600)] hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
        <h1 className="text-3xl font-bold mb-2">Rating Summary</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Course: {course.title}
        </p>
      </div>

      {/* Rating Summary */}
      {isLoadingRating ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-600)]" />
        </div>
      ) : isRatingError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load rating summary</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {ratingError?.message || "An error occurred while loading rating summary."}
          </p>
          <button
            onClick={() => refetchRating()}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-8 w-8 ${
                    rating <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-400">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>

          {/* Rating Distribution */}
          {Object.keys(ratingDistribution).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {totalReviews === 0 && (
            <div className="text-center py-8 text-gray-400">
              No ratings yet for this course.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
