"use client";

import React, { useState, useMemo } from "react";
import { useAllIndependentQuizzes, useLinkQuiz } from "@/hooks/teacher/useQuizManagement";
import { QuizResponse } from "@/services/assessment/assessment.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import {
    Search,
    Link2,
    FileQuestion,
    Loader2,
    Clock,
    Target,
    CheckCircle2
} from "lucide-react";

interface LinkQuizModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lessonId: number;
}

export function LinkQuizModal({ open, onOpenChange, lessonId }: LinkQuizModalProps) {
    const { data: quizzes = [], isLoading } = useAllIndependentQuizzes();
    const linkQuizMutation = useLinkQuiz(lessonId);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

    // Filter quizzes that are not linked (lessonId is null or 0)
    const availableQuizzes = useMemo(() => {
        const filtered = quizzes.filter((q) => !q.lessonId || q.lessonId === 0);
        if (!searchTerm.trim()) return filtered;
        return filtered.filter((q) =>
            q.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quizzes, searchTerm]);

    const selectedQuiz = availableQuizzes.find((q) => q.id === selectedQuizId);

    const handleLink = () => {
        if (!selectedQuizId) return;
        linkQuizMutation.mutate(selectedQuizId, {
            onSuccess: () => {
                setSelectedQuizId(null);
                setSearchTerm("");
                onOpenChange(false);
            },
        });
    };

    const handleClose = () => {
        setSelectedQuizId(null);
        setSearchTerm("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-purple-500" />
                        Link Existing Quiz
                    </DialogTitle>
                    <DialogDescription>
                        Select a quiz from your library to link to this lesson.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col min-h-0 mt-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Quiz List */}
                    <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                </div>
                            ) : availableQuizzes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FileQuestion className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {searchTerm
                                            ? "No quizzes match your search"
                                            : "No available quizzes to link"}
                                    </p>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                        Create a new quiz or unlink one from another lesson
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {availableQuizzes.map((quiz) => (
                                        <button
                                            key={quiz.id}
                                            onClick={() => setSelectedQuizId(quiz.id)}
                                            className={`w-full flex items-start gap-4 p-4 text-left transition-colors ${selectedQuizId === quiz.id
                                                ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/30 border-l-4 border-transparent"
                                                }`}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {selectedQuizId === quiz.id ? (
                                                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                                        {quiz.title}
                                                    </p>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${quiz.quizType === "PRACTICE"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                        : quiz.quizType === "GRADED"
                                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        }`}>
                                                        {quiz.quizType}
                                                    </span>
                                                </div>
                                                {quiz.description && (
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                                        {quiz.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
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
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedQuiz ? (
                            <>Selected: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedQuiz.title}</span></>
                        ) : (
                            "Select a quiz to link"
                        )}
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLink}
                            disabled={!selectedQuizId || linkQuizMutation.isPending}
                        >
                            {linkQuizMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Linking...
                                </>
                            ) : (
                                <>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Link Quiz
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default LinkQuizModal;
