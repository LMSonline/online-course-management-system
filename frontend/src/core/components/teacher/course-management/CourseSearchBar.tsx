import { Search, Filter } from "lucide-react";

type Props = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export default function CourseSearchBar({ searchQuery, setSearchQuery }: Props) {
  return (
    <div className="flex items-center gap-4 mt-6 mb-8">
      <div className="flex-1 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#12182b] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-3 bg-[#12182b] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors">
        <Filter className="w-5 h-5" />
        Filters
      </button>
    </div>
  );
}
