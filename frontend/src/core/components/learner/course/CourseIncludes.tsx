// src/components/learner/course/CourseIncludes.tsx
"use client";

import {
  FileVideo,
  Download,
  InfinityIcon,
  Award,
  Smartphone,
  Code,
  Sparkles,
} from "lucide-react";

const COURSE_INCLUDES = [
  {
    icon: FileVideo,
    label: "18 hours of on-demand video",
  },
  {
    icon: Code,
    label: "25 hands-on coding exercises",
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
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* subtle accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--brand-400)]" />
          <h3 className="text-base md:text-lg font-semibold text-white">
            This course includes
          </h3>
        </div>

        {/* Content */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-[15px] text-slate-200">
          {COURSE_INCLUDES.map(({ icon: Icon, label }, idx) => (
            <li
              key={idx}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-white/[0.04]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-600)]/15 text-[var(--brand-400)] transition group-hover:bg-[var(--brand-600)]/25">
                <Icon className="h-4.5 w-4.5" />
              </span>

              <span className="leading-relaxed text-slate-200">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
