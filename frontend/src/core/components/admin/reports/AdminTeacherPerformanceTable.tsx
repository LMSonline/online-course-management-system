// src/core/components/admin/reports/AdminTeacherPerformanceTable.tsx
import type { TeacherPerformanceSummary } from "@/lib/admin/types";

type Props = {
  items: TeacherPerformanceSummary[];
};

export function AdminTeacherPerformanceTable({ items }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Instructor performance
        </h2>
        <p className="text-[11px] text-slate-400">
          Top instructors by learners, completion and rating.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-400">
            <tr>
              <th className="py-2 pr-4 font-medium">Instructor</th>
              <th className="py-2 pr-4 font-medium">Courses</th>
              <th className="py-2 pr-4 font-medium">Learners</th>
              <th className="py-2 pr-4 font-medium">Avg rating</th>
              <th className="py-2 pr-4 font-medium">Completion rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((i) => (
              <tr key={i.id} className="align-middle">
                <td className="py-3 pr-4 text-slate-100">{i.name}</td>
                <td className="py-3 pr-4 text-slate-100">{i.courses}</td>
                <td className="py-3 pr-4 text-slate-100">
                  {i.learners.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {i.avgRating.toFixed(2)}
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--brand-600)]"
                        style={{ width: `${i.completionRate}%` }}
                      />
                    </div>
                    <span className="text-[11px]">
                      {i.completionRate.toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
