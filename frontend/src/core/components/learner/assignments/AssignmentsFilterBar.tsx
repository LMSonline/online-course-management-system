// src/core/components/learner/assignments/AssignmentsFilterBar.tsx
"use client";

import type { AssessmentStatus, AssessmentType } from "@/lib/learner/assignments/types";

type Props = {
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
  type: "all" | AssessmentType;
  onTypeChange: (v: "all" | AssessmentType) => void;
  status: "all" | AssessmentStatus;
  onStatusChange: (v: "all" | AssessmentStatus) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
};

export function AssignmentsFilterBar({
  total,
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-100">
          {total} tasks
        </p>
        <p className="text-xs text-slate-400">
          Filter by quiz/assignment, status, and sort by due date or progress.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs md:text-sm">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or course"
          className="w-48 md:w-64 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500"
        />

        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as "all" | AssessmentType)}
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="all">All types</option>
          <option value="Quiz">Quiz</option>
          <option value="Assignment">Assignment</option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as "all" | AssessmentStatus)
          }
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="all">All status</option>
          <option value="Not started">Not started</option>
          <option value="In progress">In progress</option>
          <option value="Submitted">Submitted</option>
          <option value="Graded">Graded</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="nearest">Sort: Nearest due date</option>
          <option value="latest">Sort: Farthest due date</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>
    </div>
  );
}
