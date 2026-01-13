"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Settings, FileText, User, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Courses", href: "/admin/courses", icon: <BookOpen size={18} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
    { label: "Logs", href: "/admin/logs", icon: <FileText size={18} /> },
    { label: "Profile", href: "/admin/profile", icon: <User size={18} /> },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-red-950/80 backdrop-blur-lg sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

        {/* Logo */}
        <Link href="/admin/dashboard" className="text-xl font-semibold text-red-400">
          LMS Admin
        </Link>

        {/* Menu */}
        <ul className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${active ? "text-red-400 bg-white/5" : "text-slate-300 hover:text-white"
                    }`}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <button
          className="flex items-center gap-1 text-red-400 hover:text-red-300 transition disabled:opacity-50"
        >
          <LogOut size={18} />
          Logout
        </button>

      </nav>
    </header>
  );
}
