"use client";

import { useState, useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { ViolationStats } from "@/core/components/admin/violation-report/ViolationStats";
import { ViolationFilters } from "@/core/components/admin/violation-report/ViolationFilters";
import { ViolationReportList } from "@/core/components/admin/violation-report/ViolationReportList";
import { ViolationDetailPanel } from "@/core/components/admin/violation-report/ViolationDetailPanel";
import { ViolationPagination } from "@/core/components/admin/violation-report/ViolationPagination";
import { useAdminViolationReports } from "@/hooks/admin/useAdminViolationReports";
import type { ViolationReportStatus } from "@/lib/admin/violation-report.types";

const ITEMS_PER_PAGE = 10;

export default function AdminViolationReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ViolationReportStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    reports,
    selectedReport,
    loading,
    error,
    loadReportDetail,
    reviewReport,
    dismissReport,
    takeAction,
  } = useAdminViolationReports({ autoLoad: true });

  // Filter and search reports
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((report) => {
        const matchesId = report.id.toString().includes(query);
        const matchesReporter = report.reporter.username.toLowerCase().includes(query);
        const matchesTarget = report.target?.username.toLowerCase().includes(query);
        const matchesDescription = report.description.toLowerCase().includes(query);
        const matchesType = report.reportType.toLowerCase().includes(query);

        return matchesId || matchesReporter || matchesTarget || matchesDescription || matchesType;
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    return filtered;
  }, [reports, searchQuery, statusFilter]);

  // Calculate stats from ALL reports (not filtered)
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "PENDING").length;
    const inReview = reports.filter((r) => r.status === "IN_REVIEW").length;
    const actionTaken = reports.filter((r) => r.status === "ACTION_TAKEN").length;
    const dismissed = reports.filter((r) => r.status === "DISMISSED").length;

    return { total, pending, inReview, actionTaken, dismissed };
  }, [reports]);

  // Paginate filtered reports
  const paginatedReports = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleStatusChange = (status?: ViolationReportStatus) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectReport = async (id: number) => {
    setSelectedReportId(id);
    await loadReportDetail(id);
  };

  const handleReview = async (note: string) => {
    if (selectedReportId) {
      await reviewReport(selectedReportId, { note });
    }
  };

  const handleDismiss = async (reason: string) => {
    if (selectedReportId) {
      await dismissReport(selectedReportId, { reason });
    }
  };

  const handleTakeAction = async (action: string, note: string) => {
    if (selectedReportId) {
      await takeAction(selectedReportId, { action, note });
    }
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Violation Report Management
            </h1>
          </div>
          <p className="text-gray-400">
            Review and take action on user-reported violations
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <p className="text-rose-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <ViolationStats
        total={stats.total}
        pending={stats.pending}
        inReview={stats.inReview}
        actionTaken={stats.actionTaken}
        dismissed={stats.dismissed}
      />

      {/* Filters */}
      <ViolationFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Results Summary */}
      {(searchQuery || statusFilter) && (
        <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Found <span className="font-semibold text-white">{filteredReports.length}</span>{" "}
            {filteredReports.length === 1 ? "report" : "reports"}
            {searchQuery && (
              <span>
                {" "}
                matching "<span className="text-cyan-400">{searchQuery}</span>"
              </span>
            )}
            {statusFilter && (
              <span>
                {" "}
                with status{" "}
                <span className="text-blue-400">{statusFilter.replace(/_/g, " ")}</span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Main Content - List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report List - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          <ViolationReportList
            reports={paginatedReports}
            loading={loading}
            selectedId={selectedReportId}
            onSelect={handleSelectReport}
          />

          {/* Pagination */}
          {filteredReports.length > 0 && (
            <ViolationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredReports.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Report Details - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <ViolationDetailPanel
            report={selectedReport}
            loading={loading}
            onReview={handleReview}
            onDismiss={handleDismiss}
            onTakeAction={handleTakeAction}
          />
        </div>
      </div>
    </div>
  );
}