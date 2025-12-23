"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EnrollmentPoint } from "@/lib/teacher/dashboard/types";

type Props = {
  data: EnrollmentPoint[];
};

export function EnrollmentsChart({ data }: Props) {
  // Rút gọn tên khóa cho trục X
  const chartData = data.map((d) => ({
    ...d,
    shortTitle:
      d.courseTitle.length > 18
        ? d.courseTitle.slice(0, 18) + "..."
        : d.courseTitle,
  }));

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Students per course
        </h2>
        <p className="text-[11px] text-slate-400">
          Active enrollments by course (mock).
        </p>
      </div>

      <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="shortTitle"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(148, 163, 184, 0.4)",
                borderRadius: "0.75rem",
                fontSize: 12,
                color: "white",
              }}
              formatter={(value: any) => [`${value} students`, "Enrollments"]}
              labelFormatter={(label) => `Course: ${label}`}
            />
            <Bar dataKey="students" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
