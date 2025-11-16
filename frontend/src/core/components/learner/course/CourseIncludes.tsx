// src/components/learner/course/CourseIncludes.tsx
import type { CourseDetail } from "@/lib/learner/course/types";
import { FileVideo, Download, InfinityIcon, Award, Smartphone } from "lucide-react";

const iconMap = [FileVideo, Download, InfinityIcon, Smartphone, Award];

export function CourseIncludes({ course }: { course: CourseDetail }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
      <h3 className="text-base font-semibold mb-3">This course includes</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200">
        {course.includes.map((inc, i) => {
          const Icon = iconMap[i] ?? FileVideo;
          return (
            <li key={i} className="inline-flex items-center gap-2">
              <Icon className="w-4 h-4 text-[var(--brand-400)]" />
              <span>{inc}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
