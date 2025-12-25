// src/app/(admin)/dashboard/page.tsx
"use client";

import { useState } from "react";
import {
  DollarSign,
  Award,
  FileText,
  Settings,
} from "lucide-react";
import { AdminSidebar } from "@/core/components/admin/dashboard/AdminSidebar";
import { AdminTopBar } from "@/core/components/admin/dashboard/AdminTopBar";
import { AdminDashboardMain } from "@/core/components/admin/dashboard/AdminDashboardMain";
import { AdminUsersMain } from "@/core/components/admin/dashboard/AdminUsersManagement";
import { AdminCoursesMain } from "@/core/components/admin/dashboard/AdminCoursesApproval";
import { AdminCommunityMain } from "@/core/components/admin/dashboard/AdminContentModeration";
// Sử dụng đúng đường dẫn tới page payments và certificate
import AdminPaymentsPage from "@/app/admin/payment/page";
import AdminCertificatesPage from "@/app/admin/certificate/page";

export type AdminView =
  | "dashboard"
  | "users"
  | "courses"
  | "payments"
  | "community"
  | "certificates"
  | "settings"
  | "reports";

export default function AdminDashboardPage() {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [selectedTab, setSelectedTab] = useState("all");

  // ...existing mock data...
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

  const pendingCourses = [
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
    {
      id: 3,
      title: "Python for Data Science",
      instructor: "Mike Johnson",
      submittedDate: "2025-01-13",
      category: "Data Science",
      status: "pending",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "Learner",
      status: "active",
      joinedDate: "2025-01-20",
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "Instructor",
      status: "active",
      joinedDate: "2025-01-19",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      role: "Learner",
      status: "active",
      joinedDate: "2025-01-18",
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@example.com",
      role: "Learner",
      status: "suspended",
      joinedDate: "2025-01-17",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      user: "Alice Brown",
      course: "React Mastery",
      amount: 99.99,
      status: "completed",
      date: "2025-01-20",
    },
    {
      id: 2,
      user: "Bob Wilson",
      course: "Python Basics",
      amount: 49.99,
      status: "completed",
      date: "2025-01-20",
    },
    {
      id: 3,
      user: "Carol Davis",
      course: "UI/UX Design",
      amount: 79.99,
      status: "pending",
      date: "2025-01-19",
    },
    {
      id: 4,
      user: "David Lee",
      course: "Data Science",
      amount: 129.99,
      status: "refunded",
      date: "2025-01-18",
    },
  ];

  const violationReports = [
    {
      id: 1,
      type: "Course Content",
      reporter: "User#12345",
      target: "Course: Advanced Hacking",
      reason: "Inappropriate content",
      status: "pending",
      date: "2025-01-20",
    },
    {
      id: 2,
      type: "User Behavior",
      reporter: "Instructor#567",
      target: "User: John123",
      reason: "Spam comments",
      status: "reviewing",
      date: "2025-01-19",
    },
    {
      id: 3,
      type: "Course Content",
      reporter: "User#98765",
      target: "Course: Quick Money",
      reason: "Misleading information",
      status: "resolved",
      date: "2025-01-18",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex">
      <AdminSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        stats={stats}
      />
      <div className="flex-1 flex flex-col h-screen">
        <AdminTopBar stats={stats} />
        <main className="flex-1 overflow-y-auto p-8">
          {currentView === "dashboard" && (
            <AdminDashboardMain
              stats={stats}
              monthly={monthly}
              pendingCourses={pendingCourses}
              recentTransactions={recentTransactions}
              setCurrentView={setCurrentView}
            />
          )}
          {currentView === "users" && (
            <AdminUsersMain
              recentUsers={recentUsers}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          {currentView === "courses" && (
            <AdminCoursesMain
              pendingCourses={pendingCourses}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          {currentView === "community" && (
            <AdminCommunityMain
              violationReports={violationReports}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          {currentView === "payments" && (
            <AdminPaymentsPage />
          )}
          {currentView === "certificates" && (
            <AdminCertificatesPage />
          )}
          {currentView === "reports" && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">
                Reports & Analytics
              </h3>
              <p className="text-gray-500 mt-2">
                Detailed system reports and analytics will appear here
              </p>
            </div>
          )}
          {currentView === "settings" && (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">
                System Settings
              </h3>
              <p className="text-gray-500 mt-2">
                Configure system parameters and preferences
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
