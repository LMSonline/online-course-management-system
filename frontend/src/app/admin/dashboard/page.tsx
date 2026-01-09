// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AdminStatsRow } from "@/core/components/admin/dashboard/AdminStatsRow";
import { AdminDashboardCharts } from "@/core/components/admin/dashboard/AdminDashboardCharts";
import { CheckCircle, XCircle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AdminOverview, MonthlyMetricPoint } from "@/lib/admin/types";

type UserStatsResponse = {
  totalUsers: number;
  activeUsers: number;
  roleStats: {
    teachers: number;
    students: number;
    learners?: number;
  };
  activeCourses?: number;
  pendingCourses?: number;
  monthlyRevenue?: number;
  monthly: MonthlyMetricPoint[];
};

type Props = {
  stats?: AdminOverview;
  monthly?: MonthlyMetricPoint[];
  pendingCourses: any[];
  recentTransactions: any[];
  setCurrentView: Dispatch<SetStateAction<AdminOverview>>;
};

type DashboardData = {
  stats: AdminOverview;
  monthly: MonthlyMetricPoint[];
  pendingCourses: any[];
  recentTransactions: any[];
};

function AdminDashboardMain({
  stats: statsProp,
  monthly: monthlyProp,
  pendingCourses,
  recentTransactions,
  setCurrentView,
}: Props) {
  const [stats, setStats] = useState<AdminOverview | null>(statsProp ?? null);
  const [monthly, setMonthly] = useState<MonthlyMetricPoint[]>(monthlyProp ?? []);
  const [loading, setLoading] = useState(!statsProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (statsProp && monthlyProp) {
      setStats(statsProp);
      setMonthly(monthlyProp);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/v1/admin/users/stats", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user stats");
        return res.json();
      })
      .then((data: UserStatsResponse) => {
        setStats({
          totalUsers: data.totalUsers,
          learners: data.roleStats.students ?? data.roleStats.learners ?? 0,
          teachers: data.roleStats.teachers ?? 0,
          activeCourses: data.activeCourses ?? 0,
          pendingCourses: data.pendingCourses ?? 0,
          monthlyRevenue: data.monthlyRevenue ?? 0,
          systemHealth: "Healthy",
        });
        setMonthly(data.monthly ?? []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [statsProp, monthlyProp]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-8">
          Failed to load user statistics: {error}
        </div>
      ) : (
        <>
          <AdminStatsRow overview={stats!} />
          <div className="mt-4">
            <AdminDashboardCharts monthly={monthly} />
          </div>
        </>
      )}
      {/* Recent Activity Tables */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Pending Course Approvals */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Pending Course Approvals
            </h3>
            <button
              onClick={() => stats && setCurrentView(stats)}
              className="text-sm text-[#00ff00] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-[#1a2237] border border-gray-700 rounded-lg hover:border-[#00ff00] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {course.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        Submitted {course.submittedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-green-900/20 border border-green-700 text-green-400 rounded hover:bg-green-900/30 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/30 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Transactions */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Transactions
            </h3>
            <button
              onClick={() => stats && setCurrentView(stats)}
              className="text-sm text-[#00ff00] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 bg-[#1a2237] border border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">
                      {transaction.user}
                    </p>
                    <p className="text-xs text-gray-400">
                      {transaction.course}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    ${transaction.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {transaction.date}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      transaction.status === "completed"
                        ? "bg-green-900/30 text-green-400"
                        : transaction.status === "pending"
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function AdminDashboardPage() {
  // State cho dữ liệu dashboard
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Gọi 3 API song song
    Promise.all([
      fetch("/admin/dashboard").then((res) => (res.ok ? res.json() : Promise.reject("dashboard"))),
      fetch("/admin/statistics").then((res) => (res.ok ? res.json() : Promise.reject("statistics"))),
      fetch("/admin/reports/revenue").then((res) => (res.ok ? res.json() : Promise.reject("revenue"))),
    ])
      .then(([dashboardRes, statisticsRes, revenueRes]) => {
        // Tuỳ vào cấu trúc trả về của BE, bạn cần map lại cho đúng
        // Dưới đây là ví dụ giả định, bạn cần sửa lại cho đúng với BE thực tế
        setDashboard({
          stats: {
            totalUsers: statisticsRes.data.totalUsers ?? 0,
            learners: statisticsRes.data.learners ?? 0,
            teachers: statisticsRes.data.teachers ?? 0,
            activeCourses: statisticsRes.data.activeCourses ?? 0,
            pendingCourses: dashboardRes.data.pendingCourses ?? 0,
            monthlyRevenue: revenueRes.data.monthlyRevenue ?? 0,
            systemHealth: "Healthy",
          },
          monthly: revenueRes.data.monthly ?? [],
          pendingCourses: dashboardRes.data.pendingCoursesList ?? [],
          recentTransactions: dashboardRes.data.recentTransactions ?? [],
        });
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  // Dữ liệu mẫu fallback nếu chưa có API thực
  const fallbackStats = {
    totalUsers: 12450,
    learners: 11230,
    teachers: 210,
    instructors: 210,
    courses: 186,
    pendingApproval: 12,
    revenue: 18452.75,
    previousRevenue: 15892.5,
    activeInstructors: 210,
    activeCourses: 158,
    pendingCourses: 12,
    monthlyRevenue: 18452.75,
    systemHealth: "Healthy" as const,
  };

  const fallbackMonthly = [
    { month: "Nov", revenue: 12000, newUsers: 850, activeLearners: 3200 },
    { month: "Dec", revenue: 14000, newUsers: 920, activeLearners: 3500 },
    { month: "Jan", revenue: 15500, newUsers: 1050, activeLearners: 3800 },
    { month: "Feb", revenue: 16800, newUsers: 980, activeLearners: 3900 },
    { month: "Mar", revenue: 18452, newUsers: 1120, activeLearners: 4100 },
  ];

  const fallbackPendingCourses = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "John Doe",
      submittedDate: "2025-01-15",
      category: "Development",
      status: "pending",
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Jane Smith",
      submittedDate: "2025-01-14",
      category: "Design",
      status: "pending",
    },
  ];

  const fallbackRecentTransactions = [
    {
      id: 1,
      user: "Alice Brown",
      course: "React Mastery",
      amount: 99.99,
      status: "completed",
      date: "2025-01-20",
    },
  ];

  const setCurrentView = () => {};

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span>Loading dashboard...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-8">{error}</div>
      ) : (
        <AdminDashboardMain
          stats={dashboard?.stats ?? fallbackStats}
          monthly={dashboard?.monthly ?? fallbackMonthly}
          pendingCourses={dashboard?.pendingCourses ?? fallbackPendingCourses}
          recentTransactions={dashboard?.recentTransactions ?? fallbackRecentTransactions}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
}
