import { useState } from "react";
import { VideoUploader } from "@/core/components/teacher/content/VideoUploader";
import { useLessonEditor } from "@/hooks/teacher/useLessonEditor";
import { LessonResponse } from "@/services/courses/content/lesson.types";

interface LessonVideoEditorProps {
    lessonId: number;
    onVideoUpdated?: (lesson: LessonResponse) => void;
}

/**
 * Component để edit video của lesson
 * Demo cách sử dụng VideoUploader với hook useLessonEditor
 */
export function LessonVideoEditor({
    lessonId,
    onVideoUpdated,
}: LessonVideoEditorProps) {
    const { lesson, loading, refresh } = useLessonEditor({
        lessonId,
        autoLoad: true,
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">Lesson not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Lesson Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {lesson.title}
                </h3>
                {lesson.shortDescription && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {lesson.shortDescription}
                    </p>
                )}
            </div>

            {/* Video Uploader */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                    Video Content
                </h4>
                <VideoUploader
                    lessonId={lessonId}
                    currentVideo={
                        lesson.videoObjectKey
                            ? {
                                objectKey: lesson.videoObjectKey,
                                status: lesson.videoStatus,
                            }
                            : undefined
                    }
                    onUploadSuccess={(updatedLesson) => {
                        refresh();
                        onVideoUpdated?.(updatedLesson);
                    }}
                    onUploadError={(error) => {
                        console.error("Upload error:", error);
                    }}
                />

                {/* Duration info */}
                {lesson.durationSeconds && lesson.videoStatus === "READY" && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Thời lượng: {Math.floor(lesson.durationSeconds / 60)} phút{" "}
                            {lesson.durationSeconds % 60} giây
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
