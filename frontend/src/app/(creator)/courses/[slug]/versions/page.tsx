"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseVersionsQuery } from "@/hooks/creator/useVersionQueries";
import { Loader2, Plus, ArrowLeft, AlertCircle, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";

/**
 * Course Versions List Page
 * Route: /courses/:slug/versions
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug to get courseId)
 * - VERSION_GET_LIST (by courseId)
 */
export default function CourseVersionsScreen() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);
  const courseId = course?.id;

  const {
    data: versions = [],
    isLoading: isLoadingVersions,
    error: versionsError,
  } = useCourseVersionsQuery(courseId);

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
        return <FileText className="h-5 w-5 text-gray-600" />;
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

  if (isLoadingCourse || isLoadingVersions) {
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

  if (versionsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error loading versions
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {versionsError instanceof Error ? versionsError.message : "Failed to load versions"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Versions</h1>
          <p className="text-gray-600 dark:text-gray-400">{course.title}</p>
        </div>
        <Link
          href={`/courses/${slug}/versions/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
        >
          <Plus className="h-5 w-5" />
          Create Version
        </Link>
      </div>

      {versions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No versions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first version to start building your course content.
          </p>
          <Link
            href={`/courses/${slug}/versions/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
          >
            <Plus className="h-5 w-5" />
            Create First Version
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{version.title || `Version ${version.versionNumber}`}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.status || "DRAFT")}`}>
                      {version.status || "DRAFT"}
                    </span>
                  </div>
                  {version.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{version.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Version #{version.versionNumber}</span>
                    {version.price !== undefined && version.price > 0 && (
                      <span>${version.price.toFixed(2)}</span>
                    )}
                    {version.createdAt && (
                      <span>Created: {new Date(version.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(version.status || "DRAFT")}
                  <Link
                    href={`/courses/${slug}/versions/${version.id}`}
                    className="px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


