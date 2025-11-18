// src/components/learner/course/CourseContentOutline.tsx
import { ChevronDown, PlayCircle } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";

export function CourseContentOutline({ course }: { course: CourseDetail }) {
  const totalLectures = course.sections.reduce((sum, s) => sum + s.lecturesCount, 0);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90">
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-white/10">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Course content</h2>
          <p className="text-xs text-slate-400 mt-1">
            {course.sections.length} sections • {totalLectures} lectures •{" "}
            ~{course.sections[0]?.duration ?? "5h+"} total length
          </p>
        </div>
        <button className="text-xs text-[var(--brand-300)] hover:text-[var(--brand-100)]">
          Expand all
        </button>
      </header>
      <div className="divide-y divide-white/10">
        {course.sections.map((sec) => (
          <details key={sec.id} className="group" open>
            <summary className="flex cursor-pointer items-center justify-between px-4 md:px-5 py-3 text-sm hover:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                <span className="font-medium">{sec.title}</span>
              </div>
              <div className="text-xs text-slate-400">
                {sec.lecturesCount} lectures • {sec.duration}
              </div>
            </summary>
            <div className="px-4 md:px-5 py-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-2">
                <PlayCircle className="w-4 h-4 text-[var(--brand-400)]" />
                <span>Lesson 1 • Intro & setup</span>
                <span className="ml-auto text-[11px] text-slate-400">
                  08:45
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-900/60">
                <PlayCircle className="w-4 h-4 text-slate-500" />
                <span>Lesson 2 • Project structure</span>
                <span className="ml-auto text-[11px] text-slate-400">
                  12:10
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-900/60">
                <PlayCircle className="w-4 h-4 text-slate-500" />
                <span>Lesson 3 • First components</span>
                <span className="ml-auto text-[11px] text-slate-400">
                  10:02
                </span>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
