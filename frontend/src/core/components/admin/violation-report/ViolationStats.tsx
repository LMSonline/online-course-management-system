"use client";

import { ShieldAlert, Clock, CheckCircle, XCircle } from "lucide-react";

interface ViolationStatsProps {
  total: number;
  pending: number;
  inReview: number;
  actionTaken: number;
  dismissed: number;
}

export function ViolationStats({
  total,
  pending,
  inReview,
  actionTaken,
  dismissed,
}: ViolationStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-400">{pending}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* In Review */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">In Review</p>
            <p className="text-3xl font-bold text-blue-400">{inReview}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Action Taken */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Action Taken</p>
            <p className="text-3xl font-bold text-emerald-400">{actionTaken}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Dismissed */}
      <div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Dismissed</p>
            <p className="text-3xl font-bold text-gray-400">{dismissed}</p>
          </div>
          <div className="p-3 bg-gray-500/10 rounded-lg">
            <XCircle className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
