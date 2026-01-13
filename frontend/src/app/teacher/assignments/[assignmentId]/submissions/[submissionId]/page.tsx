"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
import Input from "@/core/components/ui/Input";
import Label from "@/core/components/ui/Label";
import Textarea from "@/core/components/ui/Textarea";
import Badge from "@/core/components/ui/Badge";
import {
    useSubmissionById,
    useGradeSubmission,
    useAssignmentById,
    useAssignmentSubmissions,
} from "@/hooks/teacher";
import {
    ArrowLeft,
    Download,
    FileText,
    Clock,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function GradingPage() {
    const params = useParams();
    const router = useRouter();
    const submissionId = Number(params.submissionId);
    const assignmentId = Number(params.assignmentId);

    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");

    // API Hooks
    const { data: submission, isLoading: submissionLoading } =
        useSubmissionById(submissionId);
    const { data: assignment, isLoading: assignmentLoading } =
        useAssignmentById(assignmentId);
    const { data: allSubmissions = [] } = useAssignmentSubmissions(assignmentId);
    const gradeMutation = useGradeSubmission();

    // Find current submission index
    const currentIndex = allSubmissions.findIndex((s) => s.id === submissionId);
    const hasNext = currentIndex < allSubmissions.length - 1;
    const hasPrevious = currentIndex > 0;

    // Load existing grade if available
    useEffect(() => {
        if (submission?.score !== undefined && submission?.score !== null) {
            setScore(submission.score.toString());
        }
        if (submission?.feedback) {
            setFeedback(submission.feedback);
        }
    }, [submission]);

    const handleSubmitGrade = async () => {
        const scoreValue = Number(score);

        // Validation
        if (!score || isNaN(scoreValue)) {
            alert("Please enter a valid score");
            return;
        }

        if (assignment && assignment.totalPoints && scoreValue > assignment.totalPoints) {
            alert(`Score cannot exceed maximum score of ${assignment.totalPoints}`);
            return;
        }

        if (scoreValue < 0) {
            alert("Score cannot be negative");
            return;
        }

        await gradeMutation.mutateAsync({
            id: submissionId,
            payload: {
                grade: scoreValue,
                feedback: feedback || undefined,
            },
        });
    };

    const handleNextStudent = () => {
        if (hasNext) {
            const nextSubmission = allSubmissions[currentIndex + 1];
            router.push(
                `/teacher/assignments/${assignmentId}/submissions/${nextSubmission.id}`
            );
        }
    };

    const handlePreviousStudent = () => {
        if (hasPrevious) {
            const previousSubmission = allSubmissions[currentIndex - 1];
            router.push(
                `/teacher/assignments/${assignmentId}/submissions/${previousSubmission.id}`
            );
        }
    };

    const isLoading = submissionLoading || assignmentLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!submission || !assignment) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Submission not found</h1>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{assignment.title}</h1>
                    <p className="text-muted-foreground">Grade Submission</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousStudent}
                        disabled={!hasPrevious}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {currentIndex + 1} of {allSubmissions.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextStudent}
                        disabled={!hasNext}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Submission Details & Files (70%) */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Student Info Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{submission.studentName}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Attempt #{submission.attemptNumber}
                                    </p>
                                </div>
                                <Badge
                                    variant={submission.status === "GRADED" ? "default" : "secondary"}
                                    className={
                                        submission.status === "GRADED"
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                    }
                                >
                                    {submission.status === "GRADED" ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Graded
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Submitted:</span>
                                <span className="font-medium">
                                    {submission.submittedAt
                                        ? formatDistanceToNow(new Date(submission.submittedAt), {
                                            addSuffix: true,
                                        })
                                        : "Not submitted"}
                                </span>
                            </div>
                            {submission.submittedAt && (
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(submission.submittedAt), "PPpp")}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submitted Files Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Submitted Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submission.files && submission.files.length > 0 ? (
                                <div className="space-y-2">
                                    {submission.files.map((file, index) => (
                                        <div
                                            key={file.id || index}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-sm">{file.fileName}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-2" />
                                    <p>No files submitted</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Previous Feedback (if already graded) */}
                    {submission.status === "GRADED" && submission.feedback && (
                        <Card className="border-green-200 bg-green-50/50">
                            <CardHeader>
                                <CardTitle className="text-green-800">
                                    Previous Feedback
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-green-700 whitespace-pre-wrap">
                                    {submission.feedback}
                                </p>
                                {submission.gradedAt && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                        Graded {formatDistanceToNow(new Date(submission.gradedAt), { addSuffix: true })}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Grading Panel (30%) */}
                <div className="space-y-4">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Grade Submission</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Score Input */}
                            <div className="space-y-2">
                                <Label htmlFor="score">
                                    Score <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="score"
                                        type="number"
                                        value={score}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScore(e.target.value)}
                                        placeholder="0"
                                        min={0}
                                        max={assignment.totalPoints || 100}
                                        step="0.1"
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        / {assignment.totalPoints || 100}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter grade (0-10 scale) - Max: {assignment.totalPoints || 100} points
                                </p>
                            </div>

                            {/* Feedback Textarea */}
                            <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback</Label>
                                <Textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback to the student..."
                                    rows={8}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional detailed feedback for the student
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmitGrade}
                                className="w-full"
                                disabled={gradeMutation.isPending || !score}
                            >
                                {gradeMutation.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        {submission.status === "GRADED"
                                            ? "Update Grade"
                                            : "Submit Grade"}
                                    </>
                                )}
                            </Button>

                            {/* Quick Actions */}
                            <div className="pt-4 border-t space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleNextStudent}
                                    disabled={!hasNext}
                                >
                                    Save & Next Student
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <AlertCircle className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Grading Tips</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Review all submitted files carefully</li>
                                        <li>Provide constructive feedback</li>
                                        <li>Consider late submission penalties if applicable</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
