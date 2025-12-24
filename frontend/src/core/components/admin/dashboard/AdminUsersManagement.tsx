import { useEffect, useState } from "react";
import { Users, Lock, Unlock, MoreVertical } from "lucide-react";
import { suspendAccount, unlockAccount } from "@/services/auth/auth.services";

type Props = {
  recentUsers?: any[]; // Optional, will be replaced by API data
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  stats?: any;
};

export function AdminUsersMain({ selectedTab, setSelectedTab, stats }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users from API on mount
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/admin/accounts", { method: "GET" }).then(r => r.json());
        const content = res?.data?.content || res?.content || [];
        setUsers(content);
      } catch (e) {
        setUsers([]);
        setError("Không thể tải danh sách người dùng.");
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const defaultStats = {
    totalUsers: users.length,
    learners: users.filter(u => u.role === "Learner").length,
    instructors: users.filter(u => u.role === "Instructor").length,
    suspended: users.filter(u => u.status === "suspended").length,
  };
  const _stats = stats || defaultStats;

  // Lọc user theo tab
  const filteredUsers = users.filter(user => {
    if (selectedTab === "all") return true;
    if (selectedTab === "learners") return user.role === "Learner";
    if (selectedTab === "instructors") return user.role === "Instructor";
    if (selectedTab === "suspended") return user.status === "suspended";
    return true;
  });

  // Xử lý khóa/mở khóa tài khoản
  const handleLock = async (userId: number) => {
    setLoadingUserId(userId);
    try {
      await suspendAccount(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: "suspended" } : u))
      );
    } catch (e) {
      alert("Failed to lock account");
    }
    setLoadingUserId(null);
  };

  const handleUnlock = async (userId: number) => {
    setLoadingUserId(userId);
    try {
      await unlockAccount(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: "active" } : u))
      );
    } catch (e) {
      alert("Failed to unlock account");
    }
    setLoadingUserId(null);
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

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-800">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === 'all' 
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Users ({_stats.totalUsers})
        </button>
        <button
          onClick={() => setSelectedTab('learners')}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === 'learners' 
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Learners ({_stats.learners})
        </button>
        <button
          onClick={() => setSelectedTab('instructors')}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === 'instructors' 
              ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Instructors ({_stats.instructors})
        </button>
        <button
          onClick={() => setSelectedTab('suspended')}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === 'suspended' 
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
          <div className="p-8 text-center text-red-400">{error}</div>
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[#1a2237] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0) || user.username?.charAt(0) || "?"}
                    </div>
                    <span className="font-medium text-white">{user.name || user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Instructor' || user.role === 'INSTRUCTOR'
                      ? 'bg-purple-900/30 text-purple-400'
                      : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' || user.status === 'ACTIVE'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{user.joinedDate || user.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {(user.status === 'active' || user.status === 'ACTIVE') ? (
                      <button
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                        title="Suspend"
                        disabled={loadingUserId === user.id}
                        onClick={() => handleLock(user.id)}
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        className="p-2 text-green-400 hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
                        title="Activate"
                        disabled={loadingUserId === user.id}
                        onClick={() => handleUnlock(user.id)}
                      >
                        <Unlock className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:bg-gray-800 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
