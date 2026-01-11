import { useState, useMemo } from "react";
import { Users, Lock, Unlock, MoreVertical, Search } from "lucide-react";
import {
  useGetAllAccounts,
  useSuspendAccount,
  useUnlockAccount,
} from "@/hooks/useAdminAccounts";
import { AccountResponse } from "@/services/account/account.types";

type Props = {
  recentUsers?: any[]; // Optional, will be replaced by API data
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  stats?: any;
};

export function AdminUsersMain({ selectedTab, setSelectedTab, stats }: Props) {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Build filter params based on selected tab
  const filterParams = useMemo(() => {
    const params: any = { page, size: 50, searchQuery };

    if (selectedTab === "learners") {
      params.role = "STUDENT";
    } else if (selectedTab === "instructors") {
      params.role = "TEACHER";
    } else if (selectedTab === "suspended") {
      params.status = "SUSPENDED";
    }

    return params;
  }, [selectedTab, page, searchQuery]);

  // Fetch users using the hook
  const { data, isLoading, error } = useGetAllAccounts(filterParams);
  const suspendMutation = useSuspendAccount();
  const unlockMutation = useUnlockAccount();

  const users = data?.items || [];
  const loading = isLoading;

  // Calculate stats from fetched data or use provided stats
  const defaultStats = {
    totalUsers: data?.totalItems || 0,
    learners: users.filter((u: AccountResponse) => u.role === "STUDENT").length,
    instructors: users.filter((u: AccountResponse) => u.role === "TEACHER").length,
    suspended: users.filter((u: AccountResponse) => u.status === "SUSPENDED").length,
  };
  const _stats = stats || defaultStats;

  // Filter users by tab (client-side filtering as backup)
  const filteredUsers = users.filter((user: AccountResponse) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "learners") return user.role === "STUDENT";
    if (selectedTab === "instructors") return user.role === "TEACHER";
    if (selectedTab === "suspended") return user.status === "SUSPENDED";
    return true;
  });

  // Handle lock/unlock account
  const handleLock = async (userId: number) => {
    suspendMutation.mutate({ id: userId });
  };

  const handleUnlock = async (userId: number) => {
    unlockMutation.mutate({ id: userId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage learners and instructors, lock/unlock accounts</p>
        </div>
        <button className="px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors flex items-center gap-2">
          <Users className="w-5 h-5" />
          Export Users
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username, email, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12182b] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-800">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'all'
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          All Users ({_stats.totalUsers})
        </button>
        <button
          onClick={() => setSelectedTab('learners')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'learners'
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Learners ({_stats.learners})
        </button>
        <button
          onClick={() => setSelectedTab('instructors')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'instructors'
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Instructors ({_stats.instructors})
        </button>
        <button
          onClick={() => setSelectedTab('suspended')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'suspended'
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Suspended ({_stats.suspended})
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error.message || "Failed to load users"}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#1a2237] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user: AccountResponse) => {
                const isLocking = suspendMutation.isPending && suspendMutation.variables?.id === user.accountId;
                const isUnlocking = unlockMutation.isPending && unlockMutation.variables?.id === user.accountId;
                const isProcessing = isLocking || isUnlocking;

                return (
                  <tr key={user.accountId} className="hover:bg-[#1a2237] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'TEACHER'
                          ? 'bg-purple-900/30 text-purple-400'
                          : user.role === 'ADMIN'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-blue-900/30 text-blue-400'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                          ? 'bg-green-900/30 text-green-400'
                          : user.status === 'SUSPENDED'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'ACTIVE' ? (
                          <button
                            className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                            title="Suspend"
                            disabled={isProcessing}
                            onClick={() => handleLock(user.accountId)}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : user.status === 'SUSPENDED' ? (
                          <button
                            className="p-2 text-green-400 hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
                            title="Activate"
                            disabled={isProcessing}
                            onClick={() => handleUnlock(user.accountId)}
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
