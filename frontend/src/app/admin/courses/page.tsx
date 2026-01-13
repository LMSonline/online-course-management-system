"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, FileCheck, FileX } from "lucide-react";

import {
  useGetPendingVersions,
  useApproveVersion,
  useRejectVersion
} from "@/hooks/admin/useAdminCourses";

import type { CourseResponse } from "@/services/courses/course.types";
import type { CourseVersionResponse } from "@/services/courses/course.types";
import { CourseVersionDetailModal } from "@/core/components/admin/courses/CourseVersionDetailModal";
/* =======================
   STATUS STYLE
======================= */
const statusChip: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/50",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/50",
  REJECTED: "bg-rose-500/15 text-rose-300 border-rose-500/50",
};

/* =======================
   MAIN PAGE
======================= */
export default function AdminCourseApprovalPage() {
  const [page] = useState(0);
  const [size] = useState(10);
  const [selectedVersion, setSelectedVersion] = useState<CourseVersionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ===== API ===== */
  const { data, isLoading, error } = useGetPendingVersions({
    page,
    size,
  });

  const approveMutation = useApproveVersion();
  const rejectMutation = useRejectVersion();

  const pendingVersions: CourseVersionResponse[] =
    data?.items ?? [];

  const handleCardClick = (version: CourseVersionResponse) => {
    setSelectedVersion(version);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVersion(null);
  };

  return (
    <section className="space-y-6 max-w-6xl">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Course Approval
        </h1>
        <p className="text-sm text-slate-400">
          Review and approve pending course versions submitted by instructors.
        </p>
      </div>

      {/* CONTENT */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Versions
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Total:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30">
                {pendingVersions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">
                Loading pending versions...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-sm text-rose-400 font-medium">
                Failed to load pending versions
              </p>
              <p className="text-xs text-slate-500">
                Please try again later
              </p>
            </div>
          )}

          {!isLoading && !error && pendingVersions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300 font-medium">
                All caught up!
              </p>
              <p className="text-xs text-slate-500">
                No pending course versions at the moment 🎉
              </p>
            </div>
          )}

          {!isLoading && !error && pendingVersions.length > 0 && (
            <div className="space-y-3">
              {pendingVersions.map((v) => (
                <PendingVersionCard
                  key={v.id}
                  item={v}
                  onClick={() => handleCardClick(v)}
                  onApprove={() =>
                    approveMutation.mutate({
                      courseId: v.courseId,
                      versionId: v.id,
                    })
                  }
                  onReject={() =>
                    rejectMutation.mutate({
                      courseId: v.courseId,
                      versionId: v.id,
                      reason: "Not suitable for publishing",
                    })
                  }
                  isApproving={approveMutation.isPending}
                  isRejecting={rejectMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedVersion && (
        <CourseVersionDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          courseId={selectedVersion.courseId}
          versionId={selectedVersion.id}
        />
      )}
    </section>
  );
}

/* =======================
   CARD COMPONENT
======================= */
function PendingVersionCard({
  item,
  onClick,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  item: CourseVersionResponse;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove();
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReject();
  };

  return (
    <div 
      onClick={onClick}
      className="group rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent p-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer"
    >
      {/* INFO */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <p className="text-base font-semibold text-slate-50 leading-snug group-hover:text-white transition-colors">
            {item.title}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">
            <span className="text-amber-400 font-mono">#</span>
            <span className="font-medium">v{item.versionNumber}</span>
          </span>
          
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-medium">{item.chapterCount} chapters</span>
          </span>
        </div>

        {item.createdAt && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Submitted at {item.createdAt}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2.5 md:w-64">
        <div className="flex items-center justify-between md:justify-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              statusChip[item.status] ?? statusChip["PENDING"]
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
            {item.status}
          </span>
        </div>

        {item.status === "PENDING" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isApproving}
              onClick={handleApprove}
              className="group/btn inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 transition-all duration-150 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {isApproving ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              )}
              Approve
            </button>

            <button
              disabled={isRejecting}
              onClick={handleReject}
              className="group/btn inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/15 px-3 py-2.5 text-xs font-bold text-rose-300 border border-rose-500/50 hover:bg-rose-500/25 hover:border-rose-500/70 hover:text-rose-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-500/15 transition-all duration-150"
            >
              {isRejecting ? (
                <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}