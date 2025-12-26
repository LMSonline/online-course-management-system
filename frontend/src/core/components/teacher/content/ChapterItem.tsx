"use client";
import { useState } from "react";
import {
    GripVertical,
    Edit,
    Trash2,
    Plus,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ChapterResponse } from "@/services/courses/content/chapter.types";
import { LessonResponse, CreateLessonRequest, UpdateLessonRequest } from "@/services/courses/content/lesson.types";
import { useLessons } from "@/hooks/teacher/useContentManagement";
import { LessonModal } from "./LessonModal";
import { LessonItem } from "@/core/components/teacher/content/LessonItem";
import { toast } from "sonner";

interface ChapterItemProps {
    chapter: ChapterResponse;
    chapterIndex: number;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: (chapter: ChapterResponse) => void;
    onDelete: (chapterId: number) => void;
}

export const ChapterItem = ({
    chapter,
    chapterIndex,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
}: ChapterItemProps) => {
    const {
        lessons,
        isLoading: loadingLessons,
        createLesson,
        updateLesson,
        deleteLesson,
        uploadVideo,
        deleteVideo,
        reorderLessons,
    } = useLessons(chapter.id);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Sensors for lesson drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [lessonModal, setLessonModal] = useState<{
        isOpen: boolean;
        mode: "create" | "edit";
        data?: LessonResponse;
    }>({ isOpen: false, mode: "create" });

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);

    const handleCreateLesson = (data: CreateLessonRequest) => {
        createLesson.mutate(data, {
            onSuccess: () => {
                setLessonModal({ isOpen: false, mode: "create" });
            },
        });
    };

    const handleUpdateLesson = (lessonId: number, data: UpdateLessonRequest) => {
        updateLesson.mutate(
            { lessonId, payload: data },
            {
                onSuccess: () => {
                    setLessonModal({ isOpen: false, mode: "create" });
                },
            }
        );
    };

    const handleVideoUpload = (lessonId: number, file: File) => {
        setUploadProgress(0);
        uploadVideo.mutate(
            {
                lessonId,
                file,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                },
            },
            {
                onSuccess: () => {
                    setUploadProgress(undefined);
                    // Keep modal open so user can see the video status update
                    toast.success("Video uploaded! Processing will begin shortly.");
                },
                onError: () => {
                    setUploadProgress(undefined);
                },
            }
        );
    };

    const handleDeleteLesson = (lessonId: number) => {
        if (confirm("Are you sure you want to delete this lesson?")) {
            deleteLesson.mutate(lessonId);
        }
    };

    const handleLessonDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = lessons.findIndex((l) => l.id === active.id);
        const newIndex = lessons.findIndex((l) => l.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
            const lessonIds = reorderedLessons.map((l) => l.id);
            reorderLessons.mutate({ lessonIds });
        }
    };

    const getLessonIcon = (type: string) => {
        const icons: Record<string, any> = {
            VIDEO: "🎥",
            DOCUMENT: "📄",
            ASSIGNMENT: "📝",
            QUIZ: "❓",
            FINAL_EXAM: "🎓",
        };
        return icons[type] || "📄";
    };
    return (
        <>
            <div 
                ref={setNodeRef}
                style={style}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
                {/* Chapter Header */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <button 
                        {...attributes}
                        {...listeners}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-move"
                    >
                        <GripVertical className="w-5 h-5 text-slate-400" />
                    </button>

                    <button onClick={onToggle} className="flex items-center gap-2 flex-1 text-left">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded">
                                    {chapterIndex + 1}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {chapter.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {lessons.length} lessons
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => setLessonModal({ isOpen: true, mode: "create" })}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Add Lesson"
                    >
                        <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </button>

                    <button
                        onClick={() => onEdit(chapter)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Chapter"
                    >
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>

                    <button
                        onClick={() => onDelete(chapter.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                        title="Delete Chapter"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                </div>

                {/* Lessons */}
                {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800">
                        {loadingLessons ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        ) : lessons.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleLessonDragEnd}
                            >
                                <SortableContext
                                    items={lessons.map((l) => l.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div>
                                        {lessons.map((lesson, index) => (
                                            <LessonItem
                                                key={lesson.id}
                                                lesson={lesson}
                                                index={index}
                                                getLessonIcon={getLessonIcon}
                                                onEdit={(lesson: LessonResponse) => setLessonModal({ isOpen: true, mode: "edit", data: lesson })}
                                                onDelete={handleDeleteLesson}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    No lessons yet. Click + to add your first lesson.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Lesson Modal */}
            <LessonModal
                isOpen={lessonModal.isOpen}
                mode={lessonModal.mode}
                initialData={lessonModal.data}
                onClose={() => {
                    setLessonModal({ isOpen: false, mode: "create" });
                    setUploadProgress(undefined);
                }}
                onSubmit={(data) => {
                    if (lessonModal.mode === "create") {
                        handleCreateLesson(data as CreateLessonRequest);
                    } else if (lessonModal.data) {
                        handleUpdateLesson(lessonModal.data.id, data as UpdateLessonRequest);
                    }
                }}
                onUploadVideo={handleVideoUpload}
                uploadProgress={uploadProgress}
                isLoading={createLesson.isPending || updateLesson.isPending}
            />
        </>
    );
};
