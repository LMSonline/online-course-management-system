"use client";

import { TeacherSidebar, TeacherNavbar } from "@/core/components/teacher/layout";
import { useTeacherLayout } from "./TeacherLayoutProvider";

export function TeacherLayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile } = useTeacherLayout();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <TeacherSidebar
                isCollapsed={isCollapsed}
                onToggle={toggleCollapsed}
                isMobileOpen={isMobileOpen}
                onMobileClose={closeMobile}
            />

            <div className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <TeacherNavbar
                    onMenuClick={openMobile}
                    isCollapsed={isCollapsed}
                />
                <main>{children}</main>
            </div>
        </div>
    );
}
