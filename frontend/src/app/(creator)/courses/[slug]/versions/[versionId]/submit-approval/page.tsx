"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useVersionDetailQuery } from "@/hooks/creator/useVersionQueries";
import { useSubmitVersionApprovalMutation } from "@/hooks/creator/useVersionMutations";
import { Loader2, ArrowLeft, Send, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Submit Version Approval Page
 * Route: /courses/:slug/versions/:versionId/submit-approval
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug to get courseId)
 * - VERSION_GET_DETAIL (to show version info)
 * - VERSION_SUBMIT_APPROVAL_ACTION (mutation)
 */
export default function SubmitVersionApprovalScreen() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const versionId = parseInt(params.versionId as string, 10);

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);
  const courseId = course?.id;

  const { data: version, isLoading: isLoadingVersion } = useVersionDetailQuery(courseId, versionId);
  const { mutate: submitApproval, isPending } = useSubmitVersionApprovalMutation();

  const handleSubmit = () => {
    if (!courseId) {
      alert("Course ID not available");
      return;
    }

    if (!confirm("Are you sure you want to submit this version for approval? You won't be able to edit it until it's reviewed.")) {
      return;
    }

    submitApproval(
      { courseId, versionId },
      {
        onSuccess: () => {
          router.push(`/courses/${slug}/versions/${versionId}`);
        },
      }
    );
  };

  if (isLoadingCourse || isLoadingVersion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (!course || !courseId || !version) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              {!course ? "Course not found" : "Version not found"}
            </h2>
          </div>
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={`/courses/${slug}/versions/${versionId}`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Version
      </Link>

      <h1 className="text-3xl font-bold mb-2">Submit for Approval</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {course.title} - {version.title || `Version ${version.versionNumber}`}
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Before submitting
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
              <li>Ensure all chapters and lessons are complete</li>
              <li>Review your course content for accuracy</li>
              <li>You won't be able to edit this version while it's under review</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-4">Version Information</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Version:</span>{" "}
            <span className="font-medium">#{version.versionNumber} - {version.title}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Chapters:</span>{" "}
            <span className="font-medium">{version.chapterCount || 0}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Status:</span>{" "}
            <span className="font-medium">{version.status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit for Approval
            </>
          )}
        </button>
        <Link
          href={`/courses/${slug}/versions/${versionId}`}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}


