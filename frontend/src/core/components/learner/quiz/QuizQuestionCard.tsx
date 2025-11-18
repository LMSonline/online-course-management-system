// src/core/components/learner/quiz/QuizQuestionCard.tsx
"use client";

import type { QuizQuestion } from "@/lib/learner/quiz/types";

type Props = {
  question: QuizQuestion;
  selectedIds: string[];
  onChange: (optionId: string) => void;
};

export function QuizQuestionCard({ question, selectedIds, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand-300)] mb-1">
          {question.multiple ? "Multiple choice (Select all that apply)" : "Single choice"}
        </p>
        <h2 className="text-base md:text-lg font-semibold text-slate-50">
          {question.text}
        </h2>
        <p className="mt-1 text-xs text-slate-400">{question.points} points</p>
      </div>

      <div className="space-y-2">
        {question.options.map((opt) => {
          const checked = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={[
                "w-full text-left rounded-xl border px-3 py-2.5 text-sm md:text-[15px] transition",
                checked
                  ? "border-[var(--brand-500)] bg-[var(--brand-600)]/20 text-[var(--brand-50)] shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                  : "border-white/15 bg-slate-950 hover:border-[var(--brand-500)]/70 hover:bg-slate-900",
              ].join(" ")}
            >
              <div className="flex items-start gap-2">
                <span
                  className={[
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    checked
                      ? "border-[var(--brand-400)] bg-[var(--brand-500)] text-slate-950"
                      : "border-slate-500 text-slate-300",
                  ].join(" ")}
                >
                  {question.multiple ? (
                    checked ? "✓" : ""
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="text-slate-100">{opt.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
