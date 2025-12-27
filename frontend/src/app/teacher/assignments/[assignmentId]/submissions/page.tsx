"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAssignmentManagement } from "@/hooks/teacher/useAssignmentManagement";
import {
    FileText,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Filter,
} from "lucide-react";

export default function AssignmentSubmissionsPage() {
    const params = useParams();
    const assignmentId = Number(params.assignmentId);

    const {
        assignment,
        submissions,
        statistics,
        loading,
        error,
        gradeSubmission,
        getSubmissionFiles,
    } = useAssignmentManagement({ assignmentId });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
    const [gradingScore, setGradingScore] = useState("");
    const [gradingFeedback, setGradingFeedback] = useState("");

    // Filter submissions
    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch =
            !searchTerm ||
            sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "ALL" || sub.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Get status badge
    const getStatusBadge = (status: string) => {
        const styles = {
            SUBMITTED: "bg-blue-100 text-blue-800",
            GRADED: "bg-green-100 text-green-800",
            LATE: "bg-orange-100 text-orange-800",
            DRAFT: "bg-gray-100 text-gray-800",
        };
        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
                    }`}
            >
                {status}
            </span>
        );
    };

    // Handle grading
    const handleGrade = async (submissionId: number) => {
        if (!gradingScore) {
            alert("Please enter a score");
            return;
        }

        try {
            await gradeSubmission(submissionId, {
                score: Number(gradingScore),
                feedback: gradingFeedback,
            });
            setSelectedSubmission(null);
            setGradingScore("");
            setGradingFeedback("");
        } catch (error) {
            console.error("Failed to grade submission:", error);
        }
    };

    if (loading && !assignment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Grade Assignments
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Review and grade student submissions
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    {statistics && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                            Submissions ({statistics.submittedCount})
                                        </p>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                                            of {statistics.totalStudents} total students
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                            Graded ({statistics.gradedCount})
                                        </p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                            {statistics.gradedCount > 0
                                                ? `${Math.round((statistics.gradedCount / statistics.submittedCount) * 100)}% complete`
                                                : "No grading yet"}
                                        </p>
                                    </div>
                                    <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                            Pending ({statistics.submittedCount - statistics.gradedCount})
                                        </p>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                            Awaiting review
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Submission Details Card - Featured Student */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Submissions List */}
                    <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                Submissions ({filteredSubmissions.length})
                            </h3>
                        </div>

                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search students..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredSubmissions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            No submissions found
                                        </p>
                                    </div>
                                ) : (
                                    filteredSubmissions.map((submission) => (
                                        <button
                                            key={submission.id}
                                            onClick={() => setSelectedSubmission(submission.id)}
                                            className={`w-full p-4 rounded-xl text-left transition-all ${selectedSubmission === submission.id
                                                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-600 dark:border-indigo-400"
                                                    : "bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(submission.studentName || '')}&background=6366f1&color=fff`}
                                                    alt={submission.studentName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                        {submission.studentName}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        {submission.submittedAt
                                                            ? new Date(submission.submittedAt).toLocaleDateString()
                                                            : "Not submitted"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {getStatusBadge(submission.status)}
                                                {submission.status === "SUBMITTED" && (
                                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submission Details Panel */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        {selectedSubmission ? (
                            <>
                                {(() => {
                                    const submission = filteredSubmissions.find(s => s.id === selectedSubmission);
                                    if (!submission) return null;

                                    return (
                                        <div className="p-6">
                                            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(submission.studentName || '')}&background=6366f1&color=fff`}
                                                    alt={submission.studentName}
                                                    className="w-16 h-16 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {submission.studentName}
                                                    </h2>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        Submitted on {submission.submittedAt
                                                            ? new Date(submission.submittedAt).toLocaleString()
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                {getStatusBadge(submission.status)}
                                            </div>

                                            {/* Submission Content */}
                                            <div className="mb-6">
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                                    Submission
                                                </h3>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                        I have completed the responsive design project. Please find the attached files.
                                                    </p>
                                                </div>

                                                {/* Attachment */}
                                                {submission.files && submission.files.length > 0 && (
                                                    <div className="mt-4">
                                                        {submission.files.map((file: any, idx: number) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                                    <span className="text-sm text-slate-900 dark:text-white">
                                                                        {file.name || "responsive-portfolio.zip"}
                                                                    </span>
                                                                </div>
                                                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                                    <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Grading Section */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                        Score (out of {assignment?.maxScore || 100}) <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={gradingScore}
                                                        onChange={(e) => setGradingScore(e.target.value)}
                                                        min="0"
                                                        max={assignment?.maxScore || 100}
                                                        placeholder="Enter score"
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                        Feedback
                                                    </label>
                                                    <textarea
                                                        value={gradingFeedback}
                                                        onChange={(e) => setGradingFeedback(e.target.value)}
                                                        rows={6}
                                                        placeholder="Provide detailed feedback to the student..."
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => handleGrade(selectedSubmission)}
                                                    disabled={!gradingScore}
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Save Grade
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[600px]">
                                <div className="text-center">
                                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Select a Submission
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Choose a student submission from the list to review and grade
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
