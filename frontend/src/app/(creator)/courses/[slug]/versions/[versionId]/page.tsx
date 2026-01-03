"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useVersionDetailQuery } from "@/hooks/creator/useVersionQueries";
import { Loader2, ArrowLeft, BookOpen, Send, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

/**
 * Version Detail Page
 * Route: /courses/:slug/versions/:versionId
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug to get courseId)
 * - VERSION_GET_DETAIL (by courseId and versionId)
 */
export default function VersionDetailScreen() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const versionId = parseInt(params.versionId as string, 10);

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);
  const courseId = course?.id;

  const {
    data: version,
    isLoading: isLoadingVersion,
    error: versionError,
  } = useVersionDetailQuery(courseId, versionId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case "PENDING":
      case "SUBMITTED":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
      case "APPROVED":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case "PENDING":
      case "SUBMITTED":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const canSubmitApproval = version?.status === "DRAFT" || version?.status === "REJECTED";
  const canPublish = version?.status === "APPROVED";

  if (isLoadingCourse || isLoadingVersion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (!course || !courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Course not found
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

  if (versionError || !version) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Version not found
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {versionError instanceof Error ? versionError.message : "The version you're looking for doesn't exist."}
          </p>
          <Link
            href={`/courses/${slug}/versions`}
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Versions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/courses/${slug}/versions`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Versions
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{version.title || `Version ${version.versionNumber}`}</h1>
          <p className="text-gray-600 dark:text-gray-400">{course.title}</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusIcon(version.status)}
          <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(version.status)}`}>
            {version.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Version Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Version Number:</span>{" "}
              <span className="font-medium">#{version.versionNumber}</span>
            </div>
            {version.price !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Price:</span>{" "}
                <span className="font-medium">${version.price.toFixed(2)}</span>
              </div>
            )}
            {version.durationDays && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>{" "}
                <span className="font-medium">{version.durationDays} days</span>
              </div>
            )}
            {version.chapterCount !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Chapters:</span>{" "}
                <span className="font-medium">{version.chapterCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Description</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {version.description || "No description provided."}
          </p>
        </div>
      </div>

      {version.notes && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{version.notes}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href={`/courses/${slug}/versions/${versionId}/chapters`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
        >
          <BookOpen className="h-5 w-5" />
          Manage Curriculum
        </Link>

        {canSubmitApproval && (
          <Link
            href={`/courses/${slug}/versions/${versionId}/submit-approval`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            <Send className="h-5 w-5" />
            Submit for Approval
          </Link>
        )}

        {canPublish && (
          <Link
            href={`/courses/${slug}/versions/${versionId}/publish`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <CheckCircle2 className="h-5 w-5" />
            Publish Version
          </Link>
        )}
      </div>
    </div>
  );
}


