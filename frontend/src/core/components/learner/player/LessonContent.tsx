// src/components/learner/player/LessonContent.tsx
"use client";

import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { PlayerLesson, PlayerSection } from "@/lib/learner/player/types";

type Props = {
  courseTitle: string;
  sections: PlayerSection[];
  currentSectionIndex: number;
  currentLessonIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

export function LessonContent({
  courseTitle,
  sections,
  currentSectionIndex,
  currentLessonIndex,
  onPrev,
  onNext,
}: Props) {
  const section = sections[currentSectionIndex];
  const lesson = section.lessons[currentLessonIndex];

  const hasPrev =
    currentSectionIndex > 0 || currentLessonIndex > 0;
  const hasNext =
    currentSectionIndex < sections.length - 1 ||
    currentLessonIndex < section.lessons.length - 1;

  return (
    <div className="flex-1 flex flex-col max-h-[calc(100vh-3.5rem)] lg:max-h-[calc(100vh-3.5rem)]">
      {/* Video area */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black border-b border-white/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(190,242,100,0.2),_transparent)]" />
        <button className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl hover:scale-105 transition">
          <Play className="w-6 h-6" />
        </button>
      </div>

      {/* Lesson info + controls */}
      <div className="flex-1 overflow-y-auto bg-slate-950 px-4 sm:px-6 lg:px-10 py-4 md:py-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--brand-300)] mb-1">
            {courseTitle}
          </p>
          <h1 className="text-base md:text-lg font-semibold text-slate-50">
            {lesson.title}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {section.title} • {lesson.duration}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-3 md:p-4">
          <h2 className="text-xs font-semibold text-slate-200 mb-2">
            Lesson overview
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            This is a placeholder description for the current lesson. You can fetch
            the real lesson content, transcript or summary from your API and render
            it here. For now, we focus on the player layout and interactions.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/80 p-3 md:p-4">
          <h3 className="text-xs font-semibold text-slate-200 mb-2">
            Resources & downloads
          </h3>
          <p className="text-xs text-slate-400">
            Attach slides, code examples or external links for this lesson.
          </p>
        </div>

        {/* Prev / Next controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-white/5">
          <div className="text-[11px] text-slate-400">
            Use the sidebar to jump to any lesson, or continue in order.
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={onPrev}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800/80"
            >
              <ChevronLeft className="w-3 h-3" />
              Previous
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={onNext}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-600)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--brand-900)]"
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
