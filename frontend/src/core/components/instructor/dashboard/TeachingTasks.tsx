// src/core/components/instructor/dashboard/TeachingTasks.tsx
import { ClipboardList, HelpCircle, CheckCircle2 } from "lucide-react";
import type { TeachingTask } from "@/lib/instructor/dashboard/types";

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
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Teaching tasks
        </h2>
        <p className="text-[11px] text-slate-400">
          Items that may need your attention.
        </p>
      </div>

      <div className="space-y-2">
        {tasks.map((t) => {
          const Icon = typeIcon[t.type];
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5"
            >
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-600)]/15 text-[var(--brand-200)]">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-50">
                  {typeLabel[t.type]} · {t.courseTitle}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {t.summary}
                </p>
              </div>
              <p className="ml-2 text-[11px] text-[var(--brand-200)] whitespace-nowrap">
                {t.dueLabel}
              </p>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <p className="text-[11px] text-slate-500">
            You have no pending tasks. 🎉
          </p>
        )}
      </div>
    </section>
  );
}
