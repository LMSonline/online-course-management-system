// src/core/components/teacher/dashboard/CoursesPerformanceTable.tsx
import { MoreHorizontal, Star } from "lucide-react";
import type { TeacherCourseSummary } from "@/lib/teacher/dashboard/types";

type Props = {
  courses: TeacherCourseSummary[];
};

const statusColor: Record<TeacherCourseSummary["status"], string> = {
  Published: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Draft: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  Private: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

export function CoursesPerformanceTable({ courses }: Props) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Course performance
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Students, ratings and completion rate per course
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Completion</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                    {c.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {c.category} • {c.level} • Updated {c.lastUpdated}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                  {c.students.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-white">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {c.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                        style={{ width: `${c.completionRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {c.completionRate.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusColor[c.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
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
