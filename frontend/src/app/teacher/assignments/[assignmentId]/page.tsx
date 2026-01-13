"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    FileText,
    TrendingUp,
    Target,
    Settings,
    BarChart3,
    Loader2,
    AlertCircle,
    CalendarClock
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/components/ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import {
    useAssignmentById,
    useAssignmentStatistics,
    usePassingRate,
} from "@/hooks/teacher/useTeacherAssignment";
import { AssignmentSettingsTab } from "@/core/components/teacher/assignment/AssignmentSettingsTab";
import { SubmissionsTab } from "@/core/components/teacher/assignment/SubmissionsTab";

export default function AssignmentDashboardPage({
    params,
}: {
    params: Promise<{ assignmentId: string }>;
}) {
    const { assignmentId } = use(params);
    const router = useRouter();
    const id = Number(assignmentId);
    const [activeTab, setActiveTab] = useState("overview");

    const { data: assignment, isLoading, error } = useAssignmentById(id);
    const { data: statistics } = useAssignmentStatistics(id);
    const { data: passingRateData } = usePassingRate(id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 relative" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading assignment...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-10 w-10 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Assignment not found</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">The assignment you're looking for doesn't exist.</p>
                        <Button onClick={() => router.push("/teacher/assignments")} className="mt-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Library
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const isOverdue = dueDate && isPast(dueDate);
    const pendingCount = statistics?.pendingCount ?? 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/teacher/assignments")}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                    {assignment.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                {dueDate && (
                                    <span className={`flex items-center gap-1.5 ${isOverdue ? "text-red-500" : ""}`}>
                                        <CalendarClock className="h-4 w-4" />
                                        {isOverdue ? "Overdue" : `Due ${format(dueDate, "MMM d, yyyy")}`}
                                    </span>
                                )}
                                {assignment.totalPoints && (
                                    <span className="flex items-center gap-1.5">
                                        <Target className="h-4 w-4" />
                                        {assignment.totalPoints} points
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-6 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full max-w-lg bg-white dark:bg-slate-800/50 p-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/50">
                        <TabsTrigger
                            value="overview"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="submissions"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5"
                        >
                            <FileText className="h-4 w-4" />
                            Submissions
                            {pendingCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-500 text-white rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl">
                                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Submissions</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {statistics?.submittedCount ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl">
                                            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Grading</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {(statistics?.submittedCount ?? 0) - (statistics?.gradedCount ?? 0)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-500/20 dark:to-fuchsia-500/20 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {statistics?.averageScore?.toFixed(1) ?? "N/A"}%
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 rounded-xl">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Passing Rate</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {typeof passingRateData === 'number' ? passingRateData.toFixed(1) : "N/A"}%
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Submission Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Total Submissions</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">{statistics?.submittedCount ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Graded Submissions</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{statistics?.gradedCount ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Submission Rate</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">{statistics?.submissionRate?.toFixed(1) ?? 0}%</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Score Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Highest Score</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{statistics?.highestScore ?? "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Lowest Score</span>
                                        <span className="font-semibold text-red-600 dark:text-red-400">{statistics?.lowestScore ?? "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                        <span className="text-slate-600 dark:text-slate-400">Average Score</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">{statistics?.averageScore?.toFixed(1) ?? "N/A"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Submissions Tab */}
                    <TabsContent value="submissions" className="mt-6">
                        <SubmissionsTab assignmentId={id} maxScore={assignment.totalPoints ?? 100} />
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6">
                        <AssignmentSettingsTab assignment={assignment} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
