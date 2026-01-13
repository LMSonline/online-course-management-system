"use client";

import React, { useState } from "react";
import { QuestionBankResponse, QuestionResponse } from "@/services/assessment/assessment.types";
import { useAddQuestionsFromBank, useQuizById } from "@/hooks/teacher/useQuizManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import { Select, SelectItem } from "@/core/components/ui/Select";
import Label from "@/core/components/ui/Label";
import {
    Shuffle,
    Loader2,
    AlertCircle,
    Library
} from "lucide-react";

interface RandomQuestionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quizId: number;
    questionBanks: QuestionBankResponse[];
    onQuestionsAdded: () => void;
}

export function RandomQuestionsModal({
    open,
    onOpenChange,
    quizId,
    questionBanks,
    onQuestionsAdded,
}: RandomQuestionsModalProps) {
    const [selectedBankId, setSelectedBankId] = useState<number | null>(
        questionBanks.length > 0 ? questionBanks[0].id : null
    );
    const [count, setCount] = useState(5);

    const addFromBankMutation = useAddQuestionsFromBank(quizId);
    const { refetch } = useQuizById(quizId);

    const selectedBank = questionBanks.find((b) => b.id === selectedBankId);

    const handleSubmit = () => {
        if (!selectedBankId || count <= 0) return;

        addFromBankMutation.mutate(
            { questionBankId: selectedBankId, count },
            {
                onSuccess: () => {
                    // Refetch quiz to get updated questions
                    refetch();
                    onOpenChange(false);
                    // Trigger parent refetch
                    onQuestionsAdded();
                },
            }
        );
    };

    const handleClose = () => {
        setCount(5);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shuffle className="h-5 w-5 text-purple-500" />
                        Add Random Questions
                    </DialogTitle>
                    <DialogDescription>
                        Randomly select questions from a question bank to add to your quiz.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-4">
                    {/* Bank Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="bank" className="flex items-center gap-2">
                            <Library className="h-4 w-4 text-slate-400" />
                            Question Bank
                        </Label>
                        <Select
                            id="bank"
                            value={selectedBankId?.toString() ?? ""}
                            onChange={(e) => setSelectedBankId(Number(e.target.value))}
                            className="w-full"
                        >
                            {questionBanks.length === 0 ? (
                                <SelectItem value="" disabled>
                                    No question banks available
                                </SelectItem>
                            ) : (
                                questionBanks.map((bank) => (
                                    <SelectItem key={bank.id} value={bank.id.toString()}>
                                        {bank.name}
                                    </SelectItem>
                                ))
                            )}
                        </Select>
                    </div>

                    {/* Count Input */}
                    <div className="space-y-2">
                        <Label htmlFor="count">Number of Questions</Label>
                        <Input
                            id="count"
                            type="number"
                            min={1}
                            max={50}
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Questions will be randomly selected from the bank
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p>Random selection will:</p>
                            <ul className="list-disc list-inside mt-1 text-blue-600 dark:text-blue-400">
                                <li>Pick unique questions not already in the quiz</li>
                                <li>Stop if fewer questions are available</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedBankId || count <= 0 || addFromBankMutation.isPending}
                    >
                        {addFromBankMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Shuffle className="mr-2 h-4 w-4" />
                                Add {count} Random Questions
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default RandomQuestionsModal;
