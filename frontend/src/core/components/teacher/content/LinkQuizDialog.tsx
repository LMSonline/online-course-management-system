"use client";

import React, { useState } from "react";
import { useAllIndependentQuizzes } from "@/hooks/teacher/useQuizManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Label from "@/core/components/ui/Label";
import { QuizResponse } from "@/services/assessment/assessment.types";
import { Loader2, Search, Link2, FileQuestion, Clock, Target, Calendar } from "lucide-react";
import { toast } from "sonner";

interface LinkQuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lessonId: number;
    onLinkSuccess?: () => void;
}

export function LinkQuizDialog({
    open,
    onOpenChange,
    lessonId,
    onLinkSuccess,
}: LinkQuizDialogProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);
    const [isLinking, setIsLinking] = useState(false);

    const { data: quizzes = [], isLoading } = useAllIndependentQuizzes();

    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLinkQuiz = async () => {
        if (!selectedQuiz) {
            toast.error("Please select a quiz to link");
            return;
        }

        setIsLinking(true);
        try {
            const { assessmentService } = await import("@/services/assessment");
            await assessmentService.linkQuizToLesson(lessonId, selectedQuiz.id);
            toast.success(`Quiz "${selectedQuiz.title}" linked successfully!`);
            onLinkSuccess?.();
            onOpenChange(false);
            setSelectedQuiz(null);
            setSearchTerm("");
        } catch (error: any) {
            toast.error(error?.message || "Failed to link quiz");
        } finally {
            setIsLinking(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl">
                            <Link2 className="h-5 w-5 text-white" />
                        </div>
                        Link Existing Quiz
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Select a quiz from your library to link to this lesson.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Search Quizzes</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by quiz title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>

                    {/* Quiz List */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">
                            Available Quizzes ({filteredQuizzes.length})
                        </Label>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                </div>
                            ) : filteredQuizzes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileQuestion className="h-12 w-12 text-slate-400 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {searchTerm ? "No quizzes match your search" : "No independent quizzes available"}
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredQuizzes.map((quiz) => (
                                        <button
                                            key={quiz.id}
                                            onClick={() => setSelectedQuiz(quiz)}
                                            className={`w-full text-left p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-colors ${selectedQuiz?.id === quiz.id
                                                    ? "bg-purple-50 dark:bg-purple-950/30 border-l-4 border-l-purple-500"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h4 className="font-semibold text-slate-900 dark:text-white">
                                                        {quiz.title}
                                                    </h4>
                                                    {selectedQuiz?.id === quiz.id && (
                                                        <div className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded">
                                                            Selected
                                                        </div>
                                                    )}
                                                </div>
                                                {quiz.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {quiz.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                    {quiz.questions && quiz.questions.length > 0 && (
                                                        <span className="flex items-center gap-1.5">
                                                            <FileQuestion className="h-3.5 w-3.5" />
                                                            {quiz.questions.length} questions
                                                        </span>
                                                    )}
                                                    {quiz.timeLimitMinutes && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {quiz.timeLimitMinutes} min
                                                        </span>
                                                    )}
                                                    {quiz.passingScore && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Target className="h-3.5 w-3.5" />
                                                            {quiz.passingScore}% pass
                                                        </span>
                                                    )}
                                                </div>
                                                {(quiz.startDate || quiz.endDate) && (
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {quiz.startDate && (
                                                            <span>From: {formatDate(quiz.startDate)}</span>
                                                        )}
                                                        {quiz.endDate && (
                                                            <span>To: {formatDate(quiz.endDate)}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setSelectedQuiz(null);
                                setSearchTerm("");
                            }}
                            disabled={isLinking}
                            className="border-slate-200 dark:border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLinkQuiz}
                            disabled={!selectedQuiz || isLinking}
                            className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0"
                        >
                            {isLinking ? (
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
