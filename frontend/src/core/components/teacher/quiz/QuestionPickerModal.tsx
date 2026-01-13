"use client";

import React, { useState, useMemo } from "react";
import { QuestionBankResponse, QuestionResponse } from "@/services/assessment/assessment.types";
import { useQuestionsByBank } from "@/hooks/teacher/useQuestionBanks";
import { useAddQuestionsToQuiz } from "@/hooks/teacher/useQuizManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import { Select, SelectItem } from "@/core/components/ui/Select";
import Checkbox from "@/core/components/ui/Checkbox";
import {
    Search,
    Library,
    FileQuestion,
    Loader2,
    CheckCircle2,
    List,
    ToggleLeft,
    PenLine,
    FileText
} from "lucide-react";

interface QuestionPickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quizId: number;
    questionBanks: QuestionBankResponse[];
    onQuestionsAdded: () => void;
}

const questionTypeIcons: Record<string, React.ReactNode> = {
    MULTIPLE_CHOICE: <CheckCircle2 className="h-4 w-4" />,
    MULTI_SELECT: <List className="h-4 w-4" />,
    TRUE_FALSE: <ToggleLeft className="h-4 w-4" />,
    FILL_BLANK: <PenLine className="h-4 w-4" />,
    ESSAY: <FileText className="h-4 w-4" />,
};

export function QuestionPickerModal({
    open,
    onOpenChange,
    quizId,
    questionBanks,
    onQuestionsAdded,
}: QuestionPickerModalProps) {
    const [selectedBankId, setSelectedBankId] = useState<number | null>(
        questionBanks.length > 0 ? questionBanks[0].id : null
    );
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    const { data: questions = [], isLoading } = useQuestionsByBank(selectedBankId);
    const addQuestionsMutation = useAddQuestionsToQuiz(quizId);

    // Filter questions by search
    const filteredQuestions = useMemo(() => {
        if (!searchTerm.trim()) return questions;
        return questions.filter((q) =>
            q.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [questions, searchTerm]);

    const handleToggleQuestion = (questionId: number) => {
        setSelectedQuestions((prev) => {
            const next = new Set(prev);
            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }
            return next;
        });
    };

    const handleSelectAll = () => {
        if (selectedQuestions.size === filteredQuestions.length) {
            setSelectedQuestions(new Set());
        } else {
            setSelectedQuestions(new Set(filteredQuestions.map((q) => q.id)));
        }
    };

    const handleSubmit = () => {
        if (selectedQuestions.size === 0) return;

        addQuestionsMutation.mutate(
            { questionIds: Array.from(selectedQuestions) },
            {
                onSuccess: () => {
                    onQuestionsAdded();
                    setSelectedQuestions(new Set());
                    onOpenChange(false);
                },
            }
        );
    };

    const handleClose = () => {
        setSelectedQuestions(new Set());
        setSearchTerm("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Library className="h-5 w-5 text-purple-500" />
                        Pick Questions from Bank
                    </DialogTitle>
                    <DialogDescription>
                        Select questions to add to your quiz from your question banks.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col min-h-0 mt-4 space-y-4">
                    {/* Bank Selector and Search */}
                    <div className="flex gap-3">
                        <Select
                            value={selectedBankId?.toString() ?? ""}
                            onChange={(e) => {
                                setSelectedBankId(Number(e.target.value));
                                setSelectedQuestions(new Set());
                            }}
                            className="w-64"
                        >
                            {questionBanks.map((bank) => (
                                <SelectItem key={bank.id} value={bank.id.toString()}>
                                    {bank.name}
                                </SelectItem>
                            ))}
                        </Select>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Question List */}
                    <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        {/* Select All Header */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <Checkbox
                                checked={filteredQuestions.length > 0 && selectedQuestions.size === filteredQuestions.length}
                                onChange={handleSelectAll}
                            />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {selectedQuestions.size > 0
                                    ? `${selectedQuestions.size} selected`
                                    : "Select all"}
                            </span>
                        </div>

                        {/* Questions */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                </div>
                            ) : filteredQuestions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FileQuestion className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {searchTerm ? "No questions match your search" : "No questions in this bank"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredQuestions.map((question) => (
                                        <label
                                            key={question.id}
                                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedQuestions.has(question.id)}
                                                onChange={() => handleToggleQuestion(question.id)}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-900 dark:text-white line-clamp-2">
                                                    {question.content}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                        {questionTypeIcons[question.type]}
                                                        {question.type.replace("_", " ")}
                                                    </span>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {question.maxPoints} pts
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedQuestions.size} question{selectedQuestions.size !== 1 ? "s" : ""} selected
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedQuestions.size === 0 || addQuestionsMutation.isPending}
                        >
                            {addQuestionsMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                `Add ${selectedQuestions.size} Question${selectedQuestions.size !== 1 ? "s" : ""}`
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default QuestionPickerModal;
