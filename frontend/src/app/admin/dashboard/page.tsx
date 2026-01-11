"use client";

import { useAdmin } from "@/core/components/admin/AdminContext";

export default function AdminDashboardPage() {
  const { darkMode } = useAdmin();

  const stats = {
    totalUsers: 12450,
    learners: 11230,
    instructors: 210,
    courses: 186,
    pendingApproval: 12,
    revenue: 18452.75,
    previousRevenue: 15892.5,
    activeInstructors: 210,
    activeCourses: 158,
    pendingCourses: 12,
    monthlyRevenue: 18452.75,
    systemHealth: "Healthy" as "Healthy",
  };

  const monthly = [
    { month: "Nov", revenue: 12000, newUsers: 850, activeLearners: 3200 },
    { month: "Dec", revenue: 14000, newUsers: 920, activeLearners: 3500 },
    { month: "Jan", revenue: 15500, newUsers: 1050, activeLearners: 3800 },
    { month: "Feb", revenue: 16800, newUsers: 980, activeLearners: 3900 },
    { month: "Mar", revenue: 18452, newUsers: 1120, activeLearners: 4100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"} border rounded-lg p-6`}>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Total Users</p>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"} mt-2`}>{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className={`${darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"} border rounded-lg p-6`}>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Active Courses</p>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"} mt-2`}>{stats.activeCourses}</p>
        </div>
        <div className={`${darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"} border rounded-lg p-6`}>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Instructors</p>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"} mt-2`}>{stats.instructors}</p>
        </div>
        <div className={`${darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"} border rounded-lg p-6`}>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Monthly Revenue</p>
          <p className={`text-3xl font-bold ${darkMode ? "text-[#00ff00]" : "text-green-600"} mt-2`}>${stats.monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"} border rounded-lg p-6`}>
        <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"} mb-4`}>Recent Activity</h3>
        <div className="space-y-3">
          {monthly.slice(-3).map((item, idx) => (
            <div key={idx} className={`flex justify-between items-center py-2 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{item.month}</span>
              <span className={`${darkMode ? "text-white" : "text-black"} font-medium`}>{item.newUsers} new users</span>
              <span className={darkMode ? "text-[#00ff00]" : "text-green-600"}>${item.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
