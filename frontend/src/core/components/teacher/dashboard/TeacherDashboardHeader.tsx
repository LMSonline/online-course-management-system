// src/core/components/teacher/dashboard/TeacherDashboardHeader.tsx
type Props = {
  name?: string;
};

export function TeacherDashboardHeader({ name = "Teacher" }: Props) {
  return (
    <header>
      <div className="flex items-center gap-3 mb-4">
        <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
            Teacher Dashboard
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Hi, {name}. Let&apos;s teach today.
      </h1>

      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Overview of your teaching activity: courses, assignments, Q&amp;A and earnings – all in one place.
      </p>
    </header>
  );
}
