"use client";

import { Filter, Tag } from "lucide-react";

type Props = {
  isActive: boolean | undefined;
  categoryId: string;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  onCategoryIdChange: (categoryId: string) => void;
};

export function RevenueShareFilters({
  isActive,
  categoryId,
  onIsActiveChange,
  onCategoryIdChange,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Filter className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Status</label>
          <select
            className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
            value={isActive === undefined ? "" : isActive.toString()}
            onChange={(e) =>
              onIsActiveChange(
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Category ID
          </label>
          <input
            className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
            value={categoryId}
            onChange={(e) => onCategoryIdChange(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
      </div>
    </div>
  );
}
