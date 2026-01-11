import { Search } from "lucide-react";

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function UserSearchBar({ searchQuery, onSearchChange }: UserSearchBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by username, email, or name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:shadow-lg focus:shadow-emerald-500/10 transition-all"
        />
      </div>
    </div>
  );
}
