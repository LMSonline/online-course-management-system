// src/components/learner/player/CoursePlayerShell.tsx
"use client";

import { useState } from "react";
import { PlayerHeaderBar } from "./PlayerHeaderBar";
import { LessonSidebar } from "./LessonSidebar";
import { LessonContent } from "./LessonContent";
import type { PlayerCourseMeta } from "@/lib/learner/player/types";

export function CoursePlayerShell({ course }: { course: PlayerCourseMeta }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const currentLessonId =
    course.sections[currentSectionIndex].lessons[currentLessonIndex].id;

  function handleSelectLesson(sectionId: string, lessonId: string) {
    const secIndex = course.sections.findIndex((s) => s.id === sectionId);
    if (secIndex === -1) return;
    const lessonIndex = course.sections[secIndex].lessons.findIndex(
      (l) => l.id === lessonId
    );
    if (lessonIndex === -1) return;
    setCurrentSectionIndex(secIndex);
    setCurrentLessonIndex(lessonIndex);
  }

  function handlePrev() {
    const sec = course.sections[currentSectionIndex];
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((i) => i - 1);
      return;
    }
    if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1];
      setCurrentSectionIndex((i) => i - 1);
      setCurrentLessonIndex(prevSection.lessons.length - 1);
    }
  }

  function handleNext() {
    const sec = course.sections[currentSectionIndex];
    if (currentLessonIndex < sec.lessons.length - 1) {
      setCurrentLessonIndex((i) => i + 1);
      return;
    }
    if (currentSectionIndex < course.sections.length - 1) {
      setCurrentSectionIndex((i) => i + 1);
      setCurrentLessonIndex(0);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <PlayerHeaderBar course={course} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <LessonContent
          courseTitle={course.title}
          sections={course.sections}
          currentSectionIndex={currentSectionIndex}
          currentLessonIndex={currentLessonIndex}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <LessonSidebar
          sections={course.sections}
          currentLessonId={currentLessonId}
          onSelectLesson={handleSelectLesson}
        />
      </div>
    </div>
  );
}
