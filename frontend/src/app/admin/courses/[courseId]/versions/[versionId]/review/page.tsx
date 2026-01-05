"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useVersionDetailQuery } from "@/hooks/creator/useVersionQueries";
import { useApproveVersionMutation, useRejectVersionMutation } from "@/hooks/admin/useVersionReview";
import { RejectRequest } from "@/services/account/account.types";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, AlertCircle, BookOpen, Calendar, User } from "lucide-react";
import { toast } from "sonner";

/**
 * Admin Version Review Page
 * Route: /admin/courses/:courseId/versions/:versionId/review
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * Data:
 * - VERSION_GET_DETAIL (by courseId and versionId)
 * - VERSION_APPROVE_ACTION (mutation)
 * - VERSION_REJECT_ACTION (mutation)
 */
export default function AdminCourseVersionApprovalScreen() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.courseId as string, 10);
  const versionId = parseInt(params.versionId as string, 10);

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const {
    data: version,
    isLoading: isLoadingVersion,
    error: versionError,
    refetch,
  } = useVersionDetailQuery(courseId, versionId);

  const { mutate: approveVersion, isPending: isApproving } = useApproveVersionMutation();
  const { mutate: rejectVersion, isPending: isRejecting } = useRejectVersionMutation();

  const handleApprove = () => {
    if (!confirm("Are you sure you want to approve this version?")) {
      return;
    }

    approveVersion(
      { courseId, versionId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    rejectVersion(
      {
        courseId,
        versionId,
        payload: { reason: rejectReason.trim() },
      },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectReason("");
          refetch();
        },
      }
    );
  };

  if (isLoadingVersion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (versionError || !version) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Version not found
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {versionError instanceof Error ? versionError.message : "The version you're looking for doesn't exist."}
          </p>
          <Link
            href="/admin/manage/courses/approval"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Approvals
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
      case "APPROVED":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case "PENDING":
      case "SUBMITTED":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const canApprove = version.status === "PENDING" ;
  const canReject = version.status === "PENDING";

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin/manage/courses/approval"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Approvals
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Version Review</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Course ID: {courseId} | Version ID: {versionId}
          </p>
        </div>
        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(version.status)}`}>
          {version.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Version Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Title:</span>{" "}
              <span className="font-medium">{version.title || `Version ${version.versionNumber}`}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Version Number:</span>{" "}
              <span className="font-medium">#{version.versionNumber}</span>
            </div>
            {version.price !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Price:</span>{" "}
                <span className="font-medium">${version.price.toFixed(2)}</span>
              </div>
            )}
            {version.durationDays && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>{" "}
                <span className="font-medium">{version.durationDays} days</span>
              </div>
            )}
            {version.chapterCount !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Chapters:</span>{" "}
                <span className="font-medium">{version.chapterCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </h3>
          <div className="space-y-2 text-sm">
            {version.approvedAt && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Approved At:</span>{" "}
                <span className="font-medium">{new Date(version.approvedAt).toLocaleString()}</span>
              </div>
            )}
            {version.publishedAt && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Published At:</span>{" "}
                <span className="font-medium">{new Date(version.publishedAt).toLocaleString()}</span>
              </div>
            )}
            {version.approvedBy && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Approved By:</span>{" "}
                <span className="font-medium">{version.approvedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {version.description && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{version.description}</p>
        </div>
      )}

      {version.notes && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{version.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isApproving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Approve Version
              </>
            )}
          </button>
        )}

        {canReject && (
          <>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isRejecting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              <XCircle className="h-5 w-5" />
              Reject Version
            </button>

            {showRejectModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Reject Version</h3>
                  <label className="block text-sm font-medium mb-2">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none mb-4"
                    placeholder="Please provide a reason for rejection..."
                  />
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleReject}
                      disabled={isRejecting || !rejectReason.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                          Rejecting...
                        </>
                      ) : (
                        "Confirm Reject"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason("");
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


