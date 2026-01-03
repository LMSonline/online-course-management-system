import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CoursesListClient } from "@/core/components/teacher/courses/CoursesListClient";
import { CardGridSkeleton } from "@/core/components/teacher/skeletons";

export default function MyCoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track all your courses in one place
            </p>
          </div>
          <Link
            href="/teacher/create-course"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
        </div>

        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <CoursesListClient />
        </Suspense>
      </div>
    </div>
  );
}
