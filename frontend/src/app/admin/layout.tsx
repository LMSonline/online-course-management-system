"use client";
import { AdminProvider, useAdmin } from "@/core/components/admin/AdminContext";
import { AdminSidebar } from "@/core/components/admin/dashboard/AdminSidebar";
import { AdminTopBar } from "@/core/components/admin/dashboard/AdminTopBar";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
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

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-black"}`}>
      <AdminSidebar stats={stats} />
      <div className="flex-1 flex flex-col h-screen">
        <AdminTopBar stats={stats} />
        <main className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-[#0a0f1e]" : "bg-gray-50"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
