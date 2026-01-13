"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import { Users, Star, Loader2 } from "lucide-react";

interface BulkGradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    count: number;
    maxScore: number;
    onConfirm: (score: number, feedback?: string) => void;
    isLoading?: boolean;
}

export function BulkGradeModal({
    open,
    onOpenChange,
    count,
    maxScore,
    onConfirm,
    isLoading = false,
}: BulkGradeModalProps) {
    const [score, setScore] = useState(maxScore);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = () => {
        onConfirm(score, feedback || undefined);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        Bulk Grade
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Assign the same grade and feedback to {count} selected submissions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Note:</strong> This action will apply the same score and feedback to all {count} selected submissions. This cannot be undone.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            Score (max {maxScore})
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min={0}
                                max={maxScore}
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                className="w-24 text-center bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                            <span className="text-slate-500">/ {maxScore}</span>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-full rounded-full transition-all ${score / maxScore >= 0.7
                                            ? "bg-emerald-500"
                                            : score / maxScore >= 0.5
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                        }`}
                                    style={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Feedback (optional)</Label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Common feedback for all submissions..."
                            rows={3}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-slate-200 dark:border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Grading...
                                </>
                            ) : (
                                `Grade ${count} Submissions`
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default BulkGradeModal;
