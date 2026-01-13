"use client";

import { Percent, CheckCircle, XCircle, Layers } from "lucide-react";

type Props = {
  totalConfigs: number;
  activeConfigs: number;
  inactiveConfigs: number;
  categoryConfigs: number;
};

export function RevenueShareStats({ 
  totalConfigs, 
  activeConfigs, 
  inactiveConfigs,
  categoryConfigs 
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Configurations */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Configurations</p>
            <p className="text-3xl font-bold text-white">{totalConfigs}</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Percent className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Active Configurations */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-400">{activeConfigs}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Inactive Configurations */}
      <div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Inactive</p>
            <p className="text-3xl font-bold text-gray-400">{inactiveConfigs}</p>
          </div>
          <div className="p-3 bg-gray-500/10 rounded-lg">
            <XCircle className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Category Specific */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Category Specific</p>
            <p className="text-3xl font-bold text-cyan-400">{categoryConfigs}</p>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
