import { AdminStatsRow } from "@/core/components/admin/dashboard/AdminStatsRow";
import { AdminDashboardCharts } from "@/core/components/admin/dashboard/AdminDashboardCharts";
import { CheckCircle, XCircle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AdminView } from "@/app/admin/dashboard/page";

type Props = {
  stats: any;
  monthly: any[];
  pendingCourses: any[];
  recentTransactions: any[];
  setCurrentView: Dispatch<SetStateAction<AdminView>>;
};

export function AdminDashboardMain({
  stats,
  monthly,
  pendingCourses,
  recentTransactions,
  setCurrentView,
}: Props) {
  return (
    <div>
      <AdminStatsRow overview={stats} />
      <div className="mt-4">
        <AdminDashboardCharts monthly={monthly} />
      </div>
      {/* Recent Activity Tables */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Pending Course Approvals */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Pending Course Approvals
            </h3>
            <button
              onClick={() => setCurrentView("courses")}
              className="text-sm text-[#00ff00] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-[#1a2237] border border-gray-700 rounded-lg hover:border-[#00ff00] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {course.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        Submitted {course.submittedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-green-900/20 border border-green-700 text-green-400 rounded hover:bg-green-900/30 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/30 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Transactions */}
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Transactions
            </h3>
            <button
              onClick={() => setCurrentView("payments")}
              className="text-sm text-[#00ff00] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 bg-[#1a2237] border border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">
                      {transaction.user}
                    </p>
                    <p className="text-xs text-gray-400">
                      {transaction.course}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    ${transaction.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {transaction.date}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      transaction.status === "completed"
                        ? "bg-green-900/30 text-green-400"
                        : transaction.status === "pending"
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
