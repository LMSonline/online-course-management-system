// src/app/(learner)/assignments/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  ASSESSMENTS_MOCK,
  type AssessmentStatus,
  type AssessmentType,
} from "@/lib/learner/assignments/types";
import { AssignmentsHeader } from "@/core/components/learner/assignments/AssignmentsHeader";
import { AssignmentsFilterBar } from "@/core/components/learner/assignments/AssignmentsFilterBar";
import { AssignmentsList } from "@/core/components/learner/assignments/AssignmentsList";

export default function LearnerAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | AssessmentType>("all");
  const [status, setStatus] = useState<"all" | AssessmentStatus>("all");
  const [sortBy, setSortBy] = useState("nearest");

  const filtered = useMemo(() => {
    let result = ASSESSMENTS_MOCK.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.courseTitle.toLowerCase().includes(q)
      );
    }

    if (type !== "all") {
      result = result.filter((a) => a.type === type);
    }

    if (status !== "all") {
      result = result.filter((a) => a.status === status);
    }

    // sort by due date, giả sử dueDate là "YYYY-MM-DD"
    result.sort((a, b) => {
      if (sortBy === "nearest" || sortBy === "latest") {
        const da = new Date(a.dueDate).getTime();
        const db = new Date(b.dueDate).getTime();
        return sortBy === "nearest" ? da - db : db - da;
      }

      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }

      return 0;
    });

    return result;
  }, [search, type, status, sortBy]);

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-5xl xl:max-w-6xl">
        <AssignmentsHeader />
        <AssignmentsFilterBar
          total={filtered.length}
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
        <AssignmentsList items={filtered} />
      </section>
    </main>
  );
}
