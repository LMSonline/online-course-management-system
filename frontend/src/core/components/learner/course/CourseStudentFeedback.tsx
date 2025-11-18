// src/components/learner/course/CourseStudentFeedback.tsx
import { Star } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";

export function CourseStudentFeedback({ course }: { course: CourseDetail }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <h2 className="text-lg font-semibold">Student feedback</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/80 px-6 py-4 md:w-52">
          <span className="text-3xl font-bold text-amber-300">
            {course.rating.toFixed(1)}
          </span>
          <div className="mt-1 flex gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-300" />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {course.ratingCount.toLocaleString()} ratings
          </p>
        </div>

        <div className="flex-1 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-8 text-right">5</span>
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[70%] rounded-full bg-[var(--brand-600)]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-right">4</span>
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[20%] rounded-full bg-[var(--brand-600)]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-right">3</span>
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[7%] rounded-full bg-[var(--brand-600)]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-right">2</span>
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[2%] rounded-full bg-[var(--brand-600)]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-right">1</span>
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[1%] rounded-full bg-[var(--brand-600)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
