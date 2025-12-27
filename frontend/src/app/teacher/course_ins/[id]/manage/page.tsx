// src/app/(instructor)/courses/[id]/manage/page.tsx
import { notFound } from "next/navigation";
import { CourseManageHeader } from "@/core/components/teacher/course-management/CourseManageHeader";
import { CourseManagementShell } from "@/core/components/teacher/course-management/CourseManagementShell";
import { MOCK_TEACHER_COURSE_MANAGE } from "@/lib/teacher/course-management/types";

export default function TeacherCourseManagePage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: sau này fetch theo id từ BE
  const course =
    params.id === MOCK_TEACHER_COURSE_MANAGE.id ? MOCK_TEACHER_COURSE_MANAGE : null;

  if (!course) return notFound();

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <CourseManageHeader course={course} />
        <CourseManagementShell course={course} />
      </section>
    </main>
  );
}
