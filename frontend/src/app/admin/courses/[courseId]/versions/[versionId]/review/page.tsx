"use client";

import { useState } from "react";
import { ArrowLeft, AlertCircle, CheckCircle, XCircle, Send } from "lucide-react";
import {
  useGetVersionDetail,
  useApproveVersion,
  useRejectVersion,
  usePublishVersion,
} from "@/hooks/admin/useAdminCourses";
import { SafeImage } from "@/core/components/ui/SafeImage";
import { CourseStatus } from "@/lib/admin/types";
interface AdminCourseVersionReviewProps {
  courseId: number;
  versionId: number;
  onClose: () => void;
}

export default function AdminCourseVersionReview({
  courseId,
  versionId,
  onClose,
}: AdminCourseVersionReviewProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const { data: version, isLoading } = useGetVersionDetail(courseId, versionId);
  const approve = useApproveVersion();
  const reject = useRejectVersion();
  const publish = usePublishVersion();

  const handleApprove = async () => {
    setActionInProgress(true);
    try {
      await approve.mutateAsync({ courseId, versionId });
      onClose();
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    setActionInProgress(true);
    try {
      await reject.mutateAsync({ courseId, versionId, reason: rejectReason });
      onClose();
    } finally {
      setActionInProgress(false);
    }
  };

  const handlePublish = async () => {
    setActionInProgress(true);
    try {
      await publish.mutateAsync({ courseId, versionId });
      onClose();
    } finally {
      setActionInProgress(false);
    }
  };
const handleApproveAndPublish = async () => {
  setActionInProgress(true);
  try {
    await approve.mutateAsync({ courseId, versionId });
    await publish.mutateAsync({ courseId, versionId });
    onClose();
  } finally {
    setActionInProgress(false);
  }
};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading version details...</div>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">Version not found</div>
      </div>
    );
  }

const statusBadgeColor: Record<CourseStatus, string> = {
    PENDING: "bg-yellow-900/30 text-yellow-400",
    APPROVED: "bg-green-900/30 text-green-400",
    REJECTED: "bg-red-900/30 text-red-400",
    PUBLISHED: "bg-blue-900/30 text-blue-400",
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{version.title}</h1>
            <p className="text-gray-400">Course Version Review</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusBadgeColor[version.status as keyof typeof statusBadgeColor] || "bg-gray-700 text-gray-300"}`}>
          {version.status}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Version Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Version Overview */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Version Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Version Number</p>
                <p className="text-white font-semibold">v{version.versionNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-white font-semibold">${version.price}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white font-semibold">{version.durationDays} days</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pass Score</p>
                <p className="text-white font-semibold">{version.passScore}/10
</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Min Progress</p>
                <p className="text-white font-semibold">{version.minProgressPct}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Final Weight</p>
                <p className="text-white font-semibold">{version.finalWeight}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-400 leading-relaxed">{version.description}</p>
          </div>

          {/* Chapters */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
            <p className="text-gray-400 text-sm mb-4">Total Chapters: {version.chapterCount}</p>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Chapter content details would be displayed here if available</p>
            </div>
          </div>

          {/* Notes */}
          {version.notes && (
            <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Instructor Notes</h3>
              <p className="text-gray-400">{version.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Review Actions</h3>

            {version.status === "PENDING" && (
              <div className="space-y-3">
                {/* Approve Button */}
                {/* <button
                  onClick={handleApprove}
                  disabled={actionInProgress || approve.isPending}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {approve.isPending ? "Approving..." : "Approve Version"}
                </button> */}

                {/* Publish Button */}
              <button
  onClick={handleApproveAndPublish}
  disabled={actionInProgress || approve.isPending || publish.isPending}
>
  Approve & Publish
</button>

                {/* Reject Button */}
                <button
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  disabled={actionInProgress}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Version
                </button>
              </div>
            )}

            {version.status === "APPROVED" && (
              <div className="space-y-3">
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Approved</p>
                    <p className="text-gray-400 text-xs">Ready to be published</p>
                  </div>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={actionInProgress || publish.isPending}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {publish.isPending ? "Publishing..." : "Publish Now"}
                </button>
              </div>
            )}

            {version.status === "PUBLISHED" && (
              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">Published</p>
                  <p className="text-gray-400 text-xs">Available to students</p>
                </div>
              </div>
            )}

            {version.status === "REJECTED" && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white text-sm font-medium">Rejected</p>
                  <p className="text-gray-400 text-xs">Version was rejected</p>
                </div>
              </div>
            )}
          </div>

          {/* Reject Form */}
          {showRejectForm && version.status === "PENDING" && (
            <div className="bg-[#12182b] border border-red-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-semibold">Rejection Reason</h3>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this version is being rejected..."
                className="w-full bg-[#0d111f] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleReject}
                  disabled={actionInProgress || reject.isPending || !rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {reject.isPending ? "Rejecting..." : "Confirm Rejection"}
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                  disabled={actionInProgress}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Approval Info */}
          {version.approvedAt && (
            <div className="bg-[#12182b] border border-gray-800 rounded-lg p-4 text-sm">
              <p className="text-gray-400 mb-2">Approved By</p>
              <p className="text-white font-semibold">{version.approvedBy}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
