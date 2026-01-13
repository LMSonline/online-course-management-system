// src/components/learner/course/CourseContentOutline.tsx
"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle, Sparkles } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  duration: string;
  previewable: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

// Demo data (giữ nguyên tinh thần bản bạn gửi)
const SECTIONS: Section[] = [
  {
    id: "ch1",
    title: "Chapter 1 · Orientation",
    lessons: [
      {
        id: "l1",
        title: "Welcome & How this course works",
        duration: "04:32",
        previewable: false,
      },
      {
        id: "l2",
        title: "Setup & tooling (0 videos + attachments only)",
        duration: "--",
        previewable: true,
      },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2 · Core Concepts",
    lessons: [
      {
        id: "l3",
        title: "React mental model (2 videos + attachment + quiz)",
        duration: "08:20",
        previewable: false,
      },
      {
        id: "l4",
        title: "Practice lab (3 videos, no quiz)",
        duration: "03:05",
        previewable: false,
      },
    ],
  },
];

export function CourseContentOutline() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(SECTIONS.map(s => [s.id, true])) // mặc định mở
  );

  const totalLectures = SECTIONS.reduce(
    (sum, s) => sum + s.lessons.length,
    0
  );

  const allExpanded = Object.values(openSections).every(Boolean);

  const toggleAll = () => {
    const next = !allExpanded;
    setOpenSections(
      Object.fromEntries(SECTIONS.map(s => [s.id, next]))
    );
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* subtle accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />

      <div className="relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--brand-400)]" />
              <h2 className="text-base md:text-lg font-semibold text-white">
                Course content
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {SECTIONS.length} sections • {totalLectures} lessons
            </p>
          </div>

          <button
            onClick={toggleAll}
            className="text-xs font-semibold text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </header>

        {/* Sections */}
        <div className="divide-y divide-white/10">
          {SECTIONS.map(section => {
            const open = openSections[section.id];

            return (
              <div key={section.id}>
                {/* Section header */}
                <button
                  onClick={() =>
                    setOpenSections(s => ({
                      ...s,
                      [section.id]: !s[section.id],
                    }))
                  }
                  className="flex w-full items-center justify-between px-4 md:px-6 py-3 text-sm text-left hover:bg-slate-900/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                    <span className="font-medium text-white">
                      {section.title}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    {section.lessons.length} lessons
                  </span>
                </button>

                {/* Lessons */}
                {open && (
                  <div className="px-4 md:px-6 py-2 space-y-1 text-sm">
                    {section.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                          lesson.previewable
                            ? "bg-slate-900/80 border border-[var(--brand-600)]/30"
                            : "hover:bg-slate-900/60"
                        }`}
                      >
                        <PlayCircle
                          className={`h-4 w-4 shrink-0 ${
                            lesson.previewable
                              ? "text-[var(--brand-400)]"
                              : "text-slate-500"
                          }`}
                        />

                        <span className="min-w-0 text-slate-200 leading-relaxed">
                          <span className="text-slate-400">
                            Lesson {idx + 1} •{" "}
                          </span>
                          {lesson.title}
                        </span>

                        <span className="ml-auto text-[11px] text-slate-400">
                          {lesson.duration}
                        </span>

                        {lesson.previewable && (
                          <span className="ml-2 rounded-full bg-[var(--brand-600)]/20 px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-300)]">
                            Preview
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
