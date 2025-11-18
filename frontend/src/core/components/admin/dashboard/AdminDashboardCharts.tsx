"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { MonthlyMetricPoint } from "@/lib/admin/types";

type Props = {
  monthly: MonthlyMetricPoint[];
};

export function AdminDashboardCharts({ monthly }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Revenue line chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Revenue trend
          </h2>
          <p className="text-[11px] text-slate-400">
            Monthly gross revenue (mock).
          </p>
        </div>
        <div className="h-52 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthly}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="month"
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
                  border: "1px solid rgba(148,163,184,0.4)",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                  color: "white",
                }}
                formatter={(value: any) => [`$${value}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New users / active learners bar chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Users activity
          </h2>
          <p className="text-[11px] text-slate-400">
            New registrations and active learners.
          </p>
        </div>
        <div className="h-52 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthly}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                vertical={false}
              />
              <XAxis
                dataKey="month"
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
                  border: "1px solid rgba(148,163,184,0.4)",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                  color: "white",
                }}
              />
              <Bar
                dataKey="newUsers"
                name="New users"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="activeLearners"
                name="Active learners"
                fill="#38bdf8"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
