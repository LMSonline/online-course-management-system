// src/core/components/teacher/course-management/ItemInspector.tsx
"use client";

import type {
  CurriculumItem,
  CurriculumSection,
} from "@/lib/teacher/course-management/types";

type Props = {
  item?: CurriculumItem;
  section?: CurriculumSection;
};

export function ItemInspector({ item, section }: Props) {
  if (!item || !section) {
    return (
      <section className="rounded-2xl border border-dashed border-white/15 bg-slate-950/60 p-4 md:p-5 flex items-center justify-center text-center">
        <p className="text-xs md:text-sm text-slate-400 max-w-xs">
          Select a lecture, quiz, assignment or question bank from the
          curriculum to edit its details here.
        </p>
      </section>
    );
  }

  const typeLabel = item.type
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--brand-300)]">
          Edit {typeLabel}
        </p>
        <h2 className="mt-1 text-sm md:text-base font-semibold text-slate-50">
          {item.title}
        </h2>
        <p className="mt-1 text-[11px] text-slate-500">
          Section: <span className="text-slate-200">{section.title}</span>
        </p>
      </div>

      <div className="space-y-3 text-xs md:text-sm">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-slate-400">
            Title
          </label>
          <input
            className="w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs md:text-sm text-slate-50 outline-none focus:border-[var(--brand-500)]"
            defaultValue={item.title}
          />
        </div>

        {(item.type === "lecture" || item.type === "quiz") && (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-400">
              Duration (mm:ss)
            </label>
            <input
              className="w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs md:text-sm text-slate-50 outline-none focus:border-[var(--brand-500)]"
              defaultValue={item.duration ?? ""}
              placeholder="e.g. 08:45"
            />
          </div>
        )}

        {(item.type === "quiz" || item.type === "question-bank") && (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-400">
              Number of questions
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs md:text-sm text-slate-50 outline-none focus:border-[var(--brand-500)]"
              defaultValue={item.questionsCount ?? 0}
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <label className="text-[11px] font-medium text-slate-400 flex-1">
            Mark as free preview
          </label>
          <input
            type="checkbox"
            defaultChecked={item.isPreview}
            className="h-4 w-4 rounded border border-white/20 bg-slate-950"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <p className="text-[11px] text-slate-500">
          Changes are not visible to students until you publish this version.
        </p>
        <div className="flex gap-2">
          <button className="rounded-full border border-white/20 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-900">
            Discard
          </button>
          <button className="rounded-full bg-[var(--brand-600)] px-3.5 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-[var(--brand-700)]">
            Save changes
          </button>
        </div>
      </div>
    </section>
  );
}
