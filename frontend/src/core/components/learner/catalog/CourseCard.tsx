// src/components/learner/catalog/CourseCard.tsx
import { Star } from "lucide-react";
import type { CourseSummary } from "@/lib/learner/catalog/types";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_32px_rgba(34,197,94,0.4)] transition">
      {/* thumbnail */}
      <div
        className={`relative h-32 md:h-36 w-full bg-gradient-to-br ${course.thumbColor}`}
      >
        <div className="absolute inset-0 bg-black/15" />
        {course.tag && (
          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
            {course.tag}
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="line-clamp-2 text-sm md:text-[15px] font-semibold group-hover:text-[var(--brand-100)]">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{course.instructor}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-300" />
            <span className="font-semibold text-amber-300">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">
              ({formatNumber(course.ratingCount)})
            </span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{formatNumber(course.students)} students</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          <span>{course.level}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.duration}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.lectures} lectures</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-50">
            {course.priceLabel}
          </span>
          <button className="text-[11px] font-medium text-[var(--brand-300)] hover:text-[var(--brand-100)]">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
