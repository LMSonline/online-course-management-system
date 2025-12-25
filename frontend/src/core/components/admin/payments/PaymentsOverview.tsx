"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  RefreshCw,
  Download,
} from "lucide-react";

type Stats = {
  totalRevenue: number;
  previousRevenue: number;
  pendingPayments: number;
  completedTransactions: number;
  averageTransaction: number;
  refundedAmount: number;
  instructorRevenue: number;
  platformRevenue: number;
};

type MonthlyRevenue = {
  month: string;
  revenue: number;
  transactions: number;
};

type RevenueCategory = {
  category: string;
  percentage: number;
  amount: number;
  color: string;
};

type TopInstructor = {
  name: string;
  courses: number;
  students: number;
  revenue: number;
};

type PaymentsOverviewProps = {
  stats: Stats;
  monthlyRevenue: MonthlyRevenue[];
  revenueByCategory: RevenueCategory[];
  topInstructors: TopInstructor[];
};

export function PaymentsOverview({
  stats,
  monthlyRevenue,
  revenueByCategory,
  topInstructors,
}: PaymentsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-[#00ff00] transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#00ff00]" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+23.8%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white mb-1">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              +${(stats.totalRevenue - stats.previousRevenue).toLocaleString()} vs
              last month
            </p>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-yellow-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-white mb-1">
              ${stats.pendingPayments.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Awaiting processing</p>
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Completed Transactions</p>
            <p className="text-3xl font-bold text-white mb-1">
              {stats.completedTransactions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Avg ${stats.averageTransaction} per transaction
            </p>
          </div>
        </div>

        {/* Refunded Amount */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex items-center gap-1 text-red-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-2.1%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Refunded Amount</p>
            <p className="text-3xl font-bold text-white mb-1">
              ${stats.refundedAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {(
                (stats.refundedAmount / stats.totalRevenue) *
                100
              ).toFixed(1)}
              % of total revenue
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Sharing */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Platform vs Instructor Revenue
            </h3>
            <button className="text-sm text-[#00ff00] hover:underline">
              Configure Split
            </button>
          </div>
          {/* Pie chart representation */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Simple donut chart */}
              <svg width="192" height="192" viewBox="0 0 192 192">
                {/* Platform share (20%) - Green */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="35"
                  strokeDasharray="440"
                  strokeDashoffset="352"
                  transform="rotate(-90 96 96)"
                />
                {/* Instructor share (80%) - Cyan */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="35"
                  strokeDasharray="440"
                  strokeDashoffset="88"
                  transform="rotate(-90 96 96)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-2xl font-bold text-white">80/20</p>
                <p className="text-xs text-gray-400">Split</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1a2237] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <span className="text-white font-medium">
                  Instructor Share (80%)
                </span>
              </div>
              <span className="text-white font-semibold">
                ${stats.instructorRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a2237] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#00ff00] rounded-full"></div>
                <span className="text-white font-medium">Platform Fee (20%)</span>
              </div>
              <span className="text-white font-semibold">
                ${stats.platformRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Monthly Revenue Trend
            </h3>
            <button className="text-sm text-[#00ff00] hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          {/* Bar Chart */}
          <div className="relative h-48 flex items-end justify-between gap-2">
            {monthlyRevenue.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-[#00ff00] to-cyan-400 rounded-t hover:from-[#00dd00] hover:to-cyan-300 transition-colors cursor-pointer"
                    style={{ height: `${(data.revenue / 250000) * 180}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-white">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-gray-400">
                        {data.transactions} transactions
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Revenue by Category
        </h3>
        <div className="space-y-4">
          {revenueByCategory.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{cat.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">
                    {cat.percentage}%
                  </span>
                  <span className="text-white font-semibold">
                    ${cat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Earning Instructors */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Top Earning Instructors
          </h3>
          <button className="text-sm text-[#00ff00] hover:underline">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Courses
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Students
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topInstructors.map((instructor, i) => (
                <tr key={i} className="hover:bg-[#1a2237] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {instructor.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{instructor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {instructor.courses}
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {instructor.students.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-[#00ff00] font-semibold">
                      ${instructor.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}