"use client";

import {
  ShieldAlert,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { ViolationReportResponse, ViolationReportStatus } from "@/lib/admin/violation-report.types";

interface ViolationReportListProps {
  reports: ViolationReportResponse[];
  loading: boolean;
  selectedId?: number;
  onSelect: (id: number) => void;
}

export function ViolationReportList({
  reports,
  loading,
  selectedId,
  onSelect,
}: ViolationReportListProps) {
  if (loading) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-rose-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No violation reports found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-[#141d2b]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-white font-semibold">Violation Reports</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700 rounded-full text-gray-300 text-sm font-medium">
            {reports.length} total
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-[#141d2b]/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {reports.map((report) => (
              <tr
                key={report.id}
                className={`cursor-pointer transition-colors ${
                  selectedId === report.id
                    ? "bg-rose-500/10 hover:bg-rose-500/15"
                    : "hover:bg-gray-700/30"
                }`}
                onClick={() => onSelect(report.id)}
              >
                {/* ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="text-white font-mono text-sm font-medium">
                      #{report.id}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
                    {report.reportType}
                  </span>
                </td>

                {/* Reporter */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 text-sm">
                      {report.reporter.username}
                    </span>
                  </div>
                </td>

                {/* Target */}
                <td className="px-6 py-4">
                  {report.target ? (
                    <span className="text-gray-300 text-sm">
                      {report.target.username}
                    </span>
                  ) : report.course ? (
                    <span className="text-gray-400 text-sm italic">
                      Course: {report.course.title.substring(0, 20)}...
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>

                {/* Action */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(report.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
 * Helper Functions
 * ====================================================== */

function getStatusBadge(status: ViolationReportStatus) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          In Review
        </span>
      );
    case "ACTION_TAKEN":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          Action Taken
        </span>
      );
    case "DISMISSED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-sm font-medium">
          <XCircle className="w-3.5 h-3.5" />
          Dismissed
        </span>
      );
    default:
      return <span className="text-gray-500 text-sm">{status}</span>;
  }
}
