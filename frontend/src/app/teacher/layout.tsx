import InstructorNavbar from "@/core/components/instructor/navbar/InstructorNavbar";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <InstructorNavbar />
      {children}
    </div>
  );
}
