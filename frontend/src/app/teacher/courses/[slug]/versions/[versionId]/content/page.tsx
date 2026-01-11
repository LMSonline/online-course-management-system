"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Plus,
    Eye,
    BookOpen,
    CheckCircle,
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { useChapters } from "@/hooks/teacher/useContentManagement";
import { ChapterModal } from "@/core/components/teacher/content/ChapterModal";
import { ResourceModal } from "@/core/components/teacher/content/ResourceModal";
import { PreviewMode } from "@/core/components/teacher/content/PreviewMode";
import { ChapterItem } from "@/core/components/teacher/content/ChapterItem";
import { CourseDetailResponse, CourseVersionResponse } from "@/services/courses/course.types";
import { ChapterResponse } from "@/services/courses/content/chapter.types";
import { toast } from "sonner";
import { lessonService } from "@/services/courses/content/lesson.service";
import { assessmentService } from "@/services/assessment";
import { assignmentService } from "@/services/assignment";

export default function CourseContentPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const versionId = params.versionId ? parseInt(params.versionId as string) : null;

    // Modal states
    const [chapterModal, setChapterModal] = useState<{
        isOpen: boolean;
        mode: "create" | "edit";
        data?: ChapterResponse;
    }>({ isOpen: false, mode: "create" });

    const [resourceModal, setResourceModal] = useState<{
        isOpen: boolean;
        mode: "create" | "edit";
        lessonId?: number;
        data?: any;
    }>({ isOpen: false, mode: "create" });

    const [previewMode, setPreviewMode] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    const [previewLessons, setPreviewLessons] = useState<Record<number, any[]>>({});
    const [previewQuizzes, setPreviewQuizzes] = useState<Record<number, any[]>>({});
    const [previewAssignments, setPreviewAssignments] = useState<Record<number, any[]>>({});

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch course
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // Fetch version or use latest
    const { data: versions } = useQuery<CourseVersionResponse[]>({
        queryKey: ["course-versions", course?.id],
        queryFn: () => courseVersionService.getCourseVersions(course!.id),
        enabled: !!course?.id,
    });

    const currentVersion = versionId
        ? versions?.find((v) => v.id === versionId)
        : versions?.[0];

    // Fetch chapters
    const {
        chapters,
        isLoading: loadingChapters,
        createChapter,
        updateChapter,
        deleteChapter,
        reorderChapters,
    } = useChapters(course?.id || 0, currentVersion?.id || 0);

    const toggleChapter = (chapterId: number) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const handleOpenPreview = async () => {
        setPreviewMode(true);
        // Load all lessons, quizzes, and assignments for preview
        const lessonsData: Record<number, any[]> = {};
        const quizzesData: Record<number, any[]> = {};
        const assignmentsData: Record<number, any[]> = {};

        for (const chapter of chapters) {
            try {
                const lessons = await lessonService.getLessonsByChapter(chapter.id);
                lessonsData[chapter.id] = lessons;

                // Load quizzes and assignments for each lesson
                for (const lesson of lessons) {
                    try {
                        if (lesson.type === 'QUIZ') {
                            const quizzes = await assessmentService.getQuizzesByLesson(lesson.id);
                            quizzesData[lesson.id] = quizzes;
                        } else if (lesson.type === 'ASSIGNMENT') {
                            const assignments = await assignmentService.getAssignmentsByLesson(lesson.id);
                            assignmentsData[lesson.id] = assignments;
                        }
                    } catch (error) {
                        console.error(`Failed to load quiz/assignment for lesson ${lesson.id}:`, error);
                    }
                }
            } catch (error) {
                console.error(`Failed to load lessons for chapter ${chapter.id}:`, error);
                lessonsData[chapter.id] = [];
            }
        }
        setPreviewLessons(lessonsData);
        setPreviewQuizzes(quizzesData);
        setPreviewAssignments(assignmentsData);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = chapters.findIndex((ch) => ch.id === active.id);
        const newIndex = chapters.findIndex((ch) => ch.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedChapters = arrayMove(chapters, oldIndex, newIndex);
            const chapterIds = reorderedChapters.map((ch) => ch.id);
            reorderChapters.mutate({ chapterIds });
        }
    };

    if (!course || !currentVersion) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]" suppressHydrationWarning>
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" suppressHydrationWarning />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 m-4 md:m-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <Link
                            href={`/teacher/courses/${slug}/versions`}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-1"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Course Content
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-slate-600 dark:text-slate-400">{course.title}</p>
                                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-xs font-medium border border-indigo-500/20">
                                    Version {currentVersion.versionNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOpenPreview}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={() => setChapterModal({ isOpen: true, mode: "create" })}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add Chapter
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                            {chapters.length}
                        </p>
                        <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">Chapters</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                            {currentVersion.passScore || 0}/10
                        </p>
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Điểm đạt</p>
                    </div>
                </div>

                {/* Course Content */}
                {loadingChapters ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : chapters.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={chapters.map((ch) => ch.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {chapters.map((chapter, chapterIndex) => (
                                    <ChapterItem
                                        key={chapter.id}
                                        chapter={chapter}
                                        chapterIndex={chapterIndex}
                                        isExpanded={expandedChapters.has(chapter.id)}
                                        onToggle={() => toggleChapter(chapter.id)}
                                        onEdit={(ch) =>
                                            setChapterModal({
                                                isOpen: true,
                                                mode: "edit",
                                                data: ch,
                                            })
                                        }
                                        onDelete={(chId) => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to delete this chapter? All lessons will be deleted."
                                                )
                                            ) {
                                                deleteChapter.mutate(chId);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12">
                        <div className="text-center">
                            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No content yet
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Start building your course by adding chapters
                            </p>
                            <button
                                onClick={() => setChapterModal({ isOpen: true, mode: "create" })}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add First Chapter
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ChapterModal
                isOpen={chapterModal.isOpen}
                mode={chapterModal.mode}
                initialData={chapterModal.data}
                onClose={() => setChapterModal({ isOpen: false, mode: "create" })}
                onSubmit={(data) => {
                    if (chapterModal.mode === "create") {
                        createChapter.mutate(data);
                    } else if (chapterModal.data) {
                        updateChapter.mutate({ chapterId: chapterModal.data.id, payload: data });
                    }
                    setChapterModal({ isOpen: false, mode: "create" });
                }}
                isLoading={createChapter.isPending || updateChapter.isPending}
            />

            <ResourceModal
                isOpen={resourceModal.isOpen}
                mode={resourceModal.mode}
                initialData={resourceModal.data}
                onClose={() => setResourceModal({ isOpen: false, mode: "create" })}
                onSubmitFile={(file, title, description, isRequired) => {
                    toast.info("Resource management coming soon");
                    setResourceModal({ isOpen: false, mode: "create" });
                }}
                onSubmitLink={(data) => {
                    toast.info("Resource management coming soon");
                    setResourceModal({ isOpen: false, mode: "create" });
                }}
                isLoading={false}
            />

            <PreviewMode
                isOpen={previewMode}
                onClose={() => {
                    setPreviewMode(false);
                    setPreviewLessons({});
                    setPreviewQuizzes({});
                    setPreviewAssignments({});
                }}
                chapters={chapters}
                lessons={previewLessons}
                quizzes={previewQuizzes}
                assignments={previewAssignments}
                resources={{}}
                courseTitle={course.title}
            />
        </>
    );
}
