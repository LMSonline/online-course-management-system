"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLessonDetail } from "@/hooks/lesson/useLessonDetail";
import { useLessonStreamUrl } from "@/hooks/lesson/useLessonStreamUrl";
import { useLessonResources } from "@/hooks/lesson/useLessonResources";
import { useMarkLessonCompleted } from "@/hooks/progress/useProgressMutations";
import { useLessonComments } from "@/hooks/comment/useComments";
import { CommentThread } from "@/core/components/comments/CommentThread";
import { Loader2, Download, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

/**
 * Lesson Player Page
 * Route: /learn/:courseSlug/lessons/:id
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Data:
 * - LESSON_GET_BY_ID (lesson detail)
 * - LESSON_GET_VIDEO_STREAM_URL (stream URL)
 * - RESOURCE_GET_BY_LESSON (resources list)
 * - COMMENT_GET_LESSON_LIST (comments)
 * - PROGRESS_MARK_COMPLETED_ACTION (mark complete)
 */
export default function LessonPlayerPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonId = parseInt(params.id as string, 10);

  // Fetch lesson detail
  const {
    data: lesson,
    isLoading: isLoadingLesson,
    error: lessonError,
  } = useLessonDetail(lessonId);

  // Fetch stream URL (only for VIDEO type)
  const {
    data: streamUrl,
    isLoading: isLoadingStream,
  } = useLessonStreamUrl(lesson?.type === "VIDEO" ? lessonId : null);

  // Fetch resources
  const {
    data: resources,
    isLoading: isLoadingResources,
  } = useLessonResources(lessonId);

  // Fetch comments
  const {
    data: comments,
    isLoading: isLoadingComments,
  } = useLessonComments(lessonId);

  // Mark as completed mutation
  const { mutate: markCompleted, isPending: isMarkingCompleted } = useMarkLessonCompleted();

  const isLoading = isLoadingLesson || isLoadingResources;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Lesson not found
              </h2>
            </div>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">
              {lessonError instanceof Error ? lessonError.message : "The lesson you're looking for doesn't exist."}
            </p>
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/learn/${courseSlug}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        {lesson.shortDescription && (
          <p className="text-gray-600 dark:text-gray-400">{lesson.shortDescription}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {lesson.type === "VIDEO" ? (
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              {isLoadingStream ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : streamUrl ? (
                <video
                  controls
                  className="w-full h-full"
                  src={streamUrl}
                  onPlay={() => {
                    // Auto-mark as viewed when video starts playing
                    // This could be done via a separate mutation if needed
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>Stream URL unavailable</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {lesson.type === "DOCUMENT" && "Document content will be displayed here"}
                {lesson.type === "ASSIGNMENT" && "Assignment details will be displayed here"}
                {lesson.type === "QUIZ" && "Quiz will be displayed here"}
                {lesson.type === "FINAL_EXAM" && "Final exam will be displayed here"}
              </p>
            </div>
          )}

          {/* Mark as Complete Button */}
          <div className="flex justify-end">
            <button
              onClick={() => markCompleted(lessonId)}
              disabled={isMarkingCompleted}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
            >
              {isMarkingCompleted ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Complete
                </>
              )}
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-600)]" />
              </div>
            ) : (
              <CommentThread
                resourceType="lesson"
                resourceId={lessonId}
                comments={comments || []}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Lesson Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Type:</span>{" "}
                <span className="font-medium">{lesson.type}</span>
              </div>
              {lesson.durationSeconds && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>{" "}
                  <span className="font-medium">
                    {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
                  </span>
                </div>
              )}
              {lesson.isPreview && (
                <div className="text-[var(--brand-600)] font-medium">Preview Lesson</div>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Resources</h3>
            {isLoadingResources ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--brand-600)]" />
              </div>
            ) : resources && resources.length > 0 ? (
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.id}>
                    <a
                      href={resource.downloadUrl || resource.externalUrl || resource.displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[var(--brand-600)] hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      {resource.title || "Resource"}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No resources available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

