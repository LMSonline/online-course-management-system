"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useCourseReviews } from "@/hooks/admin/useCourseReviews";
import { RatingSummaryResponse } from "@/services/courses/course.types";

interface CourseReviewsProps {
  courseId: number;
  ratingSummary?: RatingSummaryResponse;
}

export function CourseReviews({ courseId, ratingSummary }: CourseReviewsProps) {
  const [page, setPage] = useState(1);
  const size = 10;

  const { data, isLoading, isError } = useCourseReviews(courseId, page, size);

  const reviews = data?.items || [];
  const totalPages = data?.totalPages || 1;

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-600 text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // Render rating distribution
  const renderRatingDistribution = () => {
    if (!ratingSummary || !ratingSummary.ratingDistribution) return null;

    const total = ratingSummary.totalReviews || 1;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingSummary.ratingDistribution[rating] || 0;
          const percentage = (count / total) * 100;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-slate-300 w-16">
                {rating} stars
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      {/* Rating Summary */}
      {ratingSummary && (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Student Ratings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-amber-400 mb-2">
                {ratingSummary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(Math.round(ratingSummary.averageRating))}
              </div>
              <p className="text-sm text-slate-400">
                {ratingSummary.totalReviews} ratings
              </p>
            </div>

            {/* Rating Distribution */}
            <div>{renderRatingDistribution()}</div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Reviews</h3>

        {isLoading ? (
          <div className="rounded-xl bg-slate-900/40 h-32 flex items-center justify-center text-slate-400 text-sm">
            Loading reviews...
          </div>
        ) : isError ? (
          <div className="rounded-xl bg-slate-900/40 h-32 flex items-center justify-center text-red-400 text-sm">
            Failed to load reviews.
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl bg-slate-900/40 h-32 flex items-center justify-center text-slate-400 text-sm">
            No reviews yet. Be the first to review this course!
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-900/60 border border-white/10 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {review.avatarUrl ? (
                        <img
                          src={review.avatarUrl}
                          alt={review.username || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {(review.username || "A")[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-200">
                            {review.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-slate-100 mb-2">
                          {review.title}
                        </h4>
                      )}

                      {review.content && (
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {review.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-slate-300">
                  Page {page} / {totalPages}
                </span>
                <button
                  className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
