import { AlertTriangle, Lock } from "lucide-react";

type Props = {
  violationReports: any[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

export function AdminCommunityMain({ violationReports }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Content Moderation
          </h2>
          <p className="text-gray-400">
            Review reports and manage content violations
          </p>
        </div>
      </div>

      {/* Violation Reports */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Violation Reports</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {violationReports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-[#1a2237] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-white">{report.type}</h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        report.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : report.status === "reviewing"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-green-900/30 text-green-400"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Target: {report.target}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Reason: {report.reason}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Reported by: {report.reporter}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#1a2237] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors">
                    Review
                  </button>
                  <button className="px-4 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
