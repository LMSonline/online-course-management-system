"use client";

import React from "react";
import { useQuizStatistics, useQuizResults } from "@/hooks/teacher/useQuizManagement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/core/components/ui/Table";
import {
    Users,
    Target,
    TrendingUp,
    Clock,
    Award,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    BarChart3
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface QuizResultsTabProps {
    quizId: number;
}

export function QuizResultsTab({ quizId }: QuizResultsTabProps) {
    const { data: statistics, isLoading: statsLoading } = useQuizStatistics(quizId);
    const { data: results, isLoading: resultsLoading } = useQuizResults(quizId);

    const isLoading = statsLoading || resultsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500 relative" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Total Attempts</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {statistics?.totalAttempts ?? 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-500/20 dark:to-fuchsia-500/20 rounded-xl">
                                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {statistics?.averageScore?.toFixed(1) ?? 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pass Rate</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {statistics?.passingRate?.toFixed(1) ?? 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl">
                                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Time</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {statistics?.averageTimeSpent
                                        ? `${Math.round(statistics.averageTimeSpent / 60)} min`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Score Range Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-xl">
                                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Highest Score</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {statistics?.highestScore?.toFixed(1) ?? 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-500/20 dark:to-rose-500/20 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Lowest Score</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {statistics?.lowestScore?.toFixed(1) ?? 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Student Results Table */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Student Results</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                View individual student performance on this quiz.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!results?.studentResults || results.studentResults.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">
                                No students have attempted this quiz yet.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-center">Attempts</TableHead>
                                    <TableHead className="text-center">Best Score</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Last Attempt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.studentResults.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white">
                                                    {student.studentName}
                                                </p>
                                                {student.studentCode && (
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {student.studentCode}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{student.attempts}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-bold ${student.bestScore != null && student.bestScore >= 70
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-red-600 dark:text-red-400"
                                                }`}>
                                                {student.bestScore?.toFixed(1) ?? "N/A"}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {student.passed ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Passed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Failed
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-slate-500 dark:text-slate-400">
                                            {student.lastAttemptAt
                                                ? formatDistanceToNow(new Date(student.lastAttemptAt), { addSuffix: true })
                                                : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizResultsTab;
