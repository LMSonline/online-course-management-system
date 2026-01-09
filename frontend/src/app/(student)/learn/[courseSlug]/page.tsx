"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/authStore";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseCurriculum } from "@/hooks/public/useCourseCurriculum";
import { useCourseProgress } from "@/hooks/progress/useCourseProgress";
import { Loader2, BookOpen, CheckCircle2, Circle, Play, AlertCircle } from "lucide-react";
import { DEMO_MODE } from "@/lib/env";

/**
 * CourseLearningHomeScreen
 * Route: /learn/:courseSlug
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug)
 * - CHAPTER_GET_LIST (by courseId + versionId)
 * - PROGRESS_GET_COURSE (by studentId + courseId)
 */
export default function CourseLearningHomeScreen() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  
  const { studentId } = useAuthStore();
  
  // Fetch course detail
  const {
    data: course,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useCourseDetail(courseSlug);
  
  // Fetch curriculum (chapters) - requires courseId and versionId
  const courseId = course?.id;
  const versionId = course?.PublicVersionId; // Backend uses PublicVersionId (capital P)
  const {
    data: chapters,
    isLoading: isLoadingChapters,
  } = useCourseCurriculum(courseId, versionId);
  
  // Fetch progress - requires studentId and courseId
  const {
    data: progress,
    isLoading: isLoadingProgress,
  } = useCourseProgress({
    studentId: DEMO_MODE ? 1 : studentId,
    courseId,
  });
  
  const isLoading = isLoadingCourse || isLoadingChapters || isLoadingProgress;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (courseError || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Course not found
              </h2>
            </div>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">
              {courseError instanceof Error ? courseError.message : "The course you're looking for doesn't exist."}
            </p>
            <Link
              href="/my-learning"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Back to My Learning
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Build progress map for quick lookup
  const progressMap = new Map<number, { isCompleted: boolean; isViewed: boolean }>();
  if (progress) {
    progress.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        progressMap.set(lesson.lessonId, {
          isCompleted: lesson.isCompleted,
          isViewed: lesson.isViewed,
        });
      });
    });
  }
  
  // Find first incomplete lesson
  const firstIncompleteLesson = (() => {
    if (!chapters || !progress) return null;
    for (const chapter of progress.chapters) {
      for (const lesson of chapter.lessons) {
        if (!lesson.isCompleted) {
          return lesson;
        }
      }
    }
    return null;
  })();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            {course.instructorName && (
              <p className="text-gray-600 dark:text-gray-400">
                Instructor: {course.instructorName}
              </p>
            )}
          </div>
        </div>
        
        {/* Progress Summary */}
        {progress && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Progress</p>
                <p className="text-2xl font-bold">
                  {progress.overallCompletionPercentage.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chapters</p>
                <p className="text-2xl font-bold">
                  {progress.completedChapters} / {progress.totalChapters}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lessons</p>
                <p className="text-2xl font-bold">
                  {progress.completedLessons} / {progress.totalLessons}
                </p>
              </div>
              {progress.averageScore !== undefined && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Score</p>
                  <p className="text-2xl font-bold">{progress.averageScore.toFixed(1)}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Continue Button */}
        {firstIncompleteLesson && (
          <div className="mb-6">
            <Link
              href={`/learn/${params.courseSlug}/lessons/${firstIncompleteLesson.lessonId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
            >
              <Play className="h-5 w-5" />
              Continue Learning
            </Link>
          </div>
        )}
      </div>
      
      {/* Curriculum */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Curriculum</h2>
        
        {!chapters || chapters.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No curriculum available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter, chapterIndex) => {
              const chapterProgress = progress?.chapters.find(
                (cp) => cp.chapterId === chapter.id
              );
              
              return (
                <div
                  key={chapter.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Chapter Header */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Chapter {chapterIndex + 1}
                        </span>
                        <h3 className="font-semibold">{chapter.title}</h3>
                      </div>
                      {chapterProgress && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {chapterProgress.completedLessons} / {chapterProgress.totalLessons} lessons
                        </span>
                      )}
                    </div>
                    {chapterProgress && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-[var(--brand-600)] h-1.5 rounded-full transition-all"
                          style={{ width: `${chapterProgress.completionPercentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Lessons List */}
                  <div className="p-4">
                    {chapterProgress?.lessons && chapterProgress.lessons.length > 0 ? (
                      <ul className="space-y-2">
                        {chapterProgress.lessons.map((lesson) => (
                          <li key={lesson.lessonId}>
                            <Link
                              href={`/learn/${params.courseSlug}/lessons/${lesson.lessonId}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                              ) : lesson.isViewed ? (
                                <Circle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="flex-1 text-sm">{lesson.lessonTitle}</span>
                              {lesson.watchedSeconds > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.floor(lesson.watchedSeconds / 60)}m
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No lessons available in this chapter.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
