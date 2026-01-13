"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Wallet,
  BarChart3,
  ChevronLeft,
  GraduationCap,
  HelpCircle,
  Bell,
  ClipboardList
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const TeacherSidebar = memo(({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = useMemo(() => [
    { icon: LayoutDashboard, label: "Dashboard", href: "/teacher/dashboard" },
    { icon: BookOpen, label: "My Courses", href: "/teacher/courses" },
    { icon: HelpCircle, label: "Question Banks", href: "/teacher/question-banks" },
    { icon: ClipboardList, label: "Quizzes", href: "/teacher/quizzes" },
    { icon: FileText, label: "Assignments", href: "/teacher/assignments" },
    { icon: Users, label: "Students", href: "/teacher/students" },
    { icon: MessageSquare, label: "Q&A", href: "/teacher/qna" },
    { icon: Bell, label: "Notifications", href: "/teacher/notifications" },
    { icon: Wallet, label: "Payouts", href: "/teacher/payouts" },
    { icon: BarChart3, label: "Analytics", href: "/teacher/analytics" },
  ], []);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50">
        {isCollapsed && !isMobile ? (
          <Link href="/teacher/dashboard" className="flex items-center">
            <Image src="/images/lms_logo.png" alt="LMS" width={28} height={28} priority />
          </Link>
        ) : (
          <Link href="/teacher/dashboard" className="flex items-center gap-2">
            <Image src="/images/lms_logo.png" alt="LMS" width={28} height={28} priority />
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[color:var(--brand-primary)]">LMS</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Teacher Portal</p>
            </div>
          </Link>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => {
                if (isMobile) onMobileClose();
              }}
              className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 w-full
                ${active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }
                ${isCollapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${active ? "" : "group-hover:scale-110"}`} />

              {(!isCollapsed || isMobile) && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle - Desktop Only */}
      {!isMobile && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
          <button
            onClick={onToggle}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 
              hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800/50 z-40 shadow-xl"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden flex flex-col fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800/50 z-[70] shadow-2xl"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

TeacherSidebar.displayName = 'TeacherSidebar';