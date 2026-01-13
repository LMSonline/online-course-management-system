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

  //   Calculate teacher % from backend's platform percentage
  const platformPercentage = config?.percentage ?? 30;
  const teacherPercentage = 100 - platformPercentage;

  const [formData, setFormData] = useState({
    categoryId: config?.categoryId?.toString() || "",
    teacherPercentage: teacherPercentage,
    platformPercentage: platformPercentage,
    minimumPayoutAmount: config?.minimumPayoutAmount?.toString() || "",
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

    //  Map frontend fields → backend DTO
    // Backend expects: { percentage, effectiveFrom, effectiveTo, categoryId, description?, versionNote? }
    // "percentage" = platform percentage (backend will calculate teacher % = 100 - platform %)
    const payload = {
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      percentage: formData.platformPercentage, //  Map platformPercentage → percentage
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || null,
      description: formData.categoryId
        ? `Category ${formData.categoryId} revenue share`
        : "Default revenue share configuration",
      versionNote: isEdit ? "Updated configuration" : "Initial configuration",
      minimumPayoutAmount: formData.minimumPayoutAmount
        ? Number(formData.minimumPayoutAmount)
        : null, // ✅ Add minimum payout
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
        className="w-full max-w-xl bg-[#1a2332] border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-[#141d2b] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Percent className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? "Edit" : "Create"} Revenue Share Config
              </h2>
              <p className="text-gray-400 text-xs">
                {isEdit ? "Update existing" : "Add new"} configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Category ID */}
            <div>
              <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                Category ID <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                placeholder="Leave empty for default"
              />
            </div>

            {/* Percentages */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                  Teacher %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                    value={formData.teacherPercentage}
                    onChange={(e) =>
                      handlePercentageChange("teacher", Number(e.target.value))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                  Platform %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                    value={formData.platformPercentage}
                    onChange={(e) =>
                      handlePercentageChange("platform", Number(e.target.value))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Total Check */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-xs font-medium">Total</span>
                <span
                  className={`text-base font-bold ${
                    formData.teacherPercentage + formData.platformPercentage === 100
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {formData.teacherPercentage + formData.platformPercentage}%
                </span>
              </div>
              {formData.teacherPercentage + formData.platformPercentage !== 100 && (
                <p className="text-rose-400 text-xs mt-1.5">
                  ⚠ Total must equal 100%
                </p>
              )}
            </div>

            {/* Minimum Payout Amount */}
            <div>
              <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                Minimum Payout <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 pr-14"
                  value={formData.minimumPayoutAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumPayoutAmount: e.target.value })
                  }
                  placeholder="500000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                  VND
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                  From <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                  value={formData.effectiveFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveFrom: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                  To <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                  value={formData.effectiveTo}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-700 bg-[#141d2b] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-semibold transition-all"
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
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}