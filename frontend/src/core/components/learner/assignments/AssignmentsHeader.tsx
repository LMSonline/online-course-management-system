// src/core/components/learner/assignments/AssignmentsHeader.tsx

export function AssignmentsHeader() {
  return (
    <header className="mb-6 md:mb-8">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Quizzes & assignments
      </p>

      <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
        Track your course tasks
      </h1>

      <p className="mt-3 max-w-3xl text-sm md:text-[15px] text-slate-300">
        View all quizzes and assignments across your enrolled courses, check
        due dates, and jump back into tasks you haven&apos;t finished yet.
      </p>
    </header>
  );
}
