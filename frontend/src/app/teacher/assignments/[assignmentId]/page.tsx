"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    Award,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock API call
const fetchAssignmentDetail = async (assignmentId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        id: assignmentId,
        title: "React Hooks Deep Dive",
        description: "Create a comprehensive project demonstrating advanced React Hooks usage including custom hooks, useReducer, useContext, and performance optimization techniques.",
        course: "Complete Web Development Bootcamp",
        dueDate: "Apr 15, 2024",
        maxPoints: 100,
        totalSubmissions: 45,
        graded: 38,
        pending: 7,
        averageScore: 82.5,
        passingScore: 70,
        submissions: [
            {
                id: 1,
                studentName: "John Davis",
                studentAvatar: "https://ui-avatars.com/api/?name=John+Davis&background=6366f1&color=fff",
                submittedAt: "Apr 12, 2024 3:45 PM",
                status: "graded",
                score: 85,
                feedback: "Great work on implementing custom hooks!",
            },
            {
                id: 2,
                studentName: "Maria Garcia",
                studentAvatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=10b981&color=fff",
                submittedAt: "Apr 13, 2024 10:20 AM",
                status: "graded",
                score: 92,
                feedback: "Excellent understanding of useReducer pattern.",
            },
            {
                id: 3,
                studentName: "Robert Kim",
                studentAvatar: "https://ui-avatars.com/api/?name=Robert+Kim&background=8b5cf6&color=fff",
                submittedAt: "Apr 14, 2024 2:15 PM",
                status: "pending",
                score: null,
                feedback: null,
            },
            {
                id: 4,
                studentName: "Sarah Johnson",
                studentAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=fff",
                submittedAt: "Apr 11, 2024 5:30 PM",
                status: "graded",
                score: 78,
                feedback: "Good effort, but needs more error handling.",
            },
        ],
    };
};

export default function AssignmentDetailPage({
    params,
}: {
    params: Promise<{ assignmentId: string }>;
}) {
    const { assignmentId } = use(params);

    const { data: assignment, isLoading } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => fetchAssignmentDetail(assignmentId),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assignment Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400">The assignment you're looking for doesn't exist.</p>
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
                        href="/teacher/assignments"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{assignment.title}</h1>
                        <p className="text-slate-600 dark:text-slate-400">{assignment.course}</p>
                    </div>
                    <Link
                        href={`/teacher/assignments/${assignmentId}/submissions`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                    >
                        View All Submissions
                    </Link>
                </div>

                {/* Assignment Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Assignment Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Description</h3>
                            <p className="text-slate-900 dark:text-white">{assignment.description}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{assignment.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Max Points</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{assignment.maxPoints}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Average Score</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {assignment.averageScore}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Submissions</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {assignment.totalSubmissions}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Graded</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{assignment.graded}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{assignment.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Average Score</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {assignment.averageScore}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Submissions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Submissions</h2>
                        <Link
                            href={`/teacher/assignments/${assignmentId}/submissions`}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                                        Student
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                                        Submitted At
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                                        Score
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignment.submissions.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    <img src={submission.studentAvatar} alt={submission.studentName} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {submission.studentName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                                            {submission.submittedAt}
                                        </td>
                                        <td className="py-4 px-4">
                                            {submission.status === "graded" ? (
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                    Graded
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            {submission.score !== null ? (
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {submission.score}/{assignment.maxPoints}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Link
                                                href={`/teacher/assignments/${assignmentId}/submissions/${submission.id}`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                                            >
                                                {submission.status === "graded" ? "View" : "Grade"}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
