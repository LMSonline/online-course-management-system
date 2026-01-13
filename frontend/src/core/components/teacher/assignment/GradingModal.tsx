"use client";

import React, { useState, useEffect } from "react";
import { SubmissionResponse } from "@/services/assignment/assignment.types";
import {
    useGradeSubmission,
    useRejectSubmission,
    useFeedbackSubmission,
    useSubmissionFiles,
} from "@/hooks/teacher/useTeacherAssignment";
import { assignmentService } from "@/services/assignment/assignment.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/components/ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import {
    User,
    Calendar,
    FileText,
    Download,
    Star,
    MessageSquare,
    Send,
    XCircle,
    CheckCircle2,
    Loader2,
    Clock,
    File,
    ExternalLink
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface GradingModalProps {
    submission: SubmissionResponse | null;
    maxScore: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GradingModal({ submission, maxScore, open, onOpenChange }: GradingModalProps) {
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    const gradeMutation = useGradeSubmission();
    const rejectMutation = useRejectSubmission();
    const feedbackMutation = useFeedbackSubmission();
    const { data: files = [] } = useSubmissionFiles(submission?.id ?? 0);

    useEffect(() => {
        if (submission) {
            setScore(submission.score ?? 0);
            setFeedback(submission.feedback ?? "");
            setShowRejectForm(false);
            setRejectReason("");
        }
    }, [submission]);

    if (!submission) return null;

    const handleGrade = () => {
        gradeMutation.mutate({ id: submission.id, payload: { grade: score, feedback } }, {
            onSuccess: () => onOpenChange(false),
        });
    };

    const handleReject = () => {
        rejectMutation.mutate({ id: submission.id, feedback: rejectReason }, {
            onSuccess: () => onOpenChange(false),
        });
    };

    const handleSendFeedback = () => {
        feedbackMutation.mutate({ id: submission.id, payload: { feedback } }, {
            onSuccess: () => onOpenChange(false),
        });
    };

    const handleDownloadFile = async (fileId: number, fileName: string) => {
        try {
            const downloadUrl = await assignmentService.getFileDownloadUrl(submission.id, fileId);
            window.open(downloadUrl, "_blank");
        } catch (error) {
            console.error("Failed to get download URL:", error);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isPending = submission.status === "PENDING";
    const isGraded = submission.status === "GRADED";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                            <Star className="h-5 w-5 text-white" />
                        </div>
                        {isPending ? "Grade Submission" : "View Submission"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Left: Submission Content */}
                    <div className="space-y-4">
                        {/* Student Info */}
                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                            <CardContent className="py-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                                        <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">{submission.studentName}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">ID: {submission.studentId}</p>
                                    </div>
                                </div>
                                {submission.submittedAt && (
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                            <Clock className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm">{format(new Date(submission.submittedAt), "MMM d, yyyy h:mm a")}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submission Files */}
                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Submitted Files ({files.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3 pt-0">
                                {files.length === 0 ? (
                                    <p className="text-sm text-slate-400">No files submitted</p>
                                ) : (
                                    <div className="space-y-2">
                                        {files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                                        <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[180px]">
                                                            {file.fileName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDownloadFile(file.id, file.fileName)}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Previous Feedback (if graded) */}
                        {isGraded && submission.feedback && (
                            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Previous Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="py-3 pt-0">
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300">{submission.feedback}</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                                        Score: {submission.score}/{maxScore}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Grading Panel */}
                    <div className="space-y-4">
                        {showRejectForm ? (
                            /* Reject Form */
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <XCircle className="h-5 w-5" />
                                        Reject Submission
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">Reason for rejection</Label>
                                        <Textarea
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Explain why the submission needs to be resubmitted..."
                                            rows={4}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowRejectForm(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleReject}
                                            disabled={!rejectReason.trim() || rejectMutation.isPending}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
                                        >
                                            {rejectMutation.isPending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <XCircle className="mr-2 h-4 w-4" />
                                            )}
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            /* Grade Form */
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Star className="h-5 w-5 text-amber-500" />
                                        {isGraded ? "Update Grade" : "Assign Grade"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">
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
                                        <Label className="text-slate-700 dark:text-slate-300">Feedback</Label>
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Provide feedback to the student..."
                                            rows={4}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            onClick={handleGrade}
                                            disabled={gradeMutation.isPending}
                                            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-0"
                                        >
                                            {gradeMutation.isPending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                            )}
                                            Submit Grade
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={handleSendFeedback}
                                                disabled={!feedback.trim() || feedbackMutation.isPending}
                                                className="border-slate-200 dark:border-slate-700"
                                            >
                                                {feedbackMutation.isPending ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="mr-2 h-4 w-4" />
                                                )}
                                                Send Feedback
                                            </Button>
                                            {isPending && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowRejectForm(true)}
                                                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default GradingModal;
