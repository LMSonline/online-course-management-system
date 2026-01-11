import { TeacherLayoutProvider } from "@/core/components/teacher/layout/TeacherLayoutProvider";
import { TeacherLayoutContent } from "@/core/components/teacher/layout/TeacherLayoutContent";
import { Suspense } from "react";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherLayoutProvider>
      <TeacherLayoutContent>
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse" />}>
          {children}
        </Suspense>
      </TeacherLayoutContent>
    </TeacherLayoutProvider>
  );
}
