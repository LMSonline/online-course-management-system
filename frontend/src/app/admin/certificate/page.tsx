"use client";

import { useState } from "react";
import { ShieldCheck, Download, Ban } from "lucide-react";
import { useCertificateAdmin } from "@/hooks/admin/useAdminCertificate";
import type { CertificateResponse } from "@/lib/admin/certificate.types";

export default function AdminCertificatePage() {
  // demo: courseId hardcode (sau này gắn dropdown course)
  const [courseId] = useState<number>(3);
  const [selectedCertificateId, setSelectedCertificateId] =
    useState<number | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const {
    certificates,
    certificateDetail,
    loading,
    error,
    reloadByCourse,
    downloadCertificate,
    revokeCertificate,
  } = useCertificateAdmin({
    courseId,
    certificateId: selectedCertificateId ?? undefined,
  });

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Certificate Management
        </h1>
        <p className="text-gray-400">
          View, download and revoke issued certificates
        </p>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f1424] text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Issued At</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Loading certificates...
                </td>
              </tr>
            )}

            {!loading && certificates?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No certificates found
                </td>
              </tr>
            )}

            {certificates?.map((cert: CertificateResponse) => (
              <tr
                key={cert.id}
                className="border-t border-gray-800 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white">
                  {cert.studentName}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {cert.courseTitle}
                </td>
                <td className="px-4 py-3 text-center">
                  {cert.finalScore?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {cert.grade}
                </td>
                <td className="px-4 py-3 text-center">
                  {new Date(cert.issuedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {cert.isRevoked ? (
                    <span className="text-red-400">Revoked</span>
                  ) : (
                    <span className="text-emerald-400">Valid</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCertificateId(cert.id);
                      downloadCertificate();
                    }}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>

                  {!cert.isRevoked && (
                    <button
                      onClick={() => setSelectedCertificateId(cert.id)}
                      className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300"
                    >
                      <Ban className="w-4 h-4" />
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= REVOKE MODAL ================= */}
      {certificateDetail && !certificateDetail.isRevoked && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#12182b] border border-gray-800 rounded-lg w-[420px] p-5 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Revoke Certificate
            </h2>

            <p className="text-sm text-gray-400">
              Student: <span className="text-white">{certificateDetail.studentName}</span>
            </p>

            <textarea
              className="w-full rounded-md bg-[#0f1424] border border-gray-700 p-2 text-sm text-white"
              placeholder="Enter revoke reason..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedCertificateId(null)}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await revokeCertificate(revokeReason || "Policy violation");
                  setSelectedCertificateId(null);
                  setRevokeReason("");
                  reloadByCourse();
                }}
                className="px-3 py-1 rounded-md bg-rose-600 text-white"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
