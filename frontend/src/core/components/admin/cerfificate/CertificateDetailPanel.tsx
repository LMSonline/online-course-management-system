"use client";

import { useState } from "react";
import {
  Award,
  User,
  Mail,
  BookOpen,
  Trophy,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useCertificateAdmin, } from "@/hooks/admin/useAdminCertificate";

export function CertificateDetailPanel({
  certificateId,
}: {
  certificateId?: number;
}) {
  const [reason, setReason] = useState("");
  const {
    certificateDetail,
    loading,
    revokeCertificate,
    downloadCertificate,
  } = useCertificateAdmin({
    certificateId,
    autoLoad: true,
  });

  if (!certificateId) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No certificate selected</p>
          <p className="text-gray-500 text-sm mt-1">
            Select a certificate from the list to view details
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading details...</span>
        </div>
      </div>
    );
  }

  if (!certificateDetail) {
    return (
      <div className="bg-[#1a2332] border border-rose-500/30 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 font-semibold">Certificate not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-[#141d2b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Certificate Details</h3>
          </div>
          {/* Status Badge */}
          {certificateDetail.isRevoked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Revoked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Certificate Code */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
            Certificate Code
          </p>
          <p className="text-white text-xl font-mono font-bold">
            {certificateDetail.code}
          </p>
        </div>

        {/* Student Info */}
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Student Information
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={<User className="w-4 h-4 text-emerald-400" />}
              label="Name"
              value={certificateDetail.studentName}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4 text-blue-400" />}
              label="Email"
              value={certificateDetail.studentEmail}
            />
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        {/* Course Info */}
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Course Information
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={<BookOpen className="w-4 h-4 text-purple-400" />}
              label="Course Title"
              value={certificateDetail.courseTitle}
            />
            <InfoRow
              icon={<Trophy className="w-4 h-4 text-yellow-400" />}
              label="Final Score"
              value={
                <span className="text-emerald-400 font-bold text-lg">
                  {certificateDetail.finalScore}/100
                </span>
              }
            />
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        {/* Dates */}
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Timeline
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-cyan-400" />}
              label="Issued At"
              value={new Date(certificateDetail.issuedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            {certificateDetail.isRevoked && certificateDetail.revokedAt && (
              <InfoRow
                icon={<Clock className="w-4 h-4 text-rose-400" />}
                label="Revoked At"
                value={new Date(certificateDetail.revokedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            )}
          </div>
        </div>

        {/* Revoke Reason (if revoked) */}
        {certificateDetail.isRevoked && certificateDetail.revokeReason && (
          <>
            <div className="border-t border-gray-700"></div>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
                <div>
                  <p className="text-rose-400 font-semibold text-sm mb-1">
                    Revocation Reason
                  </p>
                  <p className="text-gray-300 text-sm">
                    {certificateDetail.revokeReason}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="pt-2 space-y-3">
          {/* Download Button */}
          <button
            onClick={downloadCertificate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>

          {/* Revoke Section (only if active) */}
          {!certificateDetail.isRevoked && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
                <div>
                  <p className="text-rose-400 font-semibold text-sm mb-1">
                    Revoke Certificate
                  </p>
                  <p className="text-gray-400 text-xs">
                    This action cannot be undone. Please provide a reason.
                  </p>
                </div>
              </div>

              <input
                className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors text-sm"
                placeholder="Enter revocation reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <button
                onClick={() => {
                  if (!reason.trim()) {
                    alert("Please provide a reason for revocation");
                    return;
                  }
                  if (confirm("Are you sure you want to revoke this certificate?")) {
                    revokeCertificate(reason);
                    setReason("");
                  }
                }}
                disabled={!reason.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all text-sm"
              >
                <XCircle className="w-4 h-4" />
                Revoke Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
 * Reusable InfoRow
 * ======================= */

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
