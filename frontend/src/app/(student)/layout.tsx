"use client";

import { StudentGuard } from "@/core/components/guards";
import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";

/**
 * AuthenticatedLayout (Student/User) - requireStudent guard
 * Used for student routes: /my-learning, /learn/*, /enrollments/*, etc.
 * Requires: role === "STUDENT" && studentId != null
 */
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentGuard>
      <LearnerNavbar />
      <main className="min-h-[72vh]">{children}</main>
    </StudentGuard>
  );
}

