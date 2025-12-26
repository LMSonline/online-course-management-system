"use client";
import { useLessons } from "@/hooks/teacher/useContentManagement";
import { Play, FileText, Award, FileQuestion, CheckCircle, Edit, Link as LinkIcon, Trash2 } from "lucide-react";
import { LessonType, LessonResponse } from "@/services/courses/content/lesson.types";

interface LessonListProps {
    chapterId: number;
    onEditLesson?: (lesson: LessonResponse) => void;
    onAddResource?: (lessonId: number) => void;
}

const getLessonIcon = (type: LessonType) => {
    switch (type) {
        case "VIDEO":
            return Play;
        case "DOCUMENT":
            return FileText;
        case "ASSIGNMENT":
            return FileQuestion;
        case "QUIZ":
            return Award;
        case "FINAL_EXAM":
            return CheckCircle;
        default:
            return FileText;
    }
};

export const LessonList = ({ chapterId, onEditLesson, onAddResource }: LessonListProps) => {
    const { lessons, isLoading } = useLessons(chapterId);

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    if (lessons.length === 0) {
        return (
            <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    No lessons yet. Click + to add your first lesson.
                </p>
            </div>
        );
    }

    return (
        <div>
            {lessons.map((lesson, index) => {
                const Icon = getLessonIcon(lesson.type);
                return (
                    <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-800 last:border-b-0"
                    >
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded ml-8">
                            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {index + 1}. {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">
                                        Preview
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="capitalize">{lesson.type.toLowerCase()}</span>
                                {lesson.durationSeconds && lesson.durationSeconds > 0 && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            {Math.floor(lesson.durationSeconds / 60)}:
                                            {(lesson.durationSeconds % 60).toString().padStart(2, "0")}
                                        </span>
                                    </>
                                )}
                                {lesson.videoStatus && lesson.type === "VIDEO" && (
                                    <>
                                        <span>•</span>
                                        <span
                                            className={`font-medium px-2 py-0.5 rounded text-xs ${lesson.videoStatus === "READY"
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                : lesson.videoStatus === "PROCESSING"
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                    : lesson.videoStatus === "UPLOADED"
                                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                                }`}
                                        >
                                            {lesson.videoStatus}
                                        </span>
                                    </>
                                )}
                                {lesson.type === "VIDEO" && !lesson.videoStatus && (
                                    <>
                                        <span>•</span>
                                        <span className="text-slate-400 dark:text-slate-500 italic">No video uploaded</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {onAddResource && (
                            <button
                                onClick={() => onAddResource(lesson.id)}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Add Resource"
                            >
                                <LinkIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </button>
                        )}

                        {onEditLesson && (
                            <button
                                onClick={() => onEditLesson(lesson)}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Edit Lesson"
                            >
                                <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
