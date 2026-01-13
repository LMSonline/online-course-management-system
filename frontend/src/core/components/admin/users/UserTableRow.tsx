import { Lock, Unlock, CheckCircle, XCircle, UserX, Eye } from "lucide-react";
import { AccountResponse } from "@/services/account/account.types";

interface UserTableRowProps {
  user: AccountResponse;
  isProcessing: boolean;
  onLock: (userId: number) => void;
  onUnlock: (userId: number) => void;
  onApprove: (user: AccountResponse) => void;
  onReject: (user: AccountResponse) => void;
  onDeactivate: (user: AccountResponse) => void;
}

export function UserTableRow({
  user,
  isProcessing,
  onLock,
  onUnlock,
  onApprove,
  onReject,
  onDeactivate,
}: UserTableRowProps) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg">
            {user.username?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {user.username}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400">{user.email}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            user.role === "TEACHER"
              ? "bg-purple-500/15 text-purple-300 border-purple-500/50"
              : user.role === "ADMIN"
              ? "bg-rose-500/15 text-rose-300 border-rose-500/50"
              : "bg-blue-500/15 text-blue-300 border-blue-500/50"
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            user.status === "ACTIVE"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
              : user.status === "SUSPENDED"
              ? "bg-rose-500/15 text-rose-300 border-rose-500/50"
              : user.status === "PENDING_APPROVAL"
              ? "bg-amber-500/15 text-amber-300 border-amber-500/50"
              : "bg-slate-500/15 text-slate-300 border-slate-500/50"
          }`}
        >
          {user.status === "PENDING_APPROVAL" && (
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          )}
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Approve/Reject for pending teachers */}
          {user.status === "PENDING_APPROVAL" && user.role === "TEACHER" && (
            <>
              <button
                className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
                title="Approve Teacher"
                onClick={() => onApprove(user)}
              >
                <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
                title="Reject Teacher"
                onClick={() => onReject(user)}
              >
                <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Lock/Unlock for active/suspended */}
          {user.status === "ACTIVE" && (
            <>
              <button
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
                title="Suspend Account"
                disabled={isProcessing}
                onClick={() => onLock(user.accountId)}
              >
                <Lock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
                title="Deactivate Account"
                onClick={() => onDeactivate(user)}
              >
                <UserX className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </>
          )}

          {user.status === "SUSPENDED" && (
            <button
              className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all disabled:opacity-50 group/btn"
              title="Unlock Account"
              disabled={isProcessing}
              onClick={() => onUnlock(user.accountId)}
            >
              <Unlock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          )}

          <button
            className="p-2 text-gray-400 hover:bg-slate-700/50 rounded-lg transition-all group/btn"
            title="View Details"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );
}
