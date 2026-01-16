"use client";

import { Star } from "lucide-react";
import {
  usePublicReviews,
  usePublicRatingSummary,
} from "@/hooks/learner/useReview";

interface Props {
  courseId: number;
}

export function CourseReviewsSection({ courseId }: Props) {
  const { data: ratingSummary, isLoading: loadingSummary } =
    usePublicRatingSummary(courseId);

  const { data: reviewsData, isLoading: loadingReviews } =
    usePublicReviews(courseId, { page: 0, size: 5 });

  if (loadingSummary || loadingReviews) {
    return <div className="text-slate-400">Loading reviews...</div>;
  }

  return (
    <section className="mt-10 space-y-6">
      {/* ===== Rating summary ===== */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="text-xl font-bold mb-3">Student Reviews</h2>

        <div className="flex items-center gap-4">
          <div className="text-4xl font-extrabold text-white">
            {ratingSummary?.averageRating?.toFixed(1) ?? "0.0"}
          </div>

          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(ratingSummary?.averageRating ?? 0)
                      ? "text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {ratingSummary?.totalReviews ?? 0} reviews
            </p>
          </div>
        </div>
      </div>

      {/* ===== Review list ===== */}
      <div className="space-y-4">
        {reviewsData?.items?.length ? (
          reviewsData.items.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-white/10 bg-slate-950/70 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white">
                  {review.username || "Anonymous"}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {review.content && (
                <p className="text-sm text-slate-300">
                  {review.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-sm">
            No reviews yet.
          </div>
        )}
      </div>
    </section>
  );
}
