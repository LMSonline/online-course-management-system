"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/core/components/admin/AdminContext";
import { userService } from "@/services/user/user.service";
import {
  Users,
  UserCheck,
  UserX,
  Ban,
  ShieldCheck,
  Mail,
  XCircle,
  GraduationCap,
  BookOpen,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminUserStatsScreenProps {
  onBack?: () => void;
}

export function AdminUserStatsScreen({ onBack }: AdminUserStatsScreenProps) {
  const { darkMode } = useAdmin();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    userService
      .getUserStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load user statistics.");
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className={`p-6 rounded-2xl ${
            darkMode ? "bg-[#12182b]" : "bg-white"
          } shadow-xl`}
        >
          <Loader2
            className={`animate-spin w-12 h-12 mb-4 mx-auto ${
              darkMode ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
          <span
            className={`block text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading user statistics...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className={`p-6 rounded-2xl ${
            darkMode ? "bg-[#12182b]" : "bg-white"
          } shadow-xl`}
        >
          <AlertTriangle
            className={`w-12 h-12 mb-4 mx-auto ${
              darkMode ? "text-rose-400" : "text-rose-600"
            }`}
          />
          <span
            className={`block text-center ${
              darkMode ? "text-rose-400" : "text-rose-600"
            }`}
          >
            {error}
          </span>
        </div>
      </div>
    );
  }

  // If no stats, show nothing
  if (!stats) return null;

  // Prepare chart data
  const statusData = [
    { name: "Active", value: stats.activeUsers, color: "#10b981" },
    { name: "Inactive", value: stats.inactiveUsers, color: "#6b7280" },
    { name: "Suspended", value: stats.suspendedUsers, color: "#ef4444" },
    {
      name: "Pending Approval",
      value: stats.pendingApprovalUsers,
      color: "#f59e0b",
    },
    {
      name: "Pending Email",
      value: stats.pendingEmailUsers,
      color: "#fbbf24",
    },
    { name: "Rejected", value: stats.rejectedUsers, color: "#dc2626" },
  ];

  const roleData = [
    { name: "Students", value: stats.roleStats.students, color: "#3b82f6" },
    { name: "Teachers", value: stats.roleStats.teachers, color: "#a855f7" },
    { name: "Admins", value: stats.roleStats.admins, color: "#ef4444" },
  ];

  const registrationData = [
    { period: "Today", users: stats.registrationStats.today },
    { period: "This Week", users: stats.registrationStats.thisWeek },
    { period: "This Month", users: stats.registrationStats.thisMonth },
    { period: "This Year", users: stats.registrationStats.thisYear },
  ];

  const activityData = [
    { period: "Today", users: stats.activityStats.activeToday },
    { period: "This Week", users: stats.activityStats.activeThisWeek },
    { period: "This Month", users: stats.activityStats.activeThisMonth },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-all ${
              darkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            User Statistics
          </h2>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Overview of user metrics and trends
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          className={`rounded-xl border p-5 transition-all hover:scale-105 ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
              : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Users
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.totalUsers?.toLocaleString()}
          </p>
        </div>

        {/* Active Users */}
        <div
          className={`rounded-xl border p-5 transition-all hover:scale-105 ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
              : "bg-white border-gray-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-emerald-500/10" : "bg-emerald-50"
              }`}
            >
              <UserCheck
                className={`w-5 h-5 ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Active
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.activeUsers?.toLocaleString()}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of
            total
          </p>
        </div>

        {/* Inactive Users */}
        <div
          className={`rounded-xl border p-5 transition-all hover:scale-105 ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-600/10"
              : "bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-400/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-gray-700/30" : "bg-gray-100"
              }`}
            >
              <UserX
                className={`w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Inactive
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.inactiveUsers?.toLocaleString()}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1)}% of
            total
          </p>
        </div>

        {/* Suspended Users */}
        <div
          className={`rounded-xl border p-5 transition-all hover:scale-105 ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10"
              : "bg-white border-gray-200 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-rose-500/10" : "bg-rose-50"
              }`}
            >
              <Ban
                className={`w-5 h-5 ${
                  darkMode ? "text-rose-400" : "text-rose-600"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Suspended
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.suspendedUsers?.toLocaleString()}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-rose-400" : "text-rose-600"
            }`}
          >
            Requires attention
          </p>
        </div>
      </div>

      {/* Pending Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-5 transition-all ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-amber-500/30"
              : "bg-white border-gray-200 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-amber-500/10" : "bg-amber-50"
              }`}
            >
              <ShieldCheck
                className={`w-5 h-5 ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending Approval
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.pendingApprovalUsers?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 transition-all ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-orange-500/30"
              : "bg-white border-gray-200 hover:border-orange-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-orange-500/10" : "bg-orange-50"
              }`}
            >
              <Mail
                className={`w-5 h-5 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending Email
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.pendingEmailUsers?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 transition-all ${
            darkMode
              ? "bg-[#12182b] border-gray-800 hover:border-red-500/30"
              : "bg-white border-gray-200 hover:border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg ${
                darkMode ? "bg-red-500/10" : "bg-red-50"
              }`}
            >
              <XCircle
                className={`w-5 h-5 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Rejected
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.rejectedUsers?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity
              className={`w-5 h-5 ${
                darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Status Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={90}
                dataKey="value"
                animationDuration={800}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1a2237" : "#ffffff",
                  border: darkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                  padding: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Users
              className={`w-5 h-5 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Role Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={90}
                dataKey="value"
                animationDuration={800}
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-role-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1a2237" : "#ffffff",
                  border: darkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                  padding: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <GraduationCap
                className={`w-6 h-6 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Students
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.roleStats.students?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-purple-500/10" : "bg-purple-50"
              }`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Teachers
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.roleStats.teachers?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Approved
              </p>
              <p
                className={`text-sm font-semibold ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {stats.roleStats.approvedTeachers}
              </p>
            </div>
            <div>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Pending
              </p>
              <p
                className={`text-sm font-semibold ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {stats.roleStats.pendingTeachers}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-rose-500/10" : "bg-rose-50"
              }`}
            >
              <ShieldCheck
                className={`w-6 h-6 ${
                  darkMode ? "text-rose-400" : "text-rose-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Admins
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.roleStats.admins?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Stats */}
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp
              className={`w-5 h-5 ${
                darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              New Registrations
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={registrationData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="period"
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1a2237" : "#ffffff",
                  border: darkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                  padding: "12px",
                }}
                cursor={{ fill: darkMode ? "#374151" : "#f3f4f6" }}
              />
              <Bar
                dataKey="users"
                fill={darkMode ? "#10b981" : "#059669"}
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Stats */}
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "bg-[#12182b] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity
              className={`w-5 h-5 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Active Users
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="period"
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1a2237" : "#ffffff",
                  border: darkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                  padding: "12px",
                }}
                cursor={{ fill: darkMode ? "#374151" : "#f3f4f6" }}
              />
              <Bar
                dataKey="users"
                fill={darkMode ? "#3b82f6" : "#2563eb"}
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inactivity Stats */}
      <div
        className={`rounded-xl border p-6 ${
          darkMode
            ? "bg-[#12182b] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock
            className={`w-5 h-5 ${
              darkMode ? "text-amber-400" : "text-amber-600"
            }`}
          />
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Inactivity Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-5 rounded-xl border ${
              darkMode
                ? "bg-[#1a2237] border-gray-800"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Never Logged In
            </p>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {stats.activityStats.neverLoggedIn?.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-2 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              New accounts inactive
            </p>
          </div>

          <div
            className={`p-5 rounded-xl border ${
              darkMode
                ? "bg-[#1a2237] border-gray-800"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Inactive 30+ Days
            </p>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {stats.activityStats.inactiveFor30Days?.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-2 ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
            >
              May need re-engagement
            </p>
          </div>

          <div
            className={`p-5 rounded-xl border ${
              darkMode
                ? "bg-[#1a2237] border-gray-800"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Inactive 90+ Days
            </p>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {stats.activityStats.inactiveFor90Days?.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-2 ${
                darkMode ? "text-rose-400" : "text-rose-600"
              }`}
            >
              Consider for cleanup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
