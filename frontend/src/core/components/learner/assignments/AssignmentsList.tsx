// src/core/components/learner/assignments/AssignmentsList.tsx
"use client";

import { useRouter } from "next/navigation";
import type { AssessmentSummary } from "@/lib/learner/assignments/types";
import { AssignmentCard } from "./AssignmentCard";

type Props = {
  items: AssessmentSummary[];
};

export function AssignmentsList({ items }: Props) {
  const router = useRouter();

  const handleOpen = (item: AssessmentSummary) => {
    // TODO: sau này điều hướng tới trang detail quiz/assignment cụ thể
    // tạm thời: đi tới trang course detail tương ứng
    router.push(`/learner/courses/${item.courseId}`);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
        No tasks match your filters. Try changing type or status.
      </div>
    );
  }

  return (
    <section className="space-y-3 md:space-y-4">
      {items.map((it) => (
        <AssignmentCard key={it.id} item={it} onOpen={handleOpen} />
      ))}
    </section>
  );
}
