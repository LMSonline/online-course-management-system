"use client";

import { X, Percent, Calendar, Hash, Tag, CheckCircle, XCircle } from "lucide-react";
import { useRevenueShareConfigDetail } from "@/hooks/admin/useRevenueShare";

type Props = {
  configId: number;
  onClose: () => void;
};

export function RevenueShareDetailModal({ configId, onClose }: Props) {
  const { data, isLoading, isError } = useRevenueShareConfigDetail(configId);

  /* =======================
   * Loading / Error
   * ======================= */
  if (isLoading) {
    return (
      <Overlay onClose={onClose}>
        <div className="bg-[#1a2332] border border-gray-700 p-10 rounded-2xl text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-gray-300 text-lg">Loading config details...</span>
          </div>
        </div>
      </Overlay>
    );
  }

  if (isError || !data) {
    return (
      <Overlay onClose={onClose}>
        <div className="bg-[#1a2332] border border-rose-500/30 p-10 rounded-2xl">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-5">
              <X className="w-10 h-10 text-rose-400" />
            </div>
            <p className="text-rose-400 font-semibold text-lg">
              Failed to load config details
            </p>
          </div>
        </div>
      </Overlay>
    );
  }

  /* =======================
   * Render
   * ======================= */
  return (
    <Overlay onClose={onClose}>
      <div className="w-full max-w-3xl bg-[#1a2332] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-700 flex items-center justify-between bg-[#141d2b]">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Revenue Share Config Details
            </h2>
            <p className="text-gray-400 text-sm">Configuration #{data.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status & Category */}
          <div className="mb-8 flex items-center justify-between">
            {/* Category */}
            <div>
              <p className="text-gray-400 text-sm mb-3 font-medium">Category</p>
              <div className="text-white font-semibold text-lg">
                {data.categoryId ? (
                  <span>Category #{data.categoryId}</span>
                ) : (
                  <span className="text-emerald-400">Default Configuration</span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-3 font-medium">Status</p>
              <div>
                {data.isActive ? (
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold text-base">Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-gray-500/10 text-gray-400 border-gray-500/30">
                    <XCircle className="w-4 h-4" />
                    <span className="font-bold text-base">Inactive</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Revenue Split */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Revenue Split
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Percent className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Teacher Share</p>
                    <p className="text-4xl font-bold text-emerald-400">
                      {data.teacherPercentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <Percent className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Platform Share</p>
                    <p className="text-4xl font-bold text-cyan-400">
                      {data.platformPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Effective Period */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Effective Period
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <InfoRow
                icon={<Calendar className="w-5 h-5 text-purple-400" />}
                label="Effective From"
                value={new Date(data.effectiveFrom).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5 text-purple-400" />}
                label="Effective To"
                value={
                  data.effectiveTo
                    ? new Date(data.effectiveTo).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No end date"
                }
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Metadata */}
          <div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Metadata
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <InfoRow
                icon={<Calendar className="w-5 h-5 text-blue-400" />}
                label="Created At"
                value={new Date(data.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5 text-blue-400" />}
                label="Updated At"
                value={new Date(data.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-700 bg-[#141d2b] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* =======================
 * Reusable UI parts
 * ======================= */

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: any;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-white font-semibold text-base break-words leading-relaxed">
          {value ?? "-"}
        </p>
      </div>
    </div>
  );
}
