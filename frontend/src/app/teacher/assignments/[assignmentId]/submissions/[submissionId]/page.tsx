"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Calendar,
    FileText,
    Download,
    Save,
    CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Mock API calls
const fetchSubmissionDetail = async (assignmentId: string, submissionId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        id: submissionId,
        assignmentId,
        assignmentTitle: "React Hooks Deep Dive",
        studentName: "John Davis",
        studentAvatar: "https://ui-avatars.com/api/?name=John+Davis&background=6366f1&color=fff",
        studentEmail: "john.d@example.com",
        submittedAt: "Apr 12, 2024 3:45 PM",
        maxPoints: 100,
        currentScore: 85,
        currentFeedback: "Great work on implementing custom hooks! Your code is clean and well-organized.",
        content: `# React Hooks Project

## Overview
This project demonstrates advanced usage of React Hooks including custom hooks, useReducer, useContext, and performance optimization techniques.

## Features Implemented
1. Custom hooks for data fetching
2. useReducer for complex state management
3. useContext for global state
4. useMemo and useCallback for optimization
5. Custom useDebounce hook

## Code Quality
- Clean code structure
- Proper error handling
- TypeScript implementation
- Unit tests included

## Screenshots and Demo
[Link to deployed project](https://example.com/demo)

## Repository
[GitHub Repository](https://github.com/johndavis/react-hooks-project)`,
        attachments: [
            { name: "project-screenshots.pdf", url: "#", size: "2.5 MB" },
            { name: "source-code.zip", url: "#", size: "5.1 MB" },
        ],
        attemptNumber: 1,
        maxAttempts: 3,
        gradingHistory: [
            {
                gradedAt: "Apr 12, 2024 5:30 PM",
                score: 85,
                feedback: "Great work on implementing custom hooks!",
                gradedBy: "Prof. Sarah",
            },
        ],
    };
};

const saveGrade = async (data: { submissionId: string; score: number; feedback: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
};

export default function GradeSubmissionPage({
    params,
}: {
    params: Promise<{ assignmentId: string; submissionId: string }>;
}) {
    const { assignmentId, submissionId } = use(params);
    const queryClient = useQueryClient();

    const { data: submission, isLoading } = useQuery({
        queryKey: ["submission", assignmentId, submissionId],
        queryFn: () => fetchSubmissionDetail(assignmentId, submissionId),
    });

    const [score, setScore] = useState(submission?.currentScore || 0);
    const [feedback, setFeedback] = useState(submission?.currentFeedback || "");

    const gradeMutation = useMutation({
        mutationFn: saveGrade,
        onSuccess: () => {
            toast.success("Grade saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["submission", assignmentId, submissionId] });
            queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
        },
        onError: () => {
            toast.error("Failed to save grade");
        },
    });

    const handleSaveGrade = () => {
        if (score < 0 || score > (submission?.maxPoints || 100)) {
            toast.error(`Score must be between 0 and ${submission?.maxPoints}`);
            return;
        }

        gradeMutation.mutate({
            submissionId,
            score,
            feedback,
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Submission Not Found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/teacher/assignments/${assignmentId}`}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Grade Submission</h1>
                        <p className="text-slate-600 dark:text-slate-400">{submission.assignmentTitle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Student Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Student Information</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    <img src={submission.studentAvatar} alt={submission.studentName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{submission.studentName}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{submission.studentEmail}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            {submission.submittedAt}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Attempt {submission.attemptNumber}/{submission.maxAttempts}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Submission Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Submission Content</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                    {submission.content}
                                </pre>
                            </div>
                        </motion.div>

                        {/* Attachments */}
                        {submission.attachments.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                            >
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Attachments</h2>
                                <div className="space-y-3">
                                    {submission.attachments.map((attachment, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{attachment.name}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{attachment.size}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={attachment.url}
                                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                                download
                                            >
                                                <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Grading History */}
                        {submission.gradingHistory.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                            >
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Grading History</h2>
                                <div className="space-y-4">
                                    {submission.gradingHistory.map((history, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Score: {history.score}/{submission.maxPoints}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{history.gradedAt}</p>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{history.feedback}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Graded by {history.gradedBy}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Grading Panel */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Grade Submission
                            </h2>

                            <div className="space-y-6">
                                {/* Score Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Score (out of {submission.maxPoints})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={submission.maxPoints}
                                        value={score}
                                        onChange={(e) => setScore(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white text-lg font-semibold"
                                    />
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                            <span>0</span>
                                            <span>{submission.maxPoints}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(score / submission.maxPoints) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Feedback
                                    </label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={8}
                                        placeholder="Provide detailed feedback for the student..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white resize-none"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSaveGrade}
                                        disabled={gradeMutation.isPending}
                                        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        {gradeMutation.isPending ? "Saving..." : "Save Grade"}
                                    </button>
                                    <Link
                                        href={`/teacher/assignments/${assignmentId}/submissions`}
                                        className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        Back to Submissions
                                    </Link>
                                </div>

                                {/* Quick Score Buttons */}
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quick Score</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[100, 90, 80, 70].map((quickScore) => (
                                            <button
                                                key={quickScore}
                                                onClick={() => setScore(quickScore)}
                                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                {quickScore}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
