"use client";

import { useRouter } from "next/navigation"; // ⬅️ thêm dòng này
import type { CourseSummary } from "@/lib/learner/catalog/types";
import { CourseCard } from "./CourseCard";

type Props = {
  courses: CourseSummary[];
};

export function CourseGrid({ courses }: Props) {
  // thêm router
  const router = useRouter();

  // chưa cần phân trang thật, chỉ render tất cả + pagination fake
  const totalPages = 3;
  const currentPage = 1;

  return (
    <section className="space-y-4 md:space-y-6">
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <div
            key={c.id}
            onClick={() => router.push(`/learner/courses/${c.id}`)}
          >
            <CourseCard course={c} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`h-8 w-8 rounded-full text-xs font-medium transition ${page === currentPage
                ? "bg-[var(--brand-500)] text-slate-950 shadow-[0_0_18px_rgba(34,197,94,0.6)]"
                : "bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
          >
            {page}
          </button>
        ))}
      </div>
    </section>
  );
}
