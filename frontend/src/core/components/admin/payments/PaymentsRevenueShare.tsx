import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function PaymentsRevenueShare({ stats }: any) {
  const [platformFee, setPlatformFee] = useState(20);
  const instructorShare = 100 - platformFee;

  return (
    <div className="space-y-6">
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Revenue Share Configuration        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Platform Fee Percentage
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min="0"
                max="50"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00ff00]"
              />
              <div className="w-20 px-3 py-2 bg-[#1a2237] border border-gray-700 rounded-lg text-center">
                <span className="text-white font-semibold">{platformFee}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Instructors will receive {instructorShare}% of the course revenue
            </p>
          </div>

          <div className="p-4 bg-blue-900/10 border border-blue-700 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium mb-1">
                  Important Note
                </p>
                <p className="text-xs text-gray-400">
                  Changes to the revenue share only apply to new transactions.
                  Existing agreements will not be affected.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="px-4 py-2 bg-[#1a2237] border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}