import TeacherNavbar from "@/core/components/teacher/navbar/TeacherNavbar";


export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <TeacherNavbar />
      {children}
    </div>
  );
}
