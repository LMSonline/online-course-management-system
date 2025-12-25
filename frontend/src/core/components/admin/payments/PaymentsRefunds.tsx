import Button from "../../ui/Button";
import { Card, CardContent, CardHeader } from "../../ui/Card"
import { RotateCcw, User } from "lucide-react";

export function PaymentsRefunds({ refundRequests }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Refund Requests</h3>
        <div className="space-y-4">
          {refundRequests.map((refund: any) => (
            <div
              key={refund.id}
              className="p-4 bg-[#1a2237] border border-gray-700 rounded-lg hover:border-[#00ff00] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-cyan-400">{refund.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        refund.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : refund.status === "approved"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {refund.status}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-1">
                    {refund.user} - {refund.course}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">Reason: {refund.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Amount: ${refund.amount}</span>
                    <span>•</span>
                    <span>Requested: {refund.requestDate}</span>
                  </div>
                </div>
                {refund.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-green-900/20 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}