"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizResponse, QuizRequest } from "@/services/assessment/assessment.types";
import {
    useQuizzesByLesson,
    useCreateQuiz,
    useUnlinkQuiz
} from "@/hooks/teacher/useQuizManagement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/core/components/ui/DropdownMenu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/core/components/ui/AlertDialog";
import { CreateQuizDialog } from "./CreateQuizDialog";
import { LinkQuizModal } from "./LinkQuizModal";
import {
    Plus,
    Link2,
    Unlink,
    FileQuestion,
    Clock,
    Target,
    ChevronDown,
    MoreVertical,
    ExternalLink,
    Loader2,
    AlertTriangle
} from "lucide-react";

interface LessonQuizManagerProps {
    lessonId: number;
    lessonTitle?: string;
}

export function LessonQuizManager({ lessonId, lessonTitle }: LessonQuizManagerProps) {
    const router = useRouter();
    const { data: quizzes = [], isLoading } = useQuizzesByLesson(lessonId);
    const createQuizMutation = useCreateQuiz(lessonId);
    const unlinkQuizMutation = useUnlinkQuiz(lessonId);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [quizToUnlink, setQuizToUnlink] = useState<QuizResponse | null>(null);

    const handleCreateQuiz = (data: QuizRequest) => {
        createQuizMutation.mutate(data, {
            onSuccess: (newQuiz) => {
                setShowCreateDialog(false);
                router.push(`/teacher/quizzes/${newQuiz.id}/edit`);
            },
        });
    };

    const handleUnlinkQuiz = () => {
        if (!quizToUnlink) return;
        unlinkQuizMutation.mutate(quizToUnlink.id, {
            onSuccess: () => {
                setQuizToUnlink(null);
            },
        });
    };

    if (isLoading) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-8">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileQuestion className="h-5 w-5 text-purple-500" />
                            Quizzes
                        </CardTitle>
                        <CardDescription>
                            Manage quizzes for this lesson
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Quiz
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowLinkModal(true)}>
                                <Link2 className="h-4 w-4 mr-2" />
                                Link Existing Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Quiz
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {quizzes.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="mx-auto w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <FileQuestion className="h-7 w-7 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            No quizzes linked to this lesson yet.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button variant="outline" onClick={() => setShowLinkModal(true)}>
                                <Link2 className="mr-2 h-4 w-4" />
                                Link Existing
                            </Button>
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create New
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                            {quiz.title}
                                        </h4>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${quiz.status === "PUBLISHED"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}>
                                            {quiz.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <FileQuestion className="h-3.5 w-3.5" />
                                            {quiz.totalQuestions ?? 0} questions
                                        </span>
                                        {quiz.timeLimit && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {quiz.timeLimit} min
                                            </span>
                                        )}
                                        {quiz.passingScore && (
                                            <span className="flex items-center gap-1">
                                                <Target className="h-3.5 w-3.5" />
                                                {quiz.passingScore}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/teacher/quizzes/${quiz.id}/edit`)}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <button
                                        onClick={() => setQuizToUnlink(quiz)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Unlink from lesson"
                                    >
                                        <Unlink className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Link Modal */}
            <LinkQuizModal
                open={showLinkModal}
                onOpenChange={setShowLinkModal}
                lessonId={lessonId}
            />

            {/* Create Dialog */}
            <CreateQuizDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onSubmit={handleCreateQuiz}
                isLoading={createQuizMutation.isPending}
            />

            {/* Unlink Confirmation */}
            <AlertDialog
                open={!!quizToUnlink}
                onOpenChange={(open) => !open && setQuizToUnlink(null)}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Unlink className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <AlertDialogTitle>Unlink Quiz</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Remove this quiz from the lesson?
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>

                    {quizToUnlink && (
                        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="font-medium text-slate-900 dark:text-white">
                                {quizToUnlink.title}
                            </p>
                        </div>
                    )}

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            The quiz will be unlinked from this lesson but will remain in your Quiz Library. You can link it again later.
                        </p>
                    </div>

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={unlinkQuizMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleUnlinkQuiz();
                            }}
                            disabled={unlinkQuizMutation.isPending}
                            className="bg-amber-600 text-white hover:bg-amber-700"
                        >
                            {unlinkQuizMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Unlinking...
                                </>
                            ) : (
                                "Unlink Quiz"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

export default LessonQuizManager;
