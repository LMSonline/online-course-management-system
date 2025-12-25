import { Award, CheckCircle, XCircle, Search, TrendingUp } from "lucide-react";
import React from "react";

export function CertificateStatsTab({
  stats,
  monthlyIssuance,
  topCourses
}: {
  stats: any;
  monthlyIssuance: any[];
  topCourses: any[];
}) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-[#00ff00] transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-[#00ff00]" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+14.7%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Issued</p>
            <p className="text-3xl font-bold text-white mb-1">{stats.totalIssued.toLocaleString()}</p>
            <p className="text-xs text-gray-500">All time certificates</p>
          </div>
        </div>

        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-green-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Valid Certificates</p>
            <p className="text-3xl font-bold text-white mb-1">{stats.validCertificates.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              {((stats.validCertificates / stats.totalIssued) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>

        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Revoked</p>
            <p className="text-3xl font-bold text-white mb-1">{stats.revokedCertificates.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              {((stats.revokedCertificates / stats.totalIssued) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>

        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Verification Requests</p>
            <p className="text-3xl font-bold text-white mb-1">{stats.verificationRequests.toLocaleString()}</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Issuance */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Monthly Certificate Issuance</h3>
              <p className="text-sm text-gray-400">Certificates issued per month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#00ff00]" />
          </div>

          <div className="relative h-64 flex items-end justify-between gap-3">
            {monthlyIssuance.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-[#00ff00] to-cyan-400 rounded-t hover:from-[#00dd00] hover:to-cyan-300 transition-colors cursor-pointer"
                    style={{ height: `${(data.count / 1200) * 250}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-white">{data.count}</p>
                      <p className="text-xs text-gray-400">certificates</p>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Top Courses by Certificates</h3>
              <p className="text-sm text-gray-400">Most certificates issued</p>
            </div>
            <Award className="w-5 h-5 text-[#00ff00]" />
          </div>

          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{course.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">{course.percentage}%</span>
                    <span className="text-[#00ff00] font-semibold text-sm">{course.certificates}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#00ff00] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.percentage * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Certificate Status Distribution</h3>
        <div className="flex items-center gap-8">
          {/* Pie chart area */}
          <div className="flex-1">
            <div className="relative w-64 h-64 mx-auto">
              <svg width="256" height="256" viewBox="0 0 256 256">
                {/* Valid (96%) */}
                <circle
                  cx="128"
                  cy="128"
                  r="90"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="40"
                  strokeDasharray="565"
                  strokeDashoffset="22.6"
                  transform="rotate(-90 128 128)"
                />
                {/* Revoked (3.4%) */}
                <circle
                  cx="128"
                  cy="128"
                  r="90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="40"
                  strokeDasharray="565"
                  strokeDashoffset="545.79"
                  transform="rotate(-90 128 128)"
                />
                {/* Expired (0.6%) */}
                <circle
                  cx="128"
                  cy="128"
                  r="90"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="40"
                  strokeDasharray="565"
                  strokeDashoffset="561.61"
                  transform="rotate(-90 128 128)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-3xl font-bold text-white">{stats.totalIssued}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a2237] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Valid</p>
                  <p className="text-xs text-gray-400">Active and verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{stats.validCertificates.toLocaleString()}</p>
                <p className="text-xs text-gray-400">96.1%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2237] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Revoked</p>
                  <p className="text-xs text-gray-400">Invalidated certificates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{stats.revokedCertificates.toLocaleString()}</p>
                <p className="text-xs text-gray-400">3.4%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2237] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Expired</p>
                  <p className="text-xs text-gray-400">Past expiration date</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{stats.expiredCertificates.toLocaleString()}</p>
                <p className="text-xs text-gray-400">0.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}