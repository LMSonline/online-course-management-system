// src/core/components/learner/quiz/QuizPlayerShell.tsx
"use client";

import { useMemo, useState } from "react";
import type { QuizDetail } from "@/lib/learner/quiz/types";
import { QuizHeader } from "./QuizHeader";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizSidebar } from "./QuizSidebar";

type Props = {
  quiz: QuizDetail;
};

export function QuizPlayerShell({ quiz }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];

  const answeredSet = useMemo(
    () =>
      new Set(
        Object.entries(answers)
          .filter(([, v]) => v.length > 0)
          .map(([qId]) => qId)
      ),
    [answers]
  );

  const handleOptionChange = (optionId: string) => {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id] ?? [];
      if (currentQuestion.multiple) {
        // toggle
        const exists = current.includes(optionId);
        const next = exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [currentQuestion.id]: next };
      } else {
        return { ...prev, [currentQuestion.id]: [optionId] };
      }
    });
  };

  const goNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = () => {
    // tạm thời chỉ set state, chưa chấm điểm
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        <div className="flex-1 space-y-4 md:space-y-5">
          <QuizHeader quiz={quiz} currentIndex={currentIndex} />

          <QuizQuestionCard
            question={currentQuestion}
            selectedIds={answers[currentQuestion.id] ?? []}
            onChange={handleOptionChange}
          />

          <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="rounded-full border border-white/20 bg-slate-950 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex === quiz.questions.length - 1}
                className="rounded-full border border-white/20 bg-slate-950 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 transition"
              >
                Next
              </button>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              {submitted && (
                <p className="text-[11px] text-emerald-300">
                  Quiz submitted (mock). Scoring will be implemented with backend later.
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-[var(--brand-600)] px-5 py-2 text-xs md:text-sm font-semibold text-slate-950 hover:bg-[var(--brand-700)] transition"
              >
                Submit quiz
              </button>
            </div>
          </div>
        </div>

        <QuizSidebar
          quiz={quiz}
          currentIndex={currentIndex}
          answered={answeredSet}
          onJump={setCurrentIndex}
        />
      </main>
    </div>
  );
}
