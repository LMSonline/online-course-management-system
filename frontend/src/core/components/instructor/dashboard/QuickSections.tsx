// src/core/components/instructor/dashboard/QuickSections.tsx
import Link from "next/link";
import { ArrowRight, FileText, Users, MessageCircle, Wallet } from "lucide-react";
import type { QuickSection } from "@/lib/instructor/dashboard/types";

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
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Teaching workspace
        </h2>
        <p className="text-[11px] text-slate-400">
          Jump into key instructor areas.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => {
          const Icon = iconMap[s.id] ?? FileText;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950 hover:border-[var(--brand-500)]/70 hover:bg-slate-900/80 transition p-3.5"
            >
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-600)]/15 text-[var(--brand-200)]">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-50">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">
                  {s.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[var(--brand-300)]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
