"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, DollarSign, MessageSquare, Award, BarChart3, Settings, DollarSignIcon, LogOut } from "lucide-react";
import { useAdmin } from "@/core/components/admin/AdminContext";
import { useLogout } from "@/hooks/useAuth";

type Props = {
  stats: any;
};

export function AdminSidebar({ stats }: Props) {
  const pathname = usePathname();
  const { darkMode } = useAdmin();
  const { mutate: logout, isPending } = useLogout();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/admin/courses" },
    { id: "payments", label: "Payments", icon: DollarSign, href: "/admin/payment" },
    { id: "revenue", label: "Revenues", icon: BarChart3, href: "/admin/revenue-share" },
    { id: "violation_report", label: "Violation Report", icon: MessageSquare, href: "/admin/violation-report" },
    { id: "certificates", label: "Certificates", icon: Award, href: "/admin/certificate" },
    // { id: "reports", label: "Reports", icon: BarChart3, href: "/admin/reports" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className={`w-64 ${darkMode ? "bg-[#0d1425]" : "bg-white"} border-r ${darkMode ? "border-gray-800" : "border-gray-200"} h-screen flex flex-col shrink-0`}>
      <div
        className={`p-6 border-b ${darkMode ? "border-gray-800" : "border-gray-200"
          } h-[73px] flex items-center gap-4`}
      >
        {/* Logo */}
        <img
          src="/images/brand/logo-lms.png"
          alt="LMS Logo"
          className="h-10 w-10 object-contain"
        />

        {/* Text */}
        <div className="flex flex-col leading-tight">
          <h1
            className={`text-xl font-bold ${darkMode ? "text-[#00ff00]" : "text-green-600"
              }`}
          >
            LMS Admin
          </h1>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Management Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? darkMode
                        ? "bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30"
                        : "bg-green-50 text-green-700 border border-green-200"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
