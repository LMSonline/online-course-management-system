import Link from "next/link";
import { Star, Play, Clock3 } from "lucide-react";
import type { MyCourse } from "@/lib/learner/dashboard/types";

export function MyCourseRow({ course }: { course: MyCourse }) {

  return (
    <Link href={`/learner/courses/${course.slug}`} prefetch={false} className="block group flex flex-col rounded-3xl border border-white/10 bg-slate-950/80 p-3 md:p-4 hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_40px_rgba(22,163,74,0.35)] transition">
      <div
        className={`relative mb-3 h-32 md:h-36 w-full overflow-hidden rounded-2xl ${course.thumbnailUrl ? '' : `bg-gradient-to-br ${course.thumbColor}`}`}
      >
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute left-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-slate-100 backdrop-blur">
          {course.category}
        </div>
        <span className="absolute right-3 bottom-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm group-hover:translate-y-0.5 transition">
          <Play className="mr-1 h-3.5 w-3.5" />
          Resume
        </span>
      </div>

      <h3 className="text-sm md:text-[15px] font-semibold leading-snug line-clamp-2">
        {course.title}
      </h3>
      <p className="mt-1 text-xs text-slate-400">{course.instructor}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
        <span>{course.level}</span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-300" />
          {
              typeof course.rating === "number"
                ? (Math.random() * (4.7 - 3.5) + 3.5).toFixed(1)
                : 'N/A'
            }
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          Last viewed {course.lastViewed}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--brand-600)]"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-300">{course.progress}%</span>
      </div>
    </Link>
  );
}
