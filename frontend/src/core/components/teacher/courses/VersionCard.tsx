"use client";
import Link from "next/link";
import { useState } from "react";
import {
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Eye,
    Edit,
    Send,
    Rocket,
    Trash2,
    Archive,
    DollarSign,
    Target,
    Calendar,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import { CourseVersionResponse } from "@/services/courses/course.types";

interface VersionCardProps {
    version: CourseVersionResponse;
    courseSlug: string;
    onSubmitForApproval: (versionId: number) => void;
    onPublish: (versionId: number) => void;
    onDelete: (versionId: number) => void;
    isSubmitting: boolean;
    isPublishing: boolean;
}

export function VersionCard({
    version,
    courseSlug,
    onSubmitForApproval,
    onPublish,
    onDelete,
    isSubmitting,
    isPublishing,
}: VersionCardProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return {
                    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
                    icon: <CheckCircle className="w-4 h-4" />,
                    badge: "Live",
                };
            case "APPROVED":
                return {
                    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
                    icon: <CheckCircle className="w-4 h-4" />,
                    badge: "Approved",
                };
            case "PENDING":
                return {
                    color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    icon: <Clock className="w-4 h-4" />,
                    badge: "Pending Review",
                };
            case "REJECTED":
                return {
                    color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
                    icon: <XCircle className="w-4 h-4" />,
                    badge: "Rejected",
                };
            case "ARCHIVED":
                return {
                    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
                    icon: <Archive className="w-4 h-4" />,
                    badge: "Archived",
                };
            default: // DRAFT
                return {
                    color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30",
                    icon: <FileText className="w-4 h-4" />,
                    badge: "Draft",
                };
        }
    };

    const statusConfig = getStatusConfig(version.status);
    const canSubmit = version.status === "DRAFT" || version.status === "REJECTED";
    const canPublish = version.status === "APPROVED";
    const canDelete = version.status !== "PUBLISHED" && version.status !== "ARCHIVED";
    const canEdit = version.status === "DRAFT" || version.status === "REJECTED";

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {version.title}
                            </h3>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${statusConfig.color}`}
                            >
                                {statusConfig.icon}
                                {statusConfig.badge}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {version.description || "No description provided"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Version
                        </p>
                        <div className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            v{version.versionNumber}
                        </div>
                    </div>
                </div>

                {/* Rejected Notes */}
                {version.status === "REJECTED" && version.notes && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                                    Rejection Reason:
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    {version.notes}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Grid */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Price</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                ${version.price || 0}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {version.durationDays || 0} days
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Pass Score</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {version.passScore || 0}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Chapters</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {version.chapterCount || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                {(version.publishedAt || version.approvedAt) && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {version.publishedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    Published: {new Date(version.publishedAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {version.approvedAt && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>
                                    Approved: {new Date(version.approvedAt).toLocaleDateString()}
                                    {version.approvedBy && ` by ${version.approvedBy}`}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-3">
                    {/* View Course Button */}
                    <Link
                        href={`/teacher/courses/${courseSlug}/versions/${version.id}/view`}
                        className="flex-1 min-w-[140px] px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View Course
                    </Link>

                    {/* Edit Content Button */}
                    {canEdit && (
                        <Link
                            href={`/teacher/courses/${courseSlug}/versions/${version.id}/content`}
                            className="flex-1 min-w-[140px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Content
                        </Link>
                    )}

                    {/* Submit for Approval Button */}
                    {canSubmit && (
                        <button
                            onClick={() => onSubmitForApproval(version.id)}
                            disabled={isSubmitting}
                            className="flex-1 min-w-[140px] px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit for Review
                                </>
                            )}
                        </button>
                    )}

                    {/* Publish Button */}
                    {canPublish && (
                        <button
                            onClick={() => onPublish(version.id)}
                            disabled={isPublishing}
                            className="flex-1 min-w-[140px] px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                        >
                            {isPublishing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4" />
                                    Publish Now
                                </>
                            )}
                        </button>
                    )}

                    {/* Delete Button */}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(version.id)}
                            className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
                            title="Delete version"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
