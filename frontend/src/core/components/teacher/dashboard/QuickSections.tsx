// src/core/components/teacher/dashboard/QuickSections.tsx
import Link from "next/link";
import { ArrowRight, FileText, Users, MessageCircle, Wallet } from "lucide-react";
import type { QuickSection } from "@/lib/teacher/dashboard/types";

type Props = {
  sections: QuickSection[];
};

export function QuickSections({ sections }: Props) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    courses: FileText,
    assignments: FileText,
    students: Users,
    messages: MessageCircle,
    earnings: Wallet,
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Teaching workspace
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Jump into key areas
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => {
          const Icon = iconMap[s.id] ?? FileText;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {s.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
