// src/components/learner/player/LessonSidebar.tsx
"use client";

import { ChevronDown, CheckCircle2, PlayCircle } from "lucide-react";
import type { PlayerSection } from "@/lib/learner/player/types";
import { cn } from "@/lib/cn";

type Props = {
  sections: PlayerSection[];
  currentLessonId: string;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
};

export function LessonSidebar({ sections, currentLessonId, onSelectLesson }: Props) {
  return (
    <aside className="w-full lg:w-80 xl:w-96 border-l border-white/10 bg-slate-950/95 max-h-[calc(100vh-3.5rem)] lg:max-h-[calc(100vh-3.5rem)]">
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs font-medium text-slate-200">
            Course content
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Click a lesson to start watching.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/40">
          <div className="divide-y divide-white/10">
            {sections.map((sec) => (
              <SectionGroup
                key={sec.id}
                section={sec}
                currentLessonId={currentLessonId}
                onSelectLesson={onSelectLesson}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function SectionGroup({
  section,
  currentLessonId,
  onSelectLesson,
}: {
  section: PlayerSection;
  currentLessonId: string;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
}) {
  return (
    <details className="group" open>
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs md:text-sm hover:bg-slate-900/80">
        <div className="flex items-center gap-2">
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition" />
          <span className="font-medium">{section.title}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          {section.lecturesCount} lectures • {section.duration}
        </div>
      </summary>
      <div className="pb-2">
        {section.lessons.map((lesson) => {
          const active = lesson.id === currentLessonId;
          const completed = lesson.completed;
          return (
            <button
              key={lesson.id}
              type="button"
              className={cn(
                "w-full px-4 py-2.5 text-left text-xs md:text-[13px] flex items-center gap-2",
                "hover:bg-slate-900/80",
                active && "bg-[color:rgba(34,197,94,0.15)] border-l-2 border-[var(--brand-500)]"
              )}
              onClick={() => onSelectLesson(section.id, lesson.id)}
            >
              <span className="flex-shrink-0">
                {completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <PlayCircle
                    className={cn(
                      "w-4 h-4",
                      active ? "text-[var(--brand-400)]" : "text-slate-500"
                    )}
                  />
                )}
              </span>
              <span className="flex-1 min-w-0 truncate">{lesson.title}</span>
              <span className="text-[11px] text-slate-400">
                {lesson.duration}
              </span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
