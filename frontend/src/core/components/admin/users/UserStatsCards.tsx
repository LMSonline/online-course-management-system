import { Users } from "lucide-react";

interface UserStatsCardsProps {
  stats: {
    totalUsers: number;
    learners: number;
    instructors: number;
    suspended: number;
    pending: number;
  };
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Total Users</span>
          <Users className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Learners</span>
          <div className="w-2 h-2 rounded-full bg-blue-400" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.learners}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Instructors</span>
          <div className="w-2 h-2 rounded-full bg-purple-400" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.instructors}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Pending</span>
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.pending}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-rose-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Suspended</span>
          <div className="w-2 h-2 rounded-full bg-rose-400" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.suspended}</p>
      </div>
    </div>
  );
}
