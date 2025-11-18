// src/components/learner/catalog/CategoryTabs.tsx
"use client";

import { COURSE_CATEGORIES, CategoryKey } from "@/lib/learner/catalog/types";

type Props = {
  active: CategoryKey;
  onChange: (c: CategoryKey) => void;
};

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <nav className="mb-4 md:mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700/70 scrollbar-track-transparent">
        {COURSE_CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={[
                "flex-shrink-0 rounded-full border px-4 py-2 text-xs md:text-sm font-medium transition",
                isActive
                  ? "border-[var(--brand-500)] bg-[var(--brand-600)] text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                  : "border-white/10 bg-slate-950/70 text-slate-200 hover:border-[var(--brand-400)] hover:bg-slate-900",
              ].join(" ")}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
