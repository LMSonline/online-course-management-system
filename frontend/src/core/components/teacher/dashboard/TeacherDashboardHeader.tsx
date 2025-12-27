// src/core/components/teacher/dashboard/TeacherDashboardHeader.tsx
type Props = {
  name?: string;
};

export function TeacherDashboardHeader({ name = "Teacher" }: Props) {
  return (
    <header className="mb-5 md:mb-7">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Teacher dashboard
      </p>

      <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
        Hi, {name}. Let&apos;s teach today.
      </h1>

      <p className="mt-2 text-sm md:text-[15px] text-slate-300 max-w-2xl">
        Overview of your teaching activity: courses, assignments, Q&amp;A and
        earnings – all in one place.
      </p>
    </header>
  );
}
