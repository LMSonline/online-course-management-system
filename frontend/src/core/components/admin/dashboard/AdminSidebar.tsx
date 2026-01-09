"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen }, 
  { label: "Reports", href: "/admin/logs", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="w-64 min-h-screen bg-[#0a0f1e] border-r border-gray-800 flex flex-col">
      
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <Link
          href="/admin/dashboard"
          className="text-xl font-bold text-[#00ff00]"
        >
          LMS ADMIN
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  active
                    ? "bg-[#00ff00]/10 text-[#00ff00]"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
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
