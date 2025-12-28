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
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Students per course
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Active enrollments by course
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
            <XAxis
              dataKey="shortTitle"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                fontSize: 12,
                color: "white",
              }}
              formatter={(value: any) => [`${value} students`, "Enrollments"]}
              labelFormatter={(label) => `Course: ${label}`}
            />
            <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
