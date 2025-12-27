"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { CourseApprovalItem } from "@/lib/admin/types";

type Props = {
  items: CourseApprovalItem[];
};

const statusChip: Record<
  CourseApprovalItem["status"],
  string
> = {
  Pending: "bg-amber-500/10 text-amber-200 border-amber-500/60",
  Approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/60",
  Rejected: "bg-rose-500/10 text-rose-200 border-rose-500/60",
  NeedsChanges: "bg-sky-500/10 text-sky-200 border-sky-500/60",
};

export function AdminCourseApprovalList({ items }: Props) {
  const pending = items.filter((i) => i.status === "Pending");
  const others = items.filter((i) => i.status !== "Pending");

  return (
    <section className="space-y-4">
      {/* Pending first */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Courses awaiting approval
          </h2>
          <p className="text-[11px] text-slate-400">
            {pending.length} pending request(s).
          </p>
        </div>

        {pending.length === 0 && (
          <p className="text-xs text-slate-400">
            There are no courses waiting for review. 🎉
          </p>
        )}

        <div className="space-y-3">
          {pending.map((c) => (
            <CourseApprovalCard key={c.id} item={c} highlight />
          ))}
        </div>
      </div>

      {/* Others (history) */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Recent decisions
          </h2>
          <p className="text-[11px] text-slate-400">
            History of recently approved / rejected courses.
          </p>
        </div>
        <div className="space-y-3">
          {others.map((c) => (
            <CourseApprovalCard key={c.id} item={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseApprovalCard({
  item,
  highlight,
}: {
  item: CourseApprovalItem;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border px-3.5 py-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between",
        highlight
          ? "border-amber-500/60 bg-amber-500/5"
          : "border-white/10 bg-slate-950/80",
      ].join(" ")}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-50">
          {item.title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {item.category} • {item.level} • {item.durationLabel} •{" "}
          {item.lecturesCount} lectures
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Teacher:{" "}
          <span className="text-slate-100">{item.teacherName}</span> (
          {item.teacherEmail}) · Submitted at {item.submittedAt}
        </p>
        <p className="mt-1 text-[11px] text-[var(--brand-200)]">
          Price: ${item.price.toFixed(2)} (one-time)
        </p>
      </div>

      <div className="mt-2 flex flex-col items-stretch gap-2 md:mt-0 md:w-56">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${statusChip[item.status]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {item.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <button className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500 px-2 py-1 font-medium text-slate-950 hover:bg-emerald-600 transition">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve
          </button>
          <button className="inline-flex items-center justify-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 font-medium text-amber-200 border border-amber-500/60 hover:bg-amber-500/25 transition">
            <AlertCircle className="w-3.5 h-3.5" />
            Changes
          </button>
          <button className="inline-flex items-center justify-center gap-1 rounded-full bg-rose-500/15 px-2 py-1 font-medium text-rose-200 border border-rose-500/60 hover:bg-rose-500/25 transition">
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
