// src/core/components/teacher/course-management/CourseManageHeader.tsx
import type { TeacherCourseManage } from "@/lib/teacher/course-management/types";

type Props = {
  course: TeacherCourseManage;
};

export function CourseManageHeader({ course }: Props) {
  const currentVersion = course.versions.find((v) => v.isCurrent) ?? course.versions[0];

  return (
    <header className="mb-5 md:mb-6">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Course management · Instructor
      </p>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {course.category} • {course.level} • {course.lastUpdated}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${
                course.status === "Published"
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-400/60 bg-amber-500/10 text-amber-200"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {course.status === "Published" ? "Published" : "Draft (unpublished changes)"}
            </span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="text-slate-400">
              Current version:{" "}
              <span className="text-slate-100">{currentVersion.label}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-slate-950 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 hover:bg-slate-900 transition"
          >
            Preview on LMS
          </button>
          <button
            type="button"
            className="rounded-full bg-[var(--brand-600)] px-4 py-2 text-xs md:text-sm font-semibold text-slate-950 hover:bg-[var(--brand-700)] transition"
          >
            Publish changes
          </button>
        </div>
      </div>
    </header>
  );
}
