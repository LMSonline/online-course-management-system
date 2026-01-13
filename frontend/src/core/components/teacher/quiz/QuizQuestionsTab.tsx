"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuizById, useRemoveQuestionFromQuiz, useReorderQuestions } from "@/hooks/teacher/useQuizManagement";
import { useQuestionBanksByTeacher } from "@/hooks/teacher/useQuestionBanks";
import { useTeacherId } from "@/hooks/useProfile";
import { QuizQuestionSummary } from "@/services/assessment/assessment.types";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import { QuizQuestionItem } from "./QuizQuestionItem";
import { QuestionPickerModal } from "./QuestionPickerModal";
import { RandomQuestionsModal } from "./RandomQuestionsModal";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Plus,
    Library,
    Shuffle,
    FileQuestion,
    Loader2,
    GripVertical,
    RefreshCw,
    Sparkles
} from "lucide-react";

interface QuizQuestionsTabProps {
    quizId: number;
}

export function QuizQuestionsTab({ quizId }: QuizQuestionsTabProps) {
    const teacherId = useTeacherId();
    const { data: quiz, isLoading, refetch, isRefetching } = useQuizById(quizId);
    const { data: questionBanks = [] } = useQuestionBanksByTeacher(teacherId);
    const removeQuestionMutation = useRemoveQuestionFromQuiz(quizId);
    const reorderMutation = useReorderQuestions(quizId);

    const [showPickerModal, setShowPickerModal] = useState(false);
    const [showRandomModal, setShowRandomModal] = useState(false);

    // Get questions from quiz response, sorted by orderIndex
    const fetchedQuestions = useMemo(() => {
        if (!quiz?.questions) return [];
        return [...quiz.questions].sort((a, b) => a.orderIndex - b.orderIndex);
    }, [quiz?.questions]);

    // Local state for optimistic UI updates
    const [questions, setQuestions] = useState<QuizQuestionSummary[]>([]);

    // Sync with fetched questions
    useEffect(() => {
        setQuestions(fetchedQuestions);
    }, [fetchedQuestions]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setQuestions((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Call API with questionId (not the quiz-question link id)
                const questionIds = newItems.map((q) => q.questionId);
                reorderMutation.mutate(questionIds);

                return newItems;
            });
        }
    };

    const handleRemoveQuestion = (questionId: number) => {
        // Optimistic update - filter by questionId
        setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
        removeQuestionMutation.mutate(questionId, {
            onError: () => {
                // Revert on error
                refetch();
            },
        });
    };

    const handleQuestionsAdded = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500 relative" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardContent className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-500/20 dark:to-fuchsia-500/20 rounded-xl">
                                    <FileQuestion className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {questions.length}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 ml-2">
                                        {questions.length === 1 ? "Question" : "Questions"}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRandomModal(true)}
                                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <Shuffle className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Random from Bank</span>
                            </Button>
                            <Button
                                onClick={() => setShowPickerModal(true)}
                                className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0 shadow-lg shadow-purple-500/25"
                            >
                                <Library className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Pick from Bank</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            {questions.length === 0 ? (
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 border-dashed shadow-sm">
                    <CardContent className="py-16">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-2xl flex items-center justify-center mx-auto">
                                    <FileQuestion className="h-10 w-10 text-purple-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-6 mb-2">
                                No questions yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Start building your quiz by adding questions from your question banks.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRandomModal(true)}
                                    className="border-slate-200 dark:border-slate-700"
                                >
                                    <Shuffle className="mr-2 h-4 w-4" />
                                    Random Questions
                                </Button>
                                <Button
                                    onClick={() => setShowPickerModal(true)}
                                    className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0"
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Pick Questions
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 py-3.5 px-5 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <GripVertical className="h-4 w-4" />
                            <span>Drag questions to reorder. Changes are saved automatically.</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={questions.map((q) => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {questions.map((question, index) => (
                                        <QuizQuestionItem
                                            key={question.id}
                                            question={question}
                                            index={index}
                                            onRemove={() => handleRemoveQuestion(question.questionId)}
                                            isRemoving={removeQuestionMutation.isPending}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </CardContent>
                </Card>
            )}

            {/* Modals */}
            <QuestionPickerModal
                open={showPickerModal}
                onOpenChange={setShowPickerModal}
                quizId={quizId}
                questionBanks={questionBanks}
                onQuestionsAdded={handleQuestionsAdded}
            />

            <RandomQuestionsModal
                open={showRandomModal}
                onOpenChange={setShowRandomModal}
                quizId={quizId}
                questionBanks={questionBanks}
                onQuestionsAdded={handleQuestionsAdded}
            />
        </div>
    );
}

export default QuizQuestionsTab;
