"use client";

import { Search, Filter, X } from "lucide-react";
import type { ViolationReportStatus } from "@/lib/admin/violation-report.types";

interface ViolationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: ViolationReportStatus;
  onStatusChange: (status?: ViolationReportStatus) => void;
}

const STATUS_OPTIONS: { value: ViolationReportStatus | "ALL"; label: string; color: string }[] = [
  { value: "ALL", label: "All Status", color: "emerald" },
  { value: "PENDING", label: "Pending", color: "amber" },
  { value: "IN_REVIEW", label: "In Review", color: "blue" },
  { value: "ACTION_TAKEN", label: "Action Taken", color: "green" },
  { value: "DISMISSED", label: "Dismissed", color: "gray" },
];

export function ViolationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ViolationFiltersProps) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-5 space-y-4">
      {/* Search Bar */}
      <div>
        <label className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
          <Search className="w-4 h-4" />
          Search Reports
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, reporter, target, or description..."
            className="w-full bg-[#141d2b] border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to search or clear to show all
          </p>
        )}
      </div>

      {/* Status Filters */}
      <div>
        <label className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
          <Filter className="w-4 h-4" />
          Filter by Status
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive =
              (option.value === "ALL" && !statusFilter) ||
              statusFilter === option.value;

            return (
              <button
                key={option.value}
                onClick={() =>
                  onStatusChange(option.value === "ALL" ? undefined : option.value)
                }
                className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? getActiveButtonClass(option.color)
                    : "bg-[#141d2b] text-gray-400 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || statusFilter) && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
          <span className="text-xs text-gray-400">Active filters:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-xs">
                Search: "{searchQuery}"
                <button
                  onClick={handleClearSearch}
                  className="hover:bg-cyan-500/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-xs">
                Status: {statusFilter.replace(/_/g, " ")}
                <button
                  onClick={() => onStatusChange(undefined)}
                  className="hover:bg-blue-500/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getActiveButtonClass(color: string): string {
  switch (color) {
    case "emerald":
      return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400";
    case "amber":
      return "bg-amber-500 text-white shadow-lg shadow-amber-500/20 border border-amber-400";
    case "blue":
      return "bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-400";
    case "green":
      return "bg-green-500 text-white shadow-lg shadow-green-500/20 border border-green-400";
    case "gray":
      return "bg-gray-500 text-white shadow-lg shadow-gray-500/20 border border-gray-400";
    default:
      return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20";
  }
}
