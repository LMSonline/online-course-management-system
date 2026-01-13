"use client";

import { useState } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Search,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useCertificateAdmin } from "@/hooks/admin/useAdminCertificate";

export function CertificateVerifyBox() {
  const [code, setCode] = useState("");
  const { verifyCertificate, verificationResult, loading } =
    useCertificateAdmin({ autoLoad: false });

  const handleVerify = () => {
    if (!code.trim()) {
      alert("Please enter a certificate code");
      return;
    }
    verifyCertificate(code.trim());
  };

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-[#141d2b]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Public Certificate Verification</h3>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Verify the authenticity of any certificate by entering its code
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter certificate code (e.g., CERT-2024-001)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
              className="w-full bg-[#141d2b] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <button
            onClick={handleVerify}
            disabled={loading || !code.trim()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Verify
              </>
            )}
          </button>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div
            className={`border rounded-xl p-6 ${
              verificationResult.isValid
                ? "bg-emerald-500/5 border-emerald-500/30"
                : "bg-rose-500/5 border-rose-500/30"
            }`}
          >
            {/* Status Header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`p-3 rounded-xl ${
                  verificationResult.isValid
                    ? "bg-emerald-500/10"
                    : "bg-rose-500/10"
                }`}
              >
                {verificationResult.isValid ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-bold text-xl mb-1 ${
                    verificationResult.isValid ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {verificationResult.isValid
                    ? "✓ Certificate is Valid"
                    : "✗ Certificate is Invalid"}
                </h4>
                <p className="text-gray-400 text-sm">
                  {verificationResult.isValid
                    ? "This certificate is authentic and active"
                    : verificationResult.message || "Certificate verification failed"}
                </p>
              </div>
            </div>

            {/* Details (only if found) */}
            {verificationResult.studentName && (
              <>
                <div className="border-t border-gray-700 mb-4"></div>
                <div className="space-y-4">
                  <DetailRow
                    icon={<User className="w-5 h-5 text-purple-400" />}
                    label="Student Name"
                    value={verificationResult.studentName}
                  />
                  <DetailRow
                    icon={<BookOpen className="w-5 h-5 text-blue-400" />}
                    label="Course Name"
                    value={verificationResult.courseName}
                  />
                  <DetailRow
                    icon={<Calendar className="w-5 h-5 text-cyan-400" />}
                    label="Issued Date"
                    value={new Date(verificationResult.issuedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                </div>
              </>
            )}

            {/* Additional Warning for Revoked */}
            {!verificationResult.isValid && verificationResult.message && (
              <>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-rose-400 font-semibold text-sm mb-1">
                      Important Notice
                    </p>
                    <p className="text-gray-300 text-sm">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Box */}
        {!verificationResult && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-1">
                  How to verify
                </p>
                <p className="text-gray-400 text-sm">
                  Enter the certificate code exactly as shown on the certificate document.
                  The verification will check if the certificate is authentic and still valid.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
 * Reusable DetailRow
 * ======================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
