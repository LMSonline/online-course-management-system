"use client";
import { X } from "lucide-react";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { VideoUploader } from "./VideoUploader";

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: LessonResponse;
    onUploadComplete: () => void;
}

export const VideoUploadModal = ({
    isOpen,
    onClose,
    lesson,
    onUploadComplete,
}: VideoUploadModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Video Content
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {lesson.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <VideoUploader
                        lessonId={lesson.id}
                        currentVideo={
                            lesson.videoObjectKey
                                ? {
                                    objectKey: lesson.videoObjectKey,
                                    status: lesson.videoStatus,
                                }
                                : undefined
                        }
                        onUploadSuccess={(updatedLesson) => {
                            onUploadComplete();
                        }}
                        onUploadError={(error) => {
                            console.error("Upload error:", error);
                        }}
                    />

                    {/* Duration info */}
                    {lesson.durationSeconds && lesson.videoStatus === "READY" && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Video Information
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Duration: {Math.floor(lesson.durationSeconds / 60)}:{String(lesson.durationSeconds % 60).padStart(2, "0")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Note about processing */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                            📝 Lưu ý
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Sau khi upload, video sẽ được tự động xử lý sang định dạng HLS để streaming tối ưu.
                            Quá trình này có thể mất vài phút tùy thuộc vào độ dài video.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
