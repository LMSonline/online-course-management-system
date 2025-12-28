import { TeacherLayoutProvider } from "@/core/components/teacher/layout/TeacherLayoutProvider";
import { TeacherLayoutContent } from "@/core/components/teacher/layout/TeacherLayoutContent";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherLayoutProvider>
      <TeacherLayoutContent>
        {children}
      </TeacherLayoutContent>
    </TeacherLayoutProvider>
  );
}
