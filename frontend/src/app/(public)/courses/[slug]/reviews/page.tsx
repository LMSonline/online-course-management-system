"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseReviews } from "@/hooks/public/useCourseReviews";
import { useCourseRatingSummary } from "@/hooks/public/useCourseRatingSummary";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft, AlertCircle } from "lucide-react";

/**
 * CourseReviewsPublicScreen
 * Route: /courses/:slug/reviews
 * Layout: PublicLayout
 * Guard: none
 * 
 * Shows public course reviews with:
 * - Rating summary (average, distribution)
 * - Reviews list with pagination
 */
export default function CourseReviewsPublicScreen({
  params,
}: {
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "20");

  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
  } = useCourseDetail(params.slug);

  const courseId = course?.id;

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isReviewsError,
  } = useCourseReviews(courseId, page, size);

  // Fetch rating summary
  const {
    data: ratingSummary,
  } = useCourseRatingSummary(courseId);

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-8" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
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
          <Link
            href="/courses"
            className="text-[var(--brand-600)] hover:underline"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.content || [];
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
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold mb-2">Reviews for {course.title}</h1>
          {course && (
            <Link
              href={`/courses/${params.slug}/reviews/new`}
              className="px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
            >
              Write a Review
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Rating Summary */}
        <div className="md:col-span-1">
          <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 sticky top-4">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${
                      rating <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="text-gray-400 text-sm">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>

            {/* Rating Distribution */}
            {Object.keys(ratingDistribution).length > 0 && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="md:col-span-2">
          {isLoadingReviews ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
          ) : isReviewsError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Failed to load reviews</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-slate-900/40 border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {review.avatarUrl ? (
                          <img
                            src={review.avatarUrl}
                            alt={review.username || "User"}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {(review.username || "U")[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">
                            {review.username || "Anonymous"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-4 w-4 ${
                              rating <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <h3 className="font-semibold mb-2">{review.title}</h3>
                    )}
                    {review.content && (
                      <p className="text-gray-300 whitespace-pre-wrap">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {reviewsData && reviewsData.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {page > 0 && (
                    <Link
                      href={`/courses/${params.slug}/reviews?page=${page - 1}&size=${size}`}
                      className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: reviewsData.totalPages }, (_, i) => (
                    <Link
                      key={i}
                      href={`/courses/${params.slug}/reviews?page=${i}&size=${size}`}
                      className={`px-4 py-2 rounded-lg ${
                        i === page
                          ? "bg-[var(--brand-600)] text-white"
                          : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                  {page < reviewsData.totalPages - 1 && (
                    <Link
                      href={`/courses/${params.slug}/reviews?page=${page + 1}&size=${size}`}
                      className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
