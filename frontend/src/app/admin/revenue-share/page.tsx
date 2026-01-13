"use client";

import { useState, useMemo } from "react";
import { Percent, Plus, X } from "lucide-react";
import {
  useRevenueShareConfigs,
  useDeleteRevenueShareConfig,
  useDeactivateRevenueShareConfig,
} from "@/hooks/admin/useRevenueShare";
import type { RevenueShareConfigResponse } from "@/lib/admin/revenue-share.types";
import { RevenueShareStats } from "@/core/components/admin/revenue-share/RevenueShareStats";
import { RevenueShareFilters } from "@/core/components/admin/revenue-share/RevenueShareFilters";
import { RevenueShareTable } from "@/core/components/admin/revenue-share/RevenueShareTable";
import { RevenueShareFormModal } from "@/core/components/admin/revenue-share/RevenueShareFormModal";
import { RevenueShareDetailModal } from "@/core/components/admin/revenue-share/RevenueShareDetailModal";

export default function AdminRevenueSharePage() {
  /* =====================
   * Filters & paging
   * ===================== */
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(0);

  const pageSize = 10;

  const { data, isLoading, isError } = useRevenueShareConfigs({
    isActive,
    categoryId: categoryId ? Number(categoryId) : undefined,
    page,
    size: pageSize,
  });

  // Get ALL configs for stats (without filters)
  const { data: allConfigsData } = useRevenueShareConfigs({
    page: 0,
    size: 1000, // Large number to get all
  });

  const deleteMutation = useDeleteRevenueShareConfig();
  const deactivateMutation = useDeactivateRevenueShareConfig();

  /* =====================
   * Calculate Stats
   * ===================== */
  const stats = useMemo(() => {
    const allConfigs = allConfigsData?.content ?? [];
    const total = allConfigs.length;
    const active = allConfigs.filter((c) => c.isActive).length;
    const inactive = allConfigs.filter((c) => !c.isActive).length;
    const categorySpecific = allConfigs.filter((c) => c.categoryId !== null && c.categoryId !== undefined).length;

    return {
      total,
      active,
      inactive,
      categorySpecific,
    };
  }, [allConfigsData]);

  /* =====================
   * Modals
   * ===================== */
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RevenueShareConfigResponse | null>(null);

  /* =====================
   * Handlers
   * ===================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this revenue share config?")) {
      return;
    }
    await deleteMutation.mutateAsync(id);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this revenue share config?")) {
      return;
    }
    await deactivateMutation.mutateAsync(id);
  };

  const handleEdit = (config: RevenueShareConfigResponse) => {
    setEditingConfig(config);
  };

  // Reset to page 0 when filters change
  const handleIsActiveChange = (newIsActive: boolean | undefined) => {
    setIsActive(newIsActive);
    setPage(0);
  };

  const handleCategoryIdChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setPage(0);
  };

  /* =====================
   * Render states
   * ===================== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading revenue share configs...</p>
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
          <p className="text-rose-400 font-medium">
            Failed to load revenue share configs
          </p>
        </div>
      </div>
    );
  }

  const configs: RevenueShareConfigResponse[] = data?.content ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl">
              <Percent className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Revenue Share Management
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Configure revenue sharing between teachers and platform
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Config
        </button>
      </div>

      {/* Stats Overview */}
      <RevenueShareStats 
        totalConfigs={stats.total}
        activeConfigs={stats.active}
        inactiveConfigs={stats.inactive}
        categoryConfigs={stats.categorySpecific}
      />

      {/* Filters */}
      <RevenueShareFilters
        isActive={isActive}
        categoryId={categoryId}
        onIsActiveChange={handleIsActiveChange}
        onCategoryIdChange={handleCategoryIdChange}
      />

      {/* Results Summary */}
      {(isActive !== undefined || categoryId) && (
        <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Found <span className="font-semibold text-white">{data?.totalItems ?? 0}</span>{" "}
            {(data?.totalItems ?? 0) === 1 ? "configuration" : "configurations"}
            {isActive !== undefined && (
              <span>
                {" "}
                with status{" "}
                <span className="text-emerald-400">{isActive ? "Active" : "Inactive"}</span>
              </span>
            )}
            {categoryId && (
              <span>
                {" "}
                for category{" "}
                <span className="text-cyan-400">#{categoryId}</span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Table */}
      <RevenueShareTable
        configs={configs}
        currentPage={data?.page ?? 0}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.totalItems ?? 0}
        hasNext={data?.hasNext ?? false}
        hasPrevious={data?.hasPrevious ?? false}
        onPageChange={setPage}
        onView={setSelectedConfigId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeactivate={handleDeactivate}
        isDeleting={deleteMutation.isPending}
        isDeactivating={deactivateMutation.isPending}
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <RevenueShareFormModal
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {editingConfig && (
        <RevenueShareFormModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
        />
      )}

      {/* Detail Modal */}
      {selectedConfigId && (
        <RevenueShareDetailModal
          configId={selectedConfigId}
          onClose={() => setSelectedConfigId(null)}
        />
      )}
    </div>
  );
}