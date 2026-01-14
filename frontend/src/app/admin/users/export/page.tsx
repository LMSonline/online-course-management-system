"use client";

import { useState } from "react";
import { useAdmin } from "@/core/components/admin/AdminContext";
import { Download, X, FileText, File, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ENV } from "@/lib/env";
import Cookies from "js-cookie";

interface AdminExportUsersModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminExportUsersModal({ open, onClose }: AdminExportUsersModalProps) {
  const { darkMode } = useAdmin();
  const [format, setFormat] = useState<"csv" | "excel">("csv");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const API_BASE_URL = ENV.API.BASE_API_URL;
      const exportFormat = format === "csv" ? "CSV" : "EXCEL";

      const body = {
        format: exportFormat,
        includeInactive: true,
        includeSuspended: true,
        includeRejected: true,
        includeDeleted: true,
      };

      const res = await fetch(`${API_BASE_URL}/admin/users/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(Cookies.get("accessToken")
            ? { Authorization: `Bearer ${Cookies.get("accessToken")}` }
            : {}),
        },

        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);

      // Auto close after 1.5 seconds on success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Export failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-colors ${darkMode ? "bg-black/70" : "bg-gray-900/50"
          }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border transition-colors ${darkMode
            ? "bg-[#12182b] border-gray-800"
            : "bg-white border-gray-200"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? "border-gray-800" : "border-gray-200"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${darkMode
                ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                : "bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}>
              <Download className={`w-5 h-5 ${darkMode ? "text-emerald-400" : "text-emerald-600"
                }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}>
                Export Users
              </h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                Download complete user database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              }`}
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleExport} className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* CSV Option */}
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-4 rounded-xl border-2 transition-all ${format === "csv"
                    ? darkMode
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-emerald-500 bg-emerald-50"
                    : darkMode
                      ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${format === "csv"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`} />
                <div className={`font-semibold ${format === "csv"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}>
                  CSV
                </div>
                <div className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"
                  }`}>
                  Comma-separated
                </div>
              </button>

              {/* Excel Option */}
              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={`p-4 rounded-xl border-2 transition-all ${format === "excel"
                    ? darkMode
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-emerald-500 bg-emerald-50"
                    : darkMode
                      ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <File className={`w-8 h-8 mx-auto mb-2 ${format === "excel"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`} />
                <div className={`font-semibold ${format === "excel"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}>
                  Excel
                </div>
                <div className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"
                  }`}>
                  .xlsx format
                </div>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className={`p-4 rounded-xl border ${darkMode
              ? "bg-blue-500/10 border-blue-500/30"
              : "bg-blue-50 border-blue-200"
            }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-blue-400" : "text-blue-600"
                }`} />
              <div className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-700"
                }`}>
                <p className="font-semibold mb-1">Export includes:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ All active users</li>
                  <li>✓ Inactive & suspended accounts</li>
                  <li>✓ Rejected & deleted users</li>
                  <li>✓ Complete user data & metadata</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${darkMode
                ? "bg-rose-500/10 border-rose-500/30"
                : "bg-rose-50 border-rose-200"
              }`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-rose-400" : "text-rose-600"
                }`} />
              <div>
                <p className={`font-semibold text-sm ${darkMode ? "text-rose-300" : "text-rose-700"
                  }`}>
                  Export Failed
                </p>
                <p className={`text-xs mt-1 ${darkMode ? "text-rose-400" : "text-rose-600"
                  }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${darkMode
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200"
              }`}>
              <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-emerald-400" : "text-emerald-600"
                }`} />
              <div>
                <p className={`font-semibold text-sm ${darkMode ? "text-emerald-300" : "text-emerald-700"
                  }`}>
                  Export Successful!
                </p>
                <p className={`text-xs mt-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                  Your file is downloading...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${loading || success
                  ? darkMode
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : darkMode
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Success!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className={`px-6 py-4 border-t text-xs text-center ${darkMode
            ? "border-gray-800 text-gray-500 bg-gray-900/30"
            : "border-gray-200 text-gray-500 bg-gray-50"
          }`}>
          🔒 Secure export • Admin access only • Data exported on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
