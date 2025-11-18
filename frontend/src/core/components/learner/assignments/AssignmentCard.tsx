// src/core/components/learner/assignments/AssignmentCard.tsx
"use client";

import { Clock, BookOpenCheck, FileText } from "lucide-react";
import type { AssessmentSummary } from "@/lib/learner/assignments/types";

type Props = {
  item: AssessmentSummary;
  onOpen?: (item: AssessmentSummary) => void;
};

const statusColorMap: Record<AssessmentSummary["status"], string> = {
  "Not started": "bg-slate-900 text-slate-200 border-white/15",
  "In progress": "bg-[var(--brand-600)]/15 text-[var(--brand-100)] border-[var(--brand-500)]/60",
  "Submitted": "bg-slate-900 text-slate-200 border-white/15",
  "Graded": "bg-emerald-500/15 text-emerald-200 border-emerald-400/60",
  "Overdue": "bg-rose-500/15 text-rose-200 border-rose-500/70",
};

export function AssignmentCard({ item, onOpen }: Props) {
  const Icon = item.type === "Quiz" ? BookOpenCheck : FileText;
  const statusClasses = statusColorMap[item.status];

  const handleClick = () => {
    if (onOpen) onOpen(item);
  };

  return (
    <article
      onClick={handleClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/80 p-4 hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_24px_rgba(34,197,94,0.4)] transition"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--brand-600)]/15 text-[var(--brand-200)]">
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-50 line-clamp-2">
              {item.title}
            </p>
            {item.tag && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                {item.tag}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {item.courseTitle} • {item.courseLevel}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {item.status}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.dueLabel}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span>{item.estimatedMinutes} min</span>
          </div>

          {item.status === "Graded" && item.score != null && item.maxScore && (
            <p className="mt-2 text-xs text-emerald-300">
              Score:{" "}
              <span className="font-semibold">
                {item.score}/{item.maxScore}
              </span>{" "}
              ({Math.round((item.score / item.maxScore) * 100)}%)
            </p>
          )}

          {item.attemptsUsed != null && item.maxAttempts != null && (
            <p className="mt-1 text-[11px] text-slate-400">
              Attempts: {item.attemptsUsed}/{item.maxAttempts}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-[var(--brand-200)] group-hover:bg-[var(--brand-600)] group-hover:text-slate-950 transition">
          {item.status === "Not started"
            ? "Start"
            : item.status === "In progress"
            ? "Continue"
            : item.status === "Overdue"
            ? "Submit now"
            : "View details"}
        </button>
      </div>
    </article>
  );
}
