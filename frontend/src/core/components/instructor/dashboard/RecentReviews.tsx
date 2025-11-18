// src/core/components/instructor/dashboard/RecentReviews.tsx
import { Star } from "lucide-react";
import type { RecentReview } from "@/lib/instructor/dashboard/types";

type Props = {
  reviews: RecentReview[];
};

export function RecentReviews({ reviews }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Recent reviews
        </h2>
        <p className="text-[11px] text-slate-400">
          Latest feedback from your students.
        </p>
      </div>

      <div className="space-y-2">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-100 truncate">
                {r.courseTitle}
              </p>
              <span className="text-[11px] text-slate-500">{r.createdAt}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>{r.studentName}</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span className="inline-flex items-center gap-0.5 text-amber-300">
                <Star className="w-3 h-3" />
                {r.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-[11px] md:text-xs text-slate-300 line-clamp-2">
              {r.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-[11px] text-slate-500">
            No reviews yet. Once students start leaving feedback it will appear
            here.
          </p>
        )}
      </div>
    </section>
  );
}
