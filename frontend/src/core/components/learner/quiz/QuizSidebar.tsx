// src/core/components/learner/quiz/QuizSidebar.tsx
"use client";

import type { QuizDetail } from "@/lib/learner/quiz/types";

type Props = {
  quiz: QuizDetail;
  currentIndex: number;
  answered: Set<string>;
  onJump: (index: number) => void;
};

export function QuizSidebar({ quiz, currentIndex, answered, onJump }: Props) {
  const total = quiz.questions.length;
  const answeredCount = answered.size;

  return (
    <aside className="w-full lg:w-64 xl:w-72 space-y-4">
      <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <span>Progress</span>
          <span>
            {answeredCount}/{total} answered
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--brand-600)]"
            style={{
              width: `${(answeredCount / total) * 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Answers are saved locally while you&apos;re on this page.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
        <h3 className="text-sm font-semibold text-slate-50 mb-3">
          Questions
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answered.has(q.id);

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJump(idx)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition",
                  isCurrent
                    ? "bg-[var(--brand-500)] text-slate-950 shadow-[0_0_16px_rgba(34,197,94,0.6)]"
                    : isAnswered
                    ? "bg-slate-900 text-[var(--brand-200)] border border-[var(--brand-500)]/60"
                    : "bg-slate-900 text-slate-300 border border-white/10 hover:bg-slate-800",
                ].join(" ")}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
