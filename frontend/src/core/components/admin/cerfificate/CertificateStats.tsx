"use client";

import { Award, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface CertificateStatsProps {
  total: number;
  active: number;
  revoked: number;
}

export function CertificateStats({ total, active, revoked }: CertificateStatsProps) {
  const successRate = total > 0 ? ((active / total) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Certificates */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Certificates</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Award className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Active */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-400">{active}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Revoked */}
      <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Revoked</p>
            <p className="text-3xl font-bold text-rose-400">{revoked}</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-lg">
            <XCircle className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-cyan-400">{successRate}%</p>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
