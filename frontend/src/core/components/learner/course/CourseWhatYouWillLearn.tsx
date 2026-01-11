// src/components/learner/course/CourseWhatYouWillLearn.tsx
import { useState } from "react";

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

  const visibleItems = expanded
    ? [...CORE_LEARNING_OUTCOMES, ...ADVANCED_LEARNING_OUTCOMES]
    : CORE_LEARNING_OUTCOMES;

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-6">
      <h2 className="mb-4 text-lg md:text-xl font-semibold text-white">
        What you&apos;ll learn
      </h2>

      <div className="grid gap-x-6 gap-y-3 md:grid-cols-2 text-sm text-slate-200">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-600)]/20 text-[var(--brand-400)] text-xs font-semibold">
              ✓
            </span>
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div className="mt-5">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-semibold text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>
    </section>
  );
}
