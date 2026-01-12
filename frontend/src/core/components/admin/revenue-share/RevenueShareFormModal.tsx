"use client";

import { useState } from "react";
import { X, Save, Percent } from "lucide-react";
import {
  useCreateRevenueShareConfig,
  useUpdateRevenueShareConfig,
} from "@/hooks/admin/useRevenueShare";
import type { RevenueShareConfigResponse } from "@/lib/admin/revenue-share.types";

type Props = {
  config?: RevenueShareConfigResponse;
  onClose: () => void;
};

export function RevenueShareFormModal({ config, onClose }: Props) {
  const isEdit = !!config;

  const [formData, setFormData] = useState({
    categoryId: config?.categoryId?.toString() || "",
    teacherPercentage: config?.teacherPercentage || 70,
    platformPercentage: config?.platformPercentage || 30,
    effectiveFrom: config?.effectiveFrom
      ? new Date(config.effectiveFrom).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    effectiveTo: config?.effectiveTo
      ? new Date(config.effectiveTo).toISOString().split("T")[0]
      : "",
  });

  const createMutation = useCreateRevenueShareConfig();
  const updateMutation = useUpdateRevenueShareConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      teacherPercentage: formData.teacherPercentage,
      platformPercentage: formData.platformPercentage,
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || null,
    };

    if (isEdit && config) {
      await updateMutation.mutateAsync({
        id: config.id,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onClose();
  };

  const handlePercentageChange = (field: "teacher" | "platform", value: number) => {
    if (field === "teacher") {
      setFormData({
        ...formData,
        teacherPercentage: value,
        platformPercentage: 100 - value,
      });
    } else {
      setFormData({
        ...formData,
        platformPercentage: value,
        teacherPercentage: 100 - value,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#1a2332] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-700 flex items-center justify-between bg-[#141d2b]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg">
              <Percent className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEdit ? "Edit" : "Create"} Revenue Share Config
              </h2>
              <p className="text-gray-400 text-sm">
                {isEdit ? "Update existing" : "Add new"} revenue sharing configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Category ID */}
            <div>
              <label className="text-gray-300 text-sm mb-2 block font-medium">
                Category ID <span className="text-gray-500">(Optional - leave empty for default)</span>
              </label>
              <input
                type="number"
                className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                placeholder="Leave empty for default config"
              />
            </div>

            {/* Percentages */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block font-medium">
                  Teacher Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                    value={formData.teacherPercentage}
                    onChange={(e) =>
                      handlePercentageChange("teacher", Number(e.target.value))
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block font-medium">
                  Platform Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                    value={formData.platformPercentage}
                    onChange={(e) =>
                      handlePercentageChange("platform", Number(e.target.value))
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Total Check */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-sm font-medium">Total</span>
                <span
                  className={`text-lg font-bold ${
                    formData.teacherPercentage + formData.platformPercentage === 100
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {formData.teacherPercentage + formData.platformPercentage}%
                </span>
              </div>
              {formData.teacherPercentage + formData.platformPercentage !== 100 && (
                <p className="text-rose-400 text-xs mt-2">
                  ⚠ Total must equal 100%
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block font-medium">
                  Effective From <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                  value={formData.effectiveFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveFrom: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block font-medium">
                  Effective To <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                  value={formData.effectiveTo}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                formData.teacherPercentage + formData.platformPercentage !== 100 ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="px-6 py-3 bg-green-600 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
