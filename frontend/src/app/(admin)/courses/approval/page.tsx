"use client";

import { ADMIN_MOCK_DATA } from "@/lib/admin/types";
import { AdminCourseApprovalList } from "@/core/components/admin/courses/AdminCourseApprovalList";

export default function AdminCourseApprovalPage() {
  const items = ADMIN_MOCK_DATA.courseApprovals;

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-4">
        <header className="mb-1">
          <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
            Course approval · Admin
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
            Review & approve courses
          </h1>
          <p className="mt-2 text-sm md:text-[15px] text-slate-300 max-w-2xl">
            Admin can review new or updated courses before they are visible to
            learners.
          </p>
        </header>

        <AdminCourseApprovalList items={items} />
      </section>
    </main>
  );
}
