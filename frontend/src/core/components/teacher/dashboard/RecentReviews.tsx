// src/core/components/teacher/dashboard/RecentReviews.tsx
import { Star } from "lucide-react";
import type { RecentReview } from "@/lib/teacher/dashboard/types";

type Props = {
  reviews: RecentReview[];
};

export function RecentReviews({ reviews }: Props) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent reviews
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Latest student feedback
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {r.courseTitle}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">{r.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
              <span>{r.studentName}</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {r.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
              {r.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
            No reviews yet. Once students start leaving feedback it will appear here.
          </p>
        )}
      </div>
    </section>
  );
}
