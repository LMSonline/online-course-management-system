import { Users, XCircle } from "lucide-react";
import { AccountResponse } from "@/services/account/account.types";
import { UserTableRow } from "./UserTableRow";
import { AppError } from "@/lib/api/api.error";

interface UserTableProps {
  users: AccountResponse[];
  loading: boolean;
  error: AppError | null;
  isProcessing: boolean;
  onLock: (userId: number) => void;
  onUnlock: (userId: number) => void;
  onApprove: (user: AccountResponse) => void;
  onReject: (user: AccountResponse) => void;
  onDeactivate: (user: AccountResponse) => void;
}

export function UserTable({
  users,
  loading,
  error,
  isProcessing,
  onLock,
  onUnlock,
  onApprove,
  onReject,
  onDeactivate,
}: UserTableProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 font-medium">
            {error.message || "Failed to load users"}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <UserTableRow
                  key={user.accountId}
                  user={user}
                  isProcessing={isProcessing}
                  onLock={onLock}
                  onUnlock={onUnlock}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDeactivate={onDeactivate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
