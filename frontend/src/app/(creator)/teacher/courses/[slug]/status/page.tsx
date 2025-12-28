"use client";

import { useParams, useRouter } from "next/navigation";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useToggleCourseStatusMutation } from "@/hooks/creator/useCourseMutations";
import { Loader2, ArrowLeft, Lock, Unlock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Course Status Page (Open/Close)
 * Route: /teacher/courses/:slug/status
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (to get course info and current status)
 * - COURSE_OPEN_ACTION / COURSE_CLOSE_ACTION (mutations)
 */
export default function CourseStatusPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);

  const { openCourse, closeCourse } = useToggleCourseStatusMutation();

  const handleToggleStatus = () => {
    if (!course?.id) {
      toast.error("Course ID not available");
      return;
    }

    const isCurrentlyClosed = course.isClosed || false;
    const action = isCurrentlyClosed ? "open" : "close";
    
    if (!confirm(`Are you sure you want to ${action} this course?`)) {
      return;
    }

    if (isCurrentlyClosed) {
      openCourse.mutate(course.id, {
        onSuccess: () => {
          router.push("/teacher/courses");
        },
      });
    } else {
      closeCourse.mutate(course.id, {
        onSuccess: () => {
          router.push("/teacher/courses");
        },
      });
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Course not found
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/teacher/courses"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = course.isClosed || false;
  const isPending = openCourse.isPending || closeCourse.isPending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <h1 className="text-3xl font-bold mb-2">Course Status</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{course.title}</p>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          {isClosed ? (
            <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
          ) : (
            <Unlock className="h-8 w-8 text-green-600 dark:text-green-400" />
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {isClosed ? "Course is Closed" : "Course is Open"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isClosed
                ? "This course is not accepting new enrollments."
                : "This course is open and accepting enrollments."}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleStatus}
          disabled={isPending}
          className={`w-full px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 ${
            isClosed
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Processing...
            </>
          ) : isClosed ? (
            <>
              <Unlock className="h-5 w-5 inline mr-2" />
              Open Course
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 inline mr-2" />
              Close Course
            </>
          )}
        </button>
      </div>
    </div>
  );
}
