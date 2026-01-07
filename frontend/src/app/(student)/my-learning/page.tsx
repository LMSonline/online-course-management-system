"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/authStore";
import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import { Loader2, BookOpen, Clock, Award, ChevronRight } from "lucide-react";
import { DEMO_MODE } from "@/lib/env";
import { DEMO_ENROLLMENTS } from "@/lib/demo/demoData";

/**
 * MyEnrollmentsScreen
 * Route: /my-learning
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Data:
 * - ENROLLMENT_GET_STUDENT_LIST (requires studentId from authStore)
 */
export default function MyEnrollmentsScreen() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  
  const page = pageParam ? parseInt(pageParam, 10) - 1 : 0; // Backend uses 0-based
  const size = sizeParam ? parseInt(sizeParam, 10) : 20;
  
  const { studentId } = useAuthStore();
  
  // In DEMO_MODE, use mock data directly
  const { data, isLoading, error } = useStudentEnrollments({
    studentId: DEMO_MODE ? 1 : studentId,
    page,
    size,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error loading enrollments
            </h2>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const enrollments = data?.items || [];
  const isEmpty = enrollments.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">You haven't enrolled in any courses yet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start your learning journey by exploring our course catalog.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Learning</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment: {
          id: number;
          courseId: number;
          courseTitle: string;
          versionNumber: number;
          completionPercentage: number;
          status: string;
          averageScore?: number | null;
          remainingDays: number;
          // ...add other fields as needed
        }) => (
          <Link
            key={enrollment.id}
            href={`/learn/${enrollment.courseId}`} // TODO: Backend should include courseSlug in EnrollmentResponse; for now using courseId
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                  {enrollment.courseTitle}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Version {enrollment.versionNumber}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-semibold">
                  {enrollment.completionPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[var(--brand-600)] h-2 rounded-full transition-all"
                  style={{ width: `${enrollment.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {enrollment.status === "COMPLETED" ? (
                  <>
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                      Completed
                    </span>
                  </>
                ) : enrollment.status === "ENROLLED" ? (
                  <>
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      In Progress
                    </span>
                  </>
                ) : null}
              </div>
              {enrollment.averageScore !== undefined && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Score: {typeof enrollment.averageScore === 'number' ? enrollment.averageScore.toFixed(1) : 'N/A'}
                </span>
              )}
            </div>

            {/* Remaining Days */}
            {enrollment.remainingDays > 0 && enrollment.status === "ENROLLED" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {enrollment.remainingDays} days remaining
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {data.hasPrevious && (
            <Link
              href={`/my-learning?page=${page}&size=${size}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {data.page + 1} of {data.totalPages}
          </span>
          {data.hasNext && (
            <Link
              href={`/my-learning?page=${page + 2}&size=${size}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
