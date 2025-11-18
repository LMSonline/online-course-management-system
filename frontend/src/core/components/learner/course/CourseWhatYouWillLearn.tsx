// src/components/learner/course/CourseWhatYouWillLearn.tsx
import type { CourseDetail } from "@/lib/learner/course/types";

export function CourseWhatYouWillLearn({ course }: { course: CourseDetail }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
      <h2 className="text-lg md:text-xl font-semibold mb-3">
        What you&apos;ll learn
      </h2>
      <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-100">
        {course.whatYouWillLearn.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-4 w-4 flex items-center justify-center rounded-full bg-[var(--brand-600)]/15 text-[var(--brand-300)] text-xs">
              ✓
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
