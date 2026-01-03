"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Search
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useAuth";

interface NavbarProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
}

export const TeacherNavbar = ({ onMenuClick, isCollapsed }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const logout = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname?.split("/").filter(Boolean) || [];
    const breadcrumbs = [];

    let currentPath = "";
    for (const path of paths) {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      breadcrumbs.push({ label, href: currentPath });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/teacher/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const notifications = [
    { id: 1, title: "New student enrolled", message: "Sarah joined Web Development", time: "5m ago", read: false },
    { id: 2, title: "Course review received", message: "5 stars on React Course", time: "1h ago", read: false },
    { id: 3, title: "Payout completed", message: "$450 deposited", time: "2h ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-48"
            />
          </form>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (
              theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-700/50 ${!notif.read ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${!notif.read ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-slate-900 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href="/teacher/notifications"
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              disabled={isLoadingProfile}
            >
              {profile?.avatarUrl ? (
                <div className="w-9 h-9 rounded-lg overflow-hidden shadow-lg relative">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.profile?.fullName || profile.username}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {profile?.profile?.fullName || profile?.username || "Loading..."}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instructor</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {profile?.profile?.fullName || profile?.username}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>
                    {profile?.profile?.teacherCode && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                        {profile.profile.teacherCode}
                      </p>
                    )}
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push("/teacher/profile");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push("/teacher/profile?tab=security");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => logout.mutate()}
                      disabled={logout.isPending}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4" />
                      {logout.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};