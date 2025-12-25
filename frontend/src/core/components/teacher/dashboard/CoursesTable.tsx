// src/core/components/teacher/dashboard/CoursesTable.tsx
"use client";

import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import type { TeacherCourseSummary } from "@/lib/teacher/dashboard/types";
import Link from "next/link";

type Props = {
  courses: TeacherCourseSummary[];
};

const statusColor: Record<TeacherCourseSummary["status"], string> = {
  Published: "bg-emerald-500/10 text-emerald-300 border-emerald-400/60",
  Draft: "bg-slate-900 text-slate-200 border-white/15",
  Private: "bg-amber-500/10 text-amber-200 border-amber-400/60",
};

export function CoursesTable({ courses }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Your courses
          </h2>
          <p className="text-xs text-slate-400">
            Manage performance and jump into editing any course.
          </p>
        </div>

        <Link
          href="/teacher/courses/new"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2 text-xs md:text-sm font-semibold text-slate-950 hover:bg-[var(--brand-700)] transition"
        >
          <span>Create new course</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-400">
            <tr>
              <th className="py-2 pr-4 font-medium">Course</th>
              <th className="py-2 pr-4 font-medium">Students</th>
              <th className="py-2 pr-4 font-medium">Rating</th>
              {/* <th className="py-2 pr-4 font-medium">Revenue</th> */}
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
                {/* <td className="py-3 pr-4 text-slate-100">
                  ${c.revenue?.toFixed(2)}
                </td> */}
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

      <p className="text-[11px] text-slate-500">
        Data above is mocked. Later you can connect it to real analytics from
        your backend.
      </p>
    </section>
  );
}
