// src/components/learner/course/CourseTeacherCard.tsx
import { UserCircle2 } from "lucide-react";

import type { CourseDetail } from "@/lib/learner/course/types";
import { SafeImage } from "@/core/components/ui/SafeImage";
import { useTeacherPublicProfile } from "@/hooks/public/useTeacherPublicProfile";


export function CourseTeacherCard({ course }: { course: CourseDetail }) {
  // Try to get teacherId from course.instructor.id or course.instructorId
  const teacherId = (course as any).instructorId || (course.instructor && (course.instructor as any).id);
  const { data: teacher, isLoading, error } = useTeacherPublicProfile(teacherId);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
      <h2 className="text-lg font-semibold mb-3">Teacher</h2>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <SafeImage
            src={teacher?.avatarUrl || course.instructor.avatarUrl}
            alt={teacher?.fullName || course.instructor.name}
            fallback="/images/avatars/avatar.png"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
            objectFit="cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">
            {isLoading ? "Loading..." : teacher?.fullName || course.instructor.name}
          </p>
          <p className="text-xs text-[var(--brand-200)]">
            {teacher?.headline || course.instructor.title}
          </p>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            {teacher?.bio || course.instructor.about}
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-2">Failed to load teacher info.</p>
          )}
        </div>
      </div>
    </section>
  );
}
