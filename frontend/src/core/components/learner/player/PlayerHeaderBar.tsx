// src/components/learner/player/PlayerHeaderBar.tsx
"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { PlayerCourse } from "@/lib/learner/player/types";

export function PlayerHeaderBar({ course }: { course: PlayerCourse }) {
  return (
    <header className="flex h-12 md:h-14 items-center justify-between border-b border-white/10 bg-slate-950/95 px-3 sm:px-5 lg:px-8 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/learner/dashboard"
          className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-300 hover:text-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to My learning</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="hidden sm:block h-6 w-px bg-white/10" />
        <p className="truncate text-xs md:text-sm font-medium text-slate-100">
          {course.title}
        </p>
      </div>

      <div className="flex items-center gap-3 text-[11px] md:text-xs">
        <div className="hidden md:flex items-center gap-2">
          <div className="h-1.5 w-28 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-600)]"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-slate-300">{course.progress}% complete</span>
        </div>
        <span className="hidden sm:inline text-slate-400">
          Total: {course.totalDuration}
        </span>
      </div>
    </header>
  );
}
