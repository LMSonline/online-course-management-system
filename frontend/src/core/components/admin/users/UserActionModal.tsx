import { AccountResponse } from "@/services/account/account.types";

interface UserActionModalProps {
  isOpen: boolean;
  selectedUser: AccountResponse | null;
  actionType: "approve" | "reject" | "deactivate" | null;
  actionReason: string;
  isProcessing: boolean;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function UserActionModal({
  isOpen,
  selectedUser,
  actionType,
  actionReason,
  isProcessing,
  onReasonChange,
  onConfirm,
  onClose,
}: UserActionModalProps) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">
          {actionType === "approve" && "Approve Teacher Account"}
          {actionType === "reject" && "Reject Teacher Account"}
          {actionType === "deactivate" && "Deactivate Account"}
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">
            User: <span className="text-white font-medium">{selectedUser.username}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Email: <span className="text-white font-medium">{selectedUser.email}</span>
          </p>
        </div>

        {(actionType === "reject" || actionType === "deactivate") && (
          <div className="mb-4">
            <label className="text-gray-300 text-sm mb-2 block">
              Reason {actionType === "reject" ? "(Optional)" : "(Required)"}
            </label>
            <textarea
              value={actionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter reason..."
              className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 px-4 py-2.5 rounded-lg font-bold transition-all ${
              actionType === "approve"
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                : actionType === "reject"
                ? "bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300"
                : "bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300"
            } disabled:opacity-50`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
