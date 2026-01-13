"use client";

import { memo } from "react";
import { TeacherSidebar, TeacherNavbar } from "@/core/components/teacher/layout";
import { useTeacherLayout } from "./TeacherLayoutProvider";
import { RoutePrefetcher } from "@/core/components/ui/OptimizedNavigation";

const PREFETCH_ROUTES = [
    "/teacher/dashboard",
    "/teacher/courses",
    "/teacher/question-banks",
    "/teacher/quizzes",
    "/teacher/assignments",
    "/teacher/students",
    "/teacher/qna",
    "/teacher/analytics",
];

export const TeacherLayoutContent = memo(({ children }: { children: React.ReactNode }) => {
    const { isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile } = useTeacherLayout();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <RoutePrefetcher routes={PREFETCH_ROUTES} />

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
});

TeacherLayoutContent.displayName = 'TeacherLayoutContent';
