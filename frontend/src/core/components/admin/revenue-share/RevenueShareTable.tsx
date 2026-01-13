"use client";

import {
  Percent,
  Eye,
  Edit,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { RevenueShareConfigResponse } from "@/lib/admin/revenue-share.types";

type Props = {
  configs: RevenueShareConfigResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onView: (configId: number) => void;
  onEdit: (config: RevenueShareConfigResponse) => void;
  onDelete: (configId: number) => void;
  onDeactivate: (configId: number) => void;
  isDeleting: boolean;
  isDeactivating: boolean;
};

export function RevenueShareTable({
  configs,
  currentPage,
  totalPages,
  totalItems,
  hasNext,
  hasPrevious,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  isDeleting,
  isDeactivating,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Category
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                Teacher %
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                Platform %
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Effective Period
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {configs.map((config) => {
              // ✅ Calculate teacher percentage from platform percentage
              const platformPercentage = config.percentage;
              const teacherPercentage = 100 - platformPercentage;

              return (
                <tr
                  key={config.id}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => onView(config.id)}
                >
                  <td className="px-6 py-4">
                    <span className="text-white font-mono font-semibold">
                      #{config.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {config.categoryId ? (
                        <span>Category #{config.categoryId}</span>
                      ) : (
                        <span className="text-emerald-400">Default</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-emerald-400">
                      {teacherPercentage}%
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-cyan-400">
                      {platformPercentage}%
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div>
                          {new Date(config.effectiveFrom).toLocaleDateString()}
                        </div>
                        {config.effectiveTo && (
                          <div className="text-gray-600">
                            to {new Date(config.effectiveTo).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {config.isActive ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-500/20 text-gray-400 border-gray-500/30">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(config.id);
                        }}
                        className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(config);
                        }}
                        className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      {config.isActive && (
                        <button
                          disabled={isDeactivating}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeactivate(config.id);
                          }}
                          className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 disabled:opacity-50"
                        >
                          <Power className="w-4 h-4" />
                          Deactivate
                        </button>
                      )}

                      <button
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(config.id);
                        }}
                        className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {configs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Percent className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No configurations found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your filters or create a new config
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
        <span className="text-sm text-gray-400">
          Page {currentPage + 1} of {totalPages}
          <span className="text-gray-600 ml-2">({totalItems} total)</span>
        </span>

        <div className="flex gap-2">
          <button
            disabled={!hasPrevious}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <button
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}