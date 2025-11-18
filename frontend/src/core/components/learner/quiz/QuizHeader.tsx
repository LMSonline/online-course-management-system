// src/core/components/learner/quiz/QuizHeader.tsx
import type { QuizDetail } from "@/lib/learner/quiz/types";

type Props = {
  quiz: QuizDetail;
  currentIndex: number;
};

export function QuizHeader({ quiz, currentIndex }: Props) {
  const total = quiz.questions.length;

  return (
    <header className="mb-4 md:mb-6">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Quiz
      </p>

      <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
        {quiz.title}
      </h1>

      <p className="mt-2 text-sm md:text-[15px] text-slate-300">
        {quiz.courseTitle}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span>{quiz.estimatedMinutes} min • {quiz.totalPoints} points</span>
      </div>
    </header>
  );
}
