"use client";

import { CreatorGuard } from "@/core/components/guards";
import { TeacherSidebar, TeacherNavbar } from "@/core/components/teacher/layout";
import { useState } from "react";

/**
 * CreatorLayout (Teacher/Instructor) - requireCreator guard
 * Used for teacher routes: /teacher/courses, /teachers/me, /courses/:courseId/versions, etc.
 * Requires: role === "TEACHER" && teacherId != null
 */
export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <CreatorGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <TeacherSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
        <div className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <TeacherNavbar
            onMenuClick={() => setIsMobileOpen(true)}
            isCollapsed={isCollapsed}
          />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </CreatorGuard>
  );
}

