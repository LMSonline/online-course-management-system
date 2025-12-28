"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2, FileText, Video, CheckSquare, ClipboardList } from "lucide-react";
import { LessonResponse } from "@/services/courses/content/lesson.types";

interface LessonItemProps {
    lesson: LessonResponse;
    index: number;
    getLessonIcon: (type: string) => string;
    onEdit: (lesson: LessonResponse) => void;
    onDelete: (lessonId: number) => void;
    onManageVideo?: (lesson: LessonResponse) => void;
    onManageDocument?: (lesson: LessonResponse) => void;
    onManageQuiz?: (lessonId: number) => void;
    onManageAssignment?: (lessonId: number) => void;
}

export const LessonItem = ({
    lesson,
    index,
    getLessonIcon,
    onEdit,
    onDelete,
    onManageVideo,
    onManageDocument,
    onManageQuiz,
    onManageAssignment,
}: LessonItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-800 last:border-b-0"
        >
            <button
                {...attributes}
                {...listeners}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-move"
            >
                <GripVertical className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-xl">{getLessonIcon(lesson.type)}</span>
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
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                                        : lesson.videoStatus === "UPLOADED"
                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                    }`}
                                title={
                                    lesson.videoStatus === "READY"
                                        ? "Video is ready to stream"
                                        : lesson.videoStatus === "PROCESSING"
                                            ? "Video is being processed to HLS format"
                                            : lesson.videoStatus === "UPLOADED"
                                                ? "Video uploaded, waiting to process"
                                                : "Video processing failed"
                                }
                            >
                                {lesson.videoStatus}
                            </span>
                        </>
                    )}
                    {lesson.type === "VIDEO" && !lesson.videoStatus && (
                        <>
                            <span>•</span>
                            <span className="text-slate-400 dark:text-slate-500 italic">No video</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* Type-specific Actions */}
                {lesson.type === "VIDEO" && onManageVideo && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageVideo(lesson);
                        }}
                        className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded-lg transition-colors"
                        title="Manage Video"
                    >
                        <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </button>
                )}

                {lesson.type === "DOCUMENT" && onManageDocument && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageDocument(lesson);
                        }}
                        className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-950 rounded-lg transition-colors"
                        title="Manage Documents"
                    >
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </button>
                )}

                {lesson.type === "QUIZ" && onManageQuiz && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageQuiz(lesson.id);
                        }}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-950 rounded-lg transition-colors"
                        title="Manage Quiz"
                    >
                        <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </button>
                )}

                {lesson.type === "ASSIGNMENT" && onManageAssignment && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageAssignment(lesson.id);
                        }}
                        className="p-2 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg transition-colors"
                        title="Manage Assignment"
                    >
                        <ClipboardList className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(lesson);
                    }}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit Lesson"
                >
                    <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(lesson.id);
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                    title="Delete Lesson"
                >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
            </div>
        </div>
    );
};
