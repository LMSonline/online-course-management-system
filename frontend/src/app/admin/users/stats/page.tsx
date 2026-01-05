"use client";
import { useEffect, useState } from "react";
import { userService } from "@/services/user/user.service";
import { Users, UserCheck, UserX, Ban, ShieldCheck, Mail, XCircle, GraduationCap, BookOpen, Loader2, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
export default function AdminUserStatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    userService.getUserStats()
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
        <Loader2 className="animate-spin w-10 h-10 text-blue-500 mb-4" />
        <span className="text-gray-400">Loading user statistics...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  // If no stats, show nothing
  if (!stats) return null;

  // Prepare chart data
  const statusData = [
    { name: "Active", value: stats.activeUsers, color: "#00ff00" },
    { name: "Inactive", value: stats.inactiveUsers, color: "#6b7280" },
    { name: "Suspended", value: stats.suspendedUsers, color: "#ef4444" },
    { name: "Pending Approval", value: stats.pendingApprovalUsers, color: "#fbbf24" },
    { name: "Pending Email", value: stats.pendingEmailUsers, color: "#f59e0b" },
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
    <div className="min-h-screen bg-[#0a1123]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <button
          onClick={() => window.history.back()}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1a2237] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Statistics</h2>
          <p className="text-gray-400">Overview of user metrics and trends</p>
        </div>
      </div>
      <div className="space-y-6 px-8 pb-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-900/30 rounded">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-400 text-sm">Total Users</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats.totalUsers?.toLocaleString()}</p>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-900/30 rounded">
                <UserCheck className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-400 text-sm">Active</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats.activeUsers?.toLocaleString()}</p>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-700/30 rounded">
                <UserX className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-gray-400 text-sm">Inactive</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats.inactiveUsers?.toLocaleString()}</p>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-900/30 rounded">
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-gray-400 text-sm">Suspended</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats.suspendedUsers?.toLocaleString()}</p>
          </div>
        </div>

        {/* Pending Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-900/30 rounded">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Approval</p>
                <p className="text-white text-xl font-bold">{stats.pendingApprovalUsers?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-900/30 rounded">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Email</p>
                <p className="text-white text-xl font-bold">{stats.pendingEmailUsers?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-900/30 rounded">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Rejected</p>
                <p className="text-white text-xl font-bold">{stats.rejectedUsers?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Status Distribution */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2237",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Role Distribution */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-role-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2237",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 rounded">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Students</p>
                <p className="text-white text-xl font-bold">{stats.roleStats.students?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Teachers</p>
                <p className="text-white text-xl font-bold">{stats.roleStats.teachers?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Approved: {stats.roleStats.approvedTeachers} | Pending: {stats.roleStats.pendingTeachers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-900/30 rounded">
                <ShieldCheck className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-white text-xl font-bold">{stats.roleStats.admins?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Registration Stats */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">New Registrations</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2237",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="users" fill="#00ff00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Activity Stats */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Active Users</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2237",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inactivity Stats */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-white text-lg font-semibold mb-4">Inactivity Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1a2237] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Never Logged In</p>
              <p className="text-white text-2xl font-bold">{stats.activityStats.neverLoggedIn?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-[#1a2237] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Inactive 30+ Days</p>
              <p className="text-white text-2xl font-bold">{stats.activityStats.inactiveFor30Days?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-[#1a2237] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Inactive 90+ Days</p>
              <p className="text-white text-2xl font-bold">{stats.activityStats.inactiveFor90Days?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}