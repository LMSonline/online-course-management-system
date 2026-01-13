/**
 * AdminExportUsersScreen
 * Route: /admin/users/export
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - POST /admin/users/export (ADMIN_EXPORT_USERS_ACTION)
 */
"use client";
import { useState } from "react";
import { ENV } from "@/lib/env";

interface AdminExportUsersScreenProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminExportUsersScreen({ open, onClose }: AdminExportUsersScreenProps) {
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = ENV.API.BASE_API_URL;
      const exportFormat = format === "csv" ? "CSV" : "EXCEL";
      const body: any = {
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
          ...(typeof window !== "undefined" && localStorage.getItem("access_token")
            ? { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            : {}),
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose(); // Đóng popup sau khi export
    } catch (err: any) {
      setError(err.message || "Export failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{}}
    >
      <div
        className="relative bg-[#12182b] p-8 rounded-xl border border-gray-800 shadow-lg w-full max-w-lg pointer-events-auto"
        // pointer-events-auto để popup vẫn nhận sự kiện
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-4">Export Users</h1>
        <form onSubmit={handleExport} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Export Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full bg-[#1a2237] border border-gray-700 rounded px-3 py-2 text-white"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel (.xlsx)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? "Exporting..." : "Export"}
          </button>
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </form>
        <div className="mt-6 text-gray-400 text-sm">
          Download all users in the selected format. Only admins can export user data.
        </div>
      </div>
    </div>
  );
}

