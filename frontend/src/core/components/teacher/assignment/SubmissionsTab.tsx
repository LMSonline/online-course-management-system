"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubmissionResponse, SubmissionStatus } from "@/services/assignment/assignment.types";
import {
    useAssignmentSubmissions,
    useBulkGradeSubmissions,
} from "@/hooks/teacher/useTeacherAssignment";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/core/components/ui/Table";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/Select";
import Checkbox from "@/core/components/ui/Checkbox";
import GradingModal from "./GradingModal";
import BulkGradeModal from "./BulkGradeModal";
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Loader2,
    Users,
    RefreshCw
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const statusConfig: Record<SubmissionStatus, { label: string; icon: React.ReactNode; bgColor: string; textColor: string }> = {
    PENDING: {
        label: "Pending",
        icon: <Clock className="h-3.5 w-3.5" />,
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        textColor: "text-amber-700 dark:text-amber-400",
    },
    GRADED: {
        label: "Graded",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        textColor: "text-emerald-700 dark:text-emerald-400",
    },
    REJECTED: {
        label: "Rejected",
        icon: <XCircle className="h-3.5 w-3.5" />,
        bgColor: "bg-red-50 dark:bg-red-500/10",
        textColor: "text-red-700 dark:text-red-400",
    },
};

interface SubmissionsTabProps {
    assignmentId: number;
    maxScore: number;
}

export function SubmissionsTab({ assignmentId, maxScore }: SubmissionsTabProps) {
    const router = useRouter();
    const { data: submissions = [], isLoading, refetch, isRefetching } = useAssignmentSubmissions(assignmentId);
    const bulkGradeMutation = useBulkGradeSubmissions();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all" | "pending">("all");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<SubmissionResponse | null>(null);
    const [showBulkGradeModal, setShowBulkGradeModal] = useState(false);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter((sub) => {
            const matchesSearch =
                searchQuery === "" ||
                sub.studentName?.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesStatus = true;
            if (statusFilter === "pending") {
                matchesStatus = sub.status === "PENDING";
            } else if (statusFilter !== "all") {
                matchesStatus = sub.status === statusFilter;
            }

            return matchesSearch && matchesStatus;
        });
    }, [submissions, searchQuery, statusFilter]);

    const pendingCount = useMemo(() => {
        return submissions.filter(s => s.status === "PENDING").length;
    }, [submissions]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredSubmissions.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        }
    };

    const handleBulkGrade = (score: number, feedback?: string) => {
        bulkGradeMutation.mutate({ submissionIds: selectedIds, score, feedback }, {
            onSuccess: () => {
                setSelectedIds([]);
                setShowBulkGradeModal(false);
            },
        });
    };

    if (isLoading) {
        return (
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50">
                <CardContent className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                        <p className="text-slate-500 dark:text-slate-400">Loading submissions...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex flex-1 gap-3 flex-wrap">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search student..."
                                    className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                                />
                            </div>
                            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                                <SelectTrigger className="w-[160px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="GRADED">Graded</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className="border-slate-200 dark:border-slate-700"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            {selectedIds.length > 0 && (
                                <Button
                                    onClick={() => setShowBulkGradeModal(true)}
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0"
                                >
                                    Grade {selectedIds.length} Selected
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                {filteredSubmissions.length === 0 ? (
                    <CardContent className="py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">
                                {submissions.length === 0
                                    ? "No submissions yet"
                                    : "No submissions match your filters"
                                }
                            </p>
                        </div>
                    </CardContent>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedIds.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                                    />
                                </TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.map((submission) => {
                                const statusStyle = statusConfig[submission.status] || statusConfig.PENDING;
                                const isPending = submission.status === "PENDING";
                                const isGraded = submission.status === "GRADED";
                                return (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(submission.id)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectOne(submission.id, e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white">
                                                    {submission.studentName || "Unknown Student"}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Attempt #{submission.attemptNumber}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {submission.submittedAt ? (
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {format(new Date(submission.submittedAt), "MMM d, yyyy h:mm a")}
                                                </p>
                                            ) : (
                                                <span className="text-slate-400">Not submitted</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                                                {statusStyle.icon}
                                                {statusStyle.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {submission.score != null ? (
                                                <span className={`font-semibold ${submission.score / maxScore >= 0.7
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : submission.score / maxScore >= 0.5
                                                        ? "text-amber-600 dark:text-amber-400"
                                                        : "text-red-600 dark:text-red-400"
                                                    }`}>
                                                    {submission.score}/{maxScore}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={isPending ? "primary" : "outline"}
                                                onClick={() => setGradingSubmission(submission)}
                                                className={isPending
                                                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0"
                                                    : "border-slate-200 dark:border-slate-700"
                                                }
                                            >
                                                {isGraded ? "View" : "Grade"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Grading Modal */}
            <GradingModal
                submission={gradingSubmission}
                maxScore={maxScore}
                open={!!gradingSubmission}
                onOpenChange={(open: boolean) => !open && setGradingSubmission(null)}
            />

            {/* Bulk Grade Modal */}
            <BulkGradeModal
                open={showBulkGradeModal}
                onOpenChange={setShowBulkGradeModal}
                count={selectedIds.length}
                maxScore={maxScore}
                onConfirm={handleBulkGrade}
                isLoading={bulkGradeMutation.isPending}
            />
        </div>
    );
}

export default SubmissionsTab;
