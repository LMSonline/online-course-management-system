"use client";

import { useState } from "react";
import { useMyReports, useReportById } from "@/hooks/teacher";
import { ViolationReportResponse, ViolationReportDetailResponse } from "@/services/community/report/report.types";
import { formatDistanceToNow, format } from "date-fns";
import { AlertCircle, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import Button from "@/core/components/ui/Button";
import Badge from "@/core/components/ui/Badge";

const reportTypeLabels: Record<string, string> = {
    SPAM: "Spam",
    HARASSMENT: "Harassment",
    HATE_SPEECH: "Hate Speech",
    INAPPROPRIATE_CONTENT: "Inappropriate Content",
    COPYRIGHT_VIOLATION: "Copyright Violation",
    OTHER: "Other",
};

const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="h-4 w-4 text-yellow-600" />,
    UNDER_REVIEW: <Eye className="h-4 w-4 text-blue-600" />,
    RESOLVED: <CheckCircle className="h-4 w-4 text-green-600" />,
    DISMISSED: <XCircle className="h-4 w-4 text-red-600" />,
};

export default function ReportsPage() {
    const [page, setPage] = useState(0);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

    const { data: reportsData, isLoading } = useMyReports(page, 20);
    const { data: selectedReport } = useReportById(selectedReportId);

    const reports = reportsData?.items || [];
    const totalPages = reportsData?.totalPages || 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Report History</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">View and track your submitted reports</p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Reports List */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : reports.length > 0 ? (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Entity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                                {reports.map((report: ViolationReportResponse) => (
                                                    <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                                            {format(new Date(report.createdAt), "MMM dd, yyyy")}
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                                                                {reportTypeLabels[report.reportType] || report.reportType}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                            {report.target && `User: ${report.target.username}`}
                                                            {report.course && `Course: ${report.course.title}`}
                                                            {report.lesson && `Lesson: ${report.lesson.title}`}
                                                            {report.comment && `Comment (ID: ${report.comment.id})`}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                {statusIcons[report.status]}
                                                                <span className="capitalize text-slate-900 dark:text-white">{report.status.toLowerCase().replace('_', ' ')}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedReportId(report.id)}
                                                                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
                                            <Button
                                                variant="outline"
                                                onClick={() => setPage(Math.max(0, page - 1))}
                                                disabled={page === 0}
                                                className="border-slate-200 dark:border-slate-800"
                                            >
                                                Previous
                                            </Button>

                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                Page {page + 1} of {totalPages}
                                            </span>

                                            <Button
                                                variant="outline"
                                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                                disabled={page >= totalPages - 1}
                                                className="border-slate-200 dark:border-slate-800"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    <p className="text-slate-500 dark:text-slate-400">No reports submitted yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sticky top-6">
                            {selectedReport ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Report Details</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            {statusIcons[selectedReport.status]}
                                            <Badge className={
                                                selectedReport.status === "RESOLVED"
                                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                                                    : selectedReport.status === "DISMISSED"
                                                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                                                        : selectedReport.status === "UNDER_REVIEW"
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                                                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"
                                            }>
                                                {selectedReport.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Report Type</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {reportTypeLabels[selectedReport.reportType] || selectedReport.reportType}
                                        </p>
                                    </div>

                                    {selectedReport.target && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reported User</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {selectedReport.target.username} (ID: {selectedReport.target.id})
                                            </p>
                                        </div>
                                    )}

                                    {selectedReport.course && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Related Course</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {selectedReport.course.title} (ID: {selectedReport.course.id})
                                            </p>
                                        </div>
                                    )}

                                    {selectedReport.lesson && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Related Lesson</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {selectedReport.lesson.title} (ID: {selectedReport.lesson.id})
                                            </p>
                                        </div>
                                    )}

                                    {selectedReport.comment && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Related Comment</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {selectedReport.comment.content} (ID: {selectedReport.comment.id})
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Description</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{selectedReport.description}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Submitted</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {format(new Date(selectedReport.createdAt), "PPpp")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Updated</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {format(new Date(selectedReport.updatedAt), "PPpp")}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Select a report to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
