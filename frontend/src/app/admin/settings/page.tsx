/**
 * AdminSystemSettingsScreen
 * Route: /admin/settings
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /admin/settings (ADMIN_GET_SETTINGS)
 */
"use client";

import { useState } from "react";
import { Settings, Plus, Edit2, Trash2, X, Save, Key, FileText } from "lucide-react";
import { useSystemSettings, useCreateSystemSetting, useUpdateSystemSetting, useDeleteSystemSetting } from "@/hooks/admin/useSystem";
import type { SystemSetting } from "@/lib/admin/types";

export default function AdminSystemSettingsScreen() {
  const { data: settings = [], isLoading, isError } = useSystemSettings();

  const createMutation = useCreateSystemSetting();
  const updateMutation = useUpdateSystemSetting();
  const deleteMutation = useDeleteSystemSetting();

  const [editing, setEditing] = useState<SystemSetting | null>(null);
  const [form, setForm] = useState({
    keyName: "",
    value: "",
    description: "",
  });

  /* ---------------- Handlers ---------------- */

  const resetForm = () => {
    setForm({ keyName: "", value: "", description: "" });
    setEditing(null);
  };

  const handleSubmit = async () => {
    if (!form.keyName.trim()) return;

    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    resetForm();
  };

  const handleEdit = (s: SystemSetting) => {
    setEditing(s);
    setForm({
      keyName: s.keyName,
      value: s.value,
      description: s.description ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this setting?")) return;
    await deleteMutation.mutateAsync(id);
  };

  /* ---------------- Render ---------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 font-medium">Failed to load system settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl">
              <Settings className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Manage system-wide configuration and parameters
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-sm">Total Settings</span>
            <p className="text-2xl font-bold text-white mt-1">{settings.length}</p>
          </div>
          <Settings className="w-8 h-8 text-emerald-400/50" />
        </div>
      </div>

      {/* Form */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            {editing ? <Edit2 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
          </div>
          <h2 className="text-xl font-bold text-white">
            {editing ? "Edit Setting" : "Create New Setting"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Key Name {editing && <span className="text-gray-500 text-xs">(cannot be changed)</span>}
            </label>
            <input
              className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              placeholder="e.g., MAX_UPLOAD_SIZE"
              value={form.keyName}
              onChange={(e) => setForm({ ...form, keyName: e.target.value })}
              disabled={!!editing}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Value
            </label>
            <input
              className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
              placeholder="Enter value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
              placeholder="Describe what this setting does..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !form.keyName.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editing ? "Update Setting" : "Create Setting"}
                </>
              )}
            </button>

            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Table */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Key
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {settings.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <code className="text-emerald-400 font-mono text-sm font-medium">
                        {s.keyName}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{s.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{s.description || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all group/btn"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {settings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No system settings found</p>
                    <p className="text-gray-500 text-sm mt-2">Create your first setting to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
