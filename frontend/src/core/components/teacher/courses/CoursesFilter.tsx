import { Search } from "lucide-react";

interface CoursesFilterProps {
    selectedTab: 'all' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
    onTabChange: (tab: 'all' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    stats: {
        all: number;
        draft?: number;
        pending?: number;
        approved?: number;
        rejected?: number;
        published?: number;
        archived?: number;
    };
}

export const CoursesFilter = ({
    selectedTab,
    onTabChange,
    searchQuery,
    onSearchChange,
    stats
}: CoursesFilterProps) => {
    const tabs = [
        { id: 'all' as const, label: 'All Courses', count: stats.all },
        { id: 'PUBLISHED' as const, label: 'Published', count: stats.published || 0 },
        { id: 'PENDING' as const, label: 'Pending', count: stats.pending || 0 },
        { id: 'DRAFT' as const, label: 'Draft', count: stats.draft || 0 },
        { id: 'REJECTED' as const, label: 'Rejected', count: stats.rejected || 0 },
        { id: 'ARCHIVED' as const, label: 'Archived', count: stats.archived || 0 },
    ];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${selectedTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        <span>{tab.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
