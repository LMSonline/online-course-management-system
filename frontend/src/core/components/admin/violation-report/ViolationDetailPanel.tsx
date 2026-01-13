"use client";

import { useState } from "react";
import {
  ShieldAlert,
  User,
  Mail,
  BookOpen,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Trash2,
  EyeOff,
} from "lucide-react";
import type {
  ViolationReportDetailResponse,
  ViolationActionType,
  ViolationReportStatus,
} from "@/lib/admin/violation-report.types";

interface ViolationDetailPanelProps {
  report?: ViolationReportDetailResponse | null;
  loading: boolean;
  onReview: (note: string) => void;
  onDismiss: (reason: string) => void;
  onTakeAction: (action: ViolationActionType, note: string) => void;
}

export function ViolationDetailPanel({
  report,
  loading,
  onReview,
  onDismiss,
  onTakeAction,
}: ViolationDetailPanelProps) {
  const [reviewNote, setReviewNote] = useState("");
  const [dismissReason, setDismissReason] = useState("");
  const [actionType, setActionType] = useState<ViolationActionType>("WARNING");
  const [actionNote, setActionNote] = useState("");

  if (!report) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No report selected</p>
          <p className="text-gray-500 text-sm mt-1">
            Select a report from the list to view details
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-rose-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading details...</span>
        </div>
      </div>
    );
  }

  const isActionable = report.status === "PENDING" || report.status === "IN_REVIEW";

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-[#141d2b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-white font-semibold">Report #{report.id}</h3>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Report Type */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
            Report Type
          </p>
          <p className="text-white text-lg font-semibold">
            {report.reportType}
          </p>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Description
          </h4>
          <div className="bg-[#141d2b] border border-gray-700 rounded-lg p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {report.description}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        {/* Reporter Info */}
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Reporter Information
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={<User className="w-4 h-4 text-blue-400" />}
              label="Username"
              value={report.reporter.username}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4 text-cyan-400" />}
              label="Email"
              value={report.reporter.email}
            />
          </div>
        </div>

        {/* Target Info (if exists) */}
        {report.target && (
          <>
            <div className="border-t border-gray-700"></div>
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Target User
              </h4>
              <div className="space-y-3">
                <InfoRow
                  icon={<User className="w-4 h-4 text-rose-400" />}
                  label="Username"
                  value={report.target.username}
                />
                <InfoRow
                  icon={<Mail className="w-4 h-4 text-rose-400" />}
                  label="Email"
                  value={report.target.email}
                />
              </div>
            </div>
          </>
        )}

        {/* Course/Lesson Info */}
        {(report.course || report.lesson) && (
          <>
            <div className="border-t border-gray-700"></div>
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Related Content
              </h4>
              <div className="space-y-3">
                {report.course && (
                  <InfoRow
                    icon={<BookOpen className="w-4 h-4 text-purple-400" />}
                    label="Course"
                    value={report.course.title}
                  />
                )}
                {report.lesson && (
                  <InfoRow
                    icon={<FileText className="w-4 h-4 text-indigo-400" />}
                    label="Lesson"
                    value={report.lesson.title}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Comment (if exists) */}
        {report.comment && (
          <>
            <div className="border-t border-gray-700"></div>
            <div>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Reported Comment
              </h4>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-rose-400 mt-0.5" />
                  <p className="text-gray-300 text-sm flex-1">
                    {report.comment.content}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Timeline */}
        <div className="border-t border-gray-700"></div>
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Timeline
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-cyan-400" />}
              label="Created At"
              value={new Date(report.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-emerald-400" />}
              label="Updated At"
              value={new Date(report.updatedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>
        </div>

        {/* Actions Section (only if actionable) */}
        {isActionable && (
          <>
            <div className="border-t border-gray-700"></div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Actions
              </h4>

              {/* Mark as In Review */}
              {report.status === "PENDING" && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
                  <p className="text-blue-400 font-semibold text-sm">
                    Mark as In Review
                  </p>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add review note (optional)..."
                    className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      onReview(reviewNote);
                      setReviewNote("");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Mark In Review
                  </button>
                </div>
              )}

              {/* Dismiss Report */}
              <div className="bg-gray-500/5 border border-gray-500/20 rounded-xl p-4 space-y-3">
                <p className="text-gray-400 font-semibold text-sm">Dismiss Report</p>
                <textarea
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Enter dismissal reason..."
                  className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm resize-none"
                  rows={2}
                />
                <button
                  onClick={() => {
                    if (!dismissReason.trim()) {
                      alert("Please provide a dismissal reason");
                      return;
                    }
                    onDismiss(dismissReason);
                    setDismissReason("");
                  }}
                  disabled={!dismissReason.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Dismiss Report
                </button>
              </div>

              {/* Take Action */}
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
                  <div>
                    <p className="text-rose-400 font-semibold text-sm mb-1">
                      Take Action
                    </p>
                    <p className="text-gray-400 text-xs">
                      This will mark the report as action taken
                    </p>
                  </div>
                </div>

                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ViolationActionType)}
                  className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-colors text-sm"
                >
                  <option value="WARNING">⚠️ Warning</option>
                  <option value="DELETE_COMMENT">🗑️ Delete Comment</option>
                  <option value="BAN_USER">🚫 Ban User</option>
                  <option value="HIDE_COURSE">👁️‍🗨️ Hide Course</option>
                  <option value="HIDE_LESSON">📚 Hide Lesson</option>
                </select>

                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add action note (optional)..."
                  className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors text-sm resize-none"
                  rows={2}
                />

                <button
                  onClick={() => {
                    onTakeAction(actionType, actionNote);
                    setActionNote("");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-all text-sm"
                >
                  {getActionIcon(actionType)}
                  Take Action: {actionType.replace(/_/g, " ")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ======================================================
 * Helper Components & Functions
 * ====================================================== */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-sm break-words">{value}</p>
      </div>
    </div>
  );
}

function getStatusBadge(status: ViolationReportStatus) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
          Pending
        </span>
      );
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
          In Review
        </span>
      );
    case "ACTION_TAKEN":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
          Action Taken
        </span>
      );
    case "DISMISSED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-sm font-medium">
          Dismissed
        </span>
      );
    default:
      return null;
  }
}

function getActionIcon(action: ViolationActionType) {
  switch (action) {
    case "WARNING":
      return <AlertTriangle className="w-4 h-4" />;
    case "DELETE_COMMENT":
      return <Trash2 className="w-4 h-4" />;
    case "BAN_USER":
      return <Ban className="w-4 h-4" />;
    case "HIDE_COURSE":
    case "HIDE_LESSON":
      return <EyeOff className="w-4 h-4" />;
    default:
      return <CheckCircle className="w-4 h-4" />;
  }
}
