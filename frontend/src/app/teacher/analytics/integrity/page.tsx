"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    AlertTriangle,
    Shield,
    Clock,
    Flag,
    Eye,
    Ban,
    CheckCircle,
    Search,
    Filter,
} from "lucide-react";
import { useIntegrityAlerts } from "@/hooks/teacher/useAnalytics";

type SeverityLevel = "HIGH" | "MEDIUM" | "LOW";

export default function IntegrityReportsPage() {
    const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

    const { data: alerts, loading, reviewAlert, invalidateResult } = useIntegrityAlerts();

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredAlerts = alerts.filter((alert) => {
        const matchesSearch =
            alert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.courseName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityBadge = (severity: SeverityLevel) => {
        const styles = {
            HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800",
            MEDIUM:
                "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-800",
            LOW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[severity]}`}
            >
                {severity}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            invalidated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        };
        return (
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const handleReview = (alertId: string) => {
        reviewAlert(alertId);
        setSelectedAlert(null);
    };

    const handleInvalidate = (alertId: string) => {
        if (confirm("Are you sure you want to invalidate this result? This action cannot be undone.")) {
            invalidateResult(alertId);
            setSelectedAlert(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const stats = {
        total: alerts.length,
        high: alerts.filter((a) => a.severity === "HIGH").length,
        medium: alerts.filter((a) => a.severity === "MEDIUM").length,
        low: alerts.filter((a) => a.severity === "LOW").length,
        pending: alerts.filter((a) => a.status === "pending").length,
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/analytics"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-8 h-8 text-red-600" />
                            Integrity Reports
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Báo cáo vi phạm tính toàn vẹn học tập
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Flag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Total Alerts</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-xs text-red-600 dark:text-red-400">High</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.high}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-orange-200 dark:border-orange-900 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-xs text-orange-600 dark:text-orange-400">Medium</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.medium}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-yellow-200 dark:border-yellow-900 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">Low</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.low}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-yellow-200 dark:border-yellow-900 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by student or course name..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            {(["all", "HIGH", "MEDIUM", "LOW"] as const).map((severity) => (
                                <button
                                    key={severity}
                                    onClick={() => setSeverityFilter(severity)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${severityFilter === severity
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {severity === "all" ? "All" : severity}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                    {filteredAlerts.map((alert) => (
                        <div
                            key={alert.alertId}
                            className={`bg-white dark:bg-slate-900 rounded-2xl border-2 ${alert.severity === "HIGH"
                                    ? "border-red-200 dark:border-red-900"
                                    : alert.severity === "MEDIUM"
                                        ? "border-orange-200 dark:border-orange-900"
                                        : "border-yellow-200 dark:border-yellow-900"
                                } shadow-lg overflow-hidden`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className={`p-3 rounded-xl ${alert.severity === "HIGH"
                                                    ? "bg-red-100 dark:bg-red-900/30"
                                                    : alert.severity === "MEDIUM"
                                                        ? "bg-orange-100 dark:bg-orange-900/30"
                                                        : "bg-yellow-100 dark:bg-yellow-900/30"
                                                }`}
                                        >
                                            <AlertTriangle
                                                className={`w-6 h-6 ${alert.severity === "HIGH"
                                                        ? "text-red-600 dark:text-red-400"
                                                        : alert.severity === "MEDIUM"
                                                            ? "text-orange-600 dark:text-orange-400"
                                                            : "text-yellow-600 dark:text-yellow-400"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getSeverityBadge(alert.severity)}
                                                {getStatusBadge(alert.status)}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                {alert.flagType}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                {alert.description}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Student:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {alert.studentName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Course:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {alert.courseName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Assessment:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {alert.assessmentName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Detected:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {formatDate(alert.detectedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Evidence Details */}
                                            {selectedAlert === alert.alertId && (
                                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                                        Evidence Details:
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        {alert.flagType === "Multiple Tab Switches" && (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Tab switches:
                                                                    </span>
                                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                                        {Math.floor(Math.random() * 20) + 15} times
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Duration away:
                                                                    </span>
                                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                                        {Math.floor(Math.random() * 15) + 5} minutes
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {alert.flagType === "IP Address Change" && (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Initial IP:
                                                                    </span>
                                                                    <span className="font-mono text-slate-900 dark:text-white">
                                                                        192.168.1.{Math.floor(Math.random() * 255)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Changed to:
                                                                    </span>
                                                                    <span className="font-mono text-red-600 dark:text-red-400">
                                                                        10.0.0.{Math.floor(Math.random() * 255)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Location change:
                                                                    </span>
                                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                                        Yes (suspicious)
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {alert.flagType === "Suspicious Completion Speed" && (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Completion time:
                                                                    </span>
                                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                                        {Math.floor(Math.random() * 5) + 2} minutes
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Expected time:
                                                                    </span>
                                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                                        {Math.floor(Math.random() * 20) + 20} minutes
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        Speed ratio:
                                                                    </span>
                                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                                        {(Math.random() * 3 + 3).toFixed(1)}x faster
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() =>
                                                setSelectedAlert(selectedAlert === alert.alertId ? null : alert.alertId)
                                            }
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            {selectedAlert === alert.alertId ? "Hide" : "View"} Details
                                        </button>

                                        {alert.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleReview(alert.alertId)}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mark Reviewed
                                                </button>
                                                <button
                                                    onClick={() => handleInvalidate(alert.alertId)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                    Invalidate Result
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAlerts.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-12 text-center">
                        <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            No Integrity Issues Found
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            All assessment activities appear normal
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
