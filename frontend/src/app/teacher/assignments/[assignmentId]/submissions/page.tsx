"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/core/components/ui/Table";
import Badge from "@/core/components/ui/Badge";
import Input from "@/core/components/ui/Input";
import {
    useAssignmentById,
    useAssignmentSubmissions,
    useAssignmentStatistics,
} from "@/hooks/teacher";
import {
    ArrowLeft,
    Download,
    Users,
    CheckCircle2,
    Clock,
    FileText,
    Search,
    AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { SubmissionStatus } from "@/services/assignment/assignment.types";

export default function AssignmentSubmissionsPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = Number(params.assignmentId);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "ALL">("ALL");

    // API Hooks
    const { data: assignment, isLoading: assignmentLoading } =
        useAssignmentById(assignmentId);
    const { data: submissions = [], isLoading: submissionsLoading } =
        useAssignmentSubmissions(assignmentId);
    const { data: statistics, isLoading: statsLoading } =
        useAssignmentStatistics(assignmentId);

    const isLoading = assignmentLoading || submissionsLoading || statsLoading;

    const handleViewSubmission = (submissionId: number) => {
        router.push(
            `/teacher/assignments/${assignmentId}/submissions/${submissionId}`
        );
    };

    const exportToCSV = () => {
        if (!submissions) return;

        const headers = [
            "Student Name",
            "Status",
            "Submitted At",
            "Score",
            "Attempt",
        ];

        const rows = submissions.map((sub) => [
            sub.studentName || "",
            sub.status,
            sub.submittedAt
                ? format(new Date(sub.submittedAt), "yyyy-MM-dd HH:mm:ss")
                : "",
            sub.score?.toString() || "",
            sub.attemptNumber?.toString() || "1",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `assignment-${assignmentId}-submissions.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (status: SubmissionStatus) => {
        const statusConfig = {
            PENDING: { variant: "secondary" as const, label: "Pending", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" },
            GRADED: {
                variant: "default" as const,
                label: "Graded",
                className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
            },
            REJECTED: { variant: "destructive" as const, label: "Rejected" },
        };
        const config = statusConfig[status] || statusConfig.PENDING;
        const badgeClassName = 'className' in config ? config.className : '';
        return (
            <Badge variant={config.variant} className={badgeClassName}>
                {config.label}
            </Badge>
        );
    };

    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch =
            (sub.studentName?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            );

        const matchesFilter = filterStatus === "ALL" || sub.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const needsGradingCount = submissions.filter(
        (s) => s.status === "PENDING"
    ).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{assignment.title}</h1>
                    <p className="text-muted-foreground">
                        Assignment Submissions & Grading
                    </p>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Students
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                            <p className="text-xs text-muted-foreground">
                                Enrolled in course
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Submission Rate
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.submissionRate.toFixed(0)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.submittedCount} of {statistics.totalStudents} submitted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Needs Grading</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {needsGradingCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.gradedCount} already graded
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.averageScore
                                    ? `${statistics.averageScore.toFixed(1)}/${assignment.totalPoints || 100}`
                                    : "-"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.highestScore !== undefined &&
                                    statistics.lowestScore !== undefined
                                    ? `Range: ${statistics.lowestScore}-${statistics.highestScore}`
                                    : "No grades yet"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Submissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by student name..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) =>
                                setFilterStatus(e.target.value as SubmissionStatus | "ALL")
                            }
                            className="flex h-10 w-[180px] rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Submissions</option>
                            <option value="PENDING">Needs Grading</option>
                            <option value="GRADED">Graded</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    {/* Submissions Table */}
                    {filteredSubmissions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4" />
                            <p>
                                {searchTerm || filterStatus !== "ALL"
                                    ? "No submissions match your filters"
                                    : "No submissions yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Attempt</TableHead>
                                        <TableHead>Files</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubmissions.map((submission) => (
                                        <TableRow
                                            key={submission.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleViewSubmission(submission.id)}
                                        >
                                            <TableCell className="font-medium">
                                                {submission.studentName}
                                            </TableCell>
                                            <TableCell>
                                                {submission.submittedAt ? (
                                                    <span className="text-sm">
                                                        {formatDistanceToNow(
                                                            new Date(submission.submittedAt),
                                                            { addSuffix: true }
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(submission.status)}
                                            </TableCell>
                                            <TableCell>
                                                {submission.score !== undefined &&
                                                    submission.score !== null ? (
                                                    <span className="font-medium">
                                                        {submission.score}/{assignment.totalPoints ?? 100}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    #{submission.attemptNumber}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {submission.files && submission.files.length > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <FileText className="h-4 w-4" />
                                                        {submission.files.length}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">0</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    {submission.status === "PENDING"
                                                        ? "Grade"
                                                        : "View"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
