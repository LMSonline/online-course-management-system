// src/components/learner/course/CourseIncludes.tsx
import {
  FileVideo,
  Download,
  InfinityIcon,
  Award,
  Smartphone,
  Code,
} from "lucide-react";

const COURSE_INCLUDES = [
  {
    icon: FileVideo,
    label: "18 hours on-demand video",
  },
  {
    icon: Code,
    label: "25 coding exercises",
  },
  {
    icon: Download,
    label: "Downloadable resources",
  },
  {
    icon: InfinityIcon,
    label: "Full lifetime access",
  },
  {
    icon: Smartphone,
    label: "Access on mobile and TV",
  },
  {
    icon: Award,
    label: "Certificate of completion",
  },
];

export function CourseIncludes() {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-6">
      <h3 className="mb-4 text-base md:text-lg font-semibold text-white">
        This course includes
      </h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-200">
        {COURSE_INCLUDES.map(({ icon: Icon, label }, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-600)]/15 text-[var(--brand-400)]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="leading-relaxed">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
