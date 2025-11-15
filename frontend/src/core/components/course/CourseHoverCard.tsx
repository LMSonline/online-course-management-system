"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHoverFloat } from "@/core/components/hooks/UseHoverFloat"; // <— check your path
import { useEffect } from "react";

export type CoursePreview = {
  title: string;
  updated?: string;
  meta?: string;           // "15 total hours · Beginner Level · Subtitles"
  summary?: string;
  bullets?: string[];
  price?: string;
  ctaLabel?: string;       // "Add to cart" / "View details"
};

export default function CourseHoverCard({
  anchorClassName,
  children,
  preview,
}: {
  anchorClassName?: string;
  children: React.ReactNode; // Usually your <CourseCard /> / <SkillCourseCard />
  preview: CoursePreview;
}) {
  const { open, setOpen, placement, ref, panelRef, onEnter, onLeave } = useHoverFloat();

  // close if anchor unmounts (e.g., tab/slide changes)
  useEffect(() => () => setOpen(false), [setOpen]);

  // position + arrow
  const posStyle = (() => {
    switch (placement) {
      case "left":
        return "right-[calc(100%+10px)] top-2";
      case "top":
        return "left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)]";
      case "bottom":
        return "left-1/2 -translate-x-1/2 top-[calc(100%+10px)]";
      default:
        return "left-[calc(100%+10px)] top-2";
    }
  })();

  const arrow = (() => {
    const base =
      "absolute size-3 rotate-45 bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-700/60";
    switch (placement) {
      case "left":
        return cn(base, "left-full top-6");
      case "top":
        return cn(base, "top-full left-1/2 -translate-x-1/2");
      case "bottom":
        return cn(base, "bottom-full left-1/2 -translate-x-1/2");
      default:
        return cn(base, "right-full top-6");
    }
  })();

  return (
    <div
      ref={ref}
      className={cn("relative", anchorClassName)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      {children}

      {open && (
        <div
          ref={panelRef}
          className={cn(
            "absolute z-40 w-[380px] max-w-[86vw]",
            posStyle,
            "rounded-2xl border border-white/15 bg-white dark:bg-slate-900",
            "shadow-[0_20px_80px_-20px_rgba(0,0,0,.35)] p-5"
          )}
          role="dialog"
        >
          <div className="absolute inset-0 pointer-events-none rounded-2xl ring-0 hover:ring-1 ring-lime-300/20 transition" />
          <div className={arrow} />

          <h4 className="text-lg font-bold leading-snug pr-6">{preview.title}</h4>

          {preview.updated && (
            <p className="mt-1 text-xs">
              <span className="text-muted-foreground">Updated </span>
              <span className="font-semibold text-emerald-400">{preview.updated}</span>
            </p>
          )}

          {preview.meta && <p className="mt-1 text-xs text-muted-foreground">{preview.meta}</p>}

          {preview.summary && (
            <p className="mt-3 text-sm leading-relaxed">{preview.summary}</p>
          )}

          {preview.bullets?.length ? (
            <ul className="mt-3 space-y-2">
              {preview.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 text-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            {preview.price && <div className="text-base font-bold">{preview.price}</div>}
            <button
              className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-lg
                         bg-[#65D830] text-black font-semibold
                         shadow-[0_6px_20px_rgba(101,216,48,.35)]
                         hover:shadow-[0_8px_26px_rgba(101,216,48,.45)]
                         transition-all"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: add to cart / navigate
              }}
            >
              {preview.ctaLabel ?? "Add to cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
