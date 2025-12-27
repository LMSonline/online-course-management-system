// src/core/components/teacher/course-management/CurriculumEditor.tsx
"use client";

import {
  GripVertical,
  PlayCircle,
  HelpCircle,
  ClipboardList,
  Database,
  Plus,
} from "lucide-react";
import type {
  CurriculumSection,
  CurriculumItem,
} from "@/lib/teacher/course-management/types";

type Props = {
  sections: CurriculumSection[];
  selectedItemId?: string;
  onSelectItem: (item: CurriculumItem, sectionId: string) => void;
};

function itemIcon(type: CurriculumItem["type"]) {
  switch (type) {
    case "lecture":
      return PlayCircle;
    case "quiz":
      return HelpCircle;
    case "assignment":
      return ClipboardList;
    case "question-bank":
      return Database;
    default:
      return PlayCircle;
  }
}

export function CurriculumEditor({ sections, selectedItemId, onSelectItem }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-3.5 md:p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-slate-50">
          Curriculum
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-900 transition"
        >
          <Plus className="w-3 h-3" />
          New section
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-white/10 bg-slate-950/90"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <GripVertical className="h-4 w-4 text-slate-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-50">
                  {s.title}
                </p>
                {s.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {s.description}
                  </p>
                )}
              </div>
              <button className="rounded-full border border-white/15 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-900">
                + Add item
              </button>
            </div>

            <div className="px-2.5 py-2 space-y-1.5">
              {s.items.map((item) => {
                const Icon = itemIcon(item.type);
                const isSelected = item.id === selectedItemId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item, s.id)}
                    className={[
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition",
                      isSelected
                        ? "bg-[var(--brand-600)]/20 text-[var(--brand-50)] border border-[var(--brand-500)]/70"
                        : "bg-slate-950 text-slate-200 border border-transparent hover:border-white/15 hover:bg-slate-900",
                    ].join(" ")}
                  >
                    <GripVertical className="h-3 w-3 text-slate-600 flex-shrink-0" />
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-900/90">
                      <Icon className="h-3.5 w-3.5 text-[var(--brand-300)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{item.title}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="capitalize">
                          {item.type.replace("-", " ")}
                        </span>
                        {item.duration && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                            <span>{item.duration}</span>
                          </>
                        )}
                        {item.questionsCount != null && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                            <span>{item.questionsCount} questions</span>
                          </>
                        )}
                        {item.isPreview && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                            <span className="text-emerald-300">Preview</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
