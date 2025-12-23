// src/core/components/teacher/course-management/VersionSwitcher.tsx
"use client";

import type { CourseVersion } from "@/lib/teacher/course-management/types";

type Props = {
  versions: CourseVersion[];
  selectedId: string;
  onChange: (id: string) => void;
};

export function VersionSwitcher({ versions, selectedId, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-3 md:p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-50">Course versions</p>
        <button className="text-[11px] text-[var(--brand-200)] hover:text-[var(--brand-100)]">
          + New draft
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {versions.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={[
              "rounded-full border px-3 py-1 text-[11px] font-medium transition",
              selectedId === v.id
                ? "border-[var(--brand-500)] bg-[var(--brand-600)]/20 text-[var(--brand-50)]"
                : "border-white/15 bg-slate-950 text-slate-300 hover:border-[var(--brand-500)]/60",
            ].join(" ")}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">
        Manage drafts and published versions of this course.
      </p>
    </section>
  );
}
