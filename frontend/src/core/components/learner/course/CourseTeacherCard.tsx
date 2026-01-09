// src/components/learner/course/CourseTeacherCard.tsx
import { UserCircle2 } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";
import { SafeImage } from "@/core/components/ui/SafeImage";

export function CourseTeacherCard({ course }: { course: CourseDetail }) {
  const inst = course.instructor;

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
      <h2 className="text-lg font-semibold mb-3">Teacher</h2>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <SafeImage
            src={inst.avatarUrl}
            alt={inst.name}
            fallback="/images/avatars/avatar.png"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
            objectFit="cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">{inst.name}</p>
          <p className="text-xs text-[var(--brand-200)]">{inst.title}</p>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            {inst.about}
          </p>
        </div>
      </div>
    </section>
  );
}
