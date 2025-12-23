import TeacherNavbar from "@/core/components/teacher/navbar/TeacherNavbar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TeacherNavbar />
            <main className="min-h-[72vh]">{children}</main>
        </>
    );
}