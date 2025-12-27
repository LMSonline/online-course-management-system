// src/core/components/teacher/dashboard/TeachingTasks.tsx
import { ClipboardList, HelpCircle, CheckCircle2 } from "lucide-react";
import type { TeachingTask } from "@/lib/teacher/dashboard/types";

type Props = {
  tasks: TeachingTask[];
};

const typeLabel: Record<TeachingTask["type"], string> = {
  assignment: "Assignment",
  quiz: "Quiz",
  qa: "Q&A",
};

const typeIcon: Record<TeachingTask["type"], React.ComponentType<any>> = {
  assignment: ClipboardList,
  quiz: CheckCircle2,
  qa: HelpCircle,
};

export function TeachingTasks({ tasks }: Props) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Teaching tasks
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Items needing attention
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => {
          const Icon = typeIcon[t.type];
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {typeLabel[t.type]} · {t.courseTitle}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t.summary}
                </p>
              </div>
              <p className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-medium whitespace-nowrap">
                {t.dueLabel}
              </p>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
            You have no pending tasks. 🎉
          </p>
        )}
      </div>
    </section>
  );
}
