// src/core/components/teacher/dashboard/CoursesPerformanceTable.tsx
import { MoreHorizontal } from "lucide-react";
import type { TeacherCourseSummary } from "@/lib/teacher/dashboard/types";

type Props = {
  courses: TeacherCourseSummary[];
};

const statusColor: Record<TeacherCourseSummary["status"], string> = {
  Published: "bg-emerald-500/10 text-emerald-300 border-emerald-400/60",
  Draft: "bg-slate-900 text-slate-200 border-white/15",
  Private: "bg-amber-500/10 text-amber-200 border-amber-400/60",
};

export function CoursesPerformanceTable({ courses }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Course performance
        </h2>
        <p className="text-[11px] text-slate-400">
          Students, ratings and completion rate per course.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-400">
            <tr>
              <th className="py-2 pr-4 font-medium">Course</th>
              <th className="py-2 pr-4 font-medium">Students</th>
              <th className="py-2 pr-4 font-medium">Rating</th>
              <th className="py-2 pr-4 font-medium">Completion</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pl-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.map((c) => (
              <tr key={c.id} className="align-middle">
                <td className="py-3 pr-4">
                  <p className="text-sm font-medium text-slate-100 truncate max-w-xs">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {c.category} • {c.level} • Updated {c.lastUpdated}
                  </p>
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {c.students.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {c.rating.toFixed(1)}
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--brand-600)]"
                        style={{ width: `${c.completionRate}%` }}
                      />
                    </div>
                    <span className="text-[11px]">
                      {c.completionRate.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${statusColor[c.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {c.status}
                  </span>
                </td>
                <td className="py-3 pl-2 text-right">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
