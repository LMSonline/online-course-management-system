// src/components/learner/course/CourseWhatYouWillLearn.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

const CORE_LEARNING_OUTCOMES = [
  "Build real-world React applications using TypeScript and modern hooks.",
  "Design clean, scalable frontend architecture suitable for production systems.",
  "Integrate REST APIs and handle loading, error, and empty states professionally.",
  "Manage complex state effectively using best-practice patterns.",
  "Write reusable, maintainable components with strong typing.",
  "Apply modern UI/UX principles to improve user experience.",
];

const ADVANCED_LEARNING_OUTCOMES = [
  "Optimize application performance with memoization and rendering strategies.",
  "Structure large-scale React projects for long-term maintainability.",
  "Implement advanced patterns such as compound components and custom hooks.",
  "Handle real-world edge cases commonly encountered in production apps.",
  "Improve developer experience with better tooling and project conventions.",
  "Think like a senior frontend engineer when building features.",
];

export function CourseWhatYouWillLearn() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--brand-400)]" />
          <h2 className="text-base md:text-lg font-semibold text-white">
            What you’ll learn
          </h2>
        </div>

        {/* Core outcomes */}
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-2 text-sm md:text-[15px] text-slate-200">
          {CORE_LEARNING_OUTCOMES.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-400)]" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>

        {/* Advanced outcomes */}
        {expanded && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--brand-300)]">
              <span className="rounded-full bg-[var(--brand-600)]/20 px-2 py-0.5">
                Advanced
              </span>
              <span>For deeper mastery</span>
            </div>

            <div className="grid gap-x-6 gap-y-3 md:grid-cols-2 text-sm md:text-[15px] text-slate-300">
              {ADVANCED_LEARNING_OUTCOMES.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setExpanded(v => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
          >
            {expanded ? "Show less" : "Show advanced topics"}
            <span className="text-lg leading-none">
              {expanded ? "−" : "+"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
