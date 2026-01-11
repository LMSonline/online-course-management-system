interface UserTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    totalUsers: number;
    learners: number;
    instructors: number;
    suspended: number;
    pending: number;
  };
}

export function UserTabs({ selectedTab, onTabChange, stats }: UserTabsProps) {
  const tabs = [
    { id: 'all', label: 'All Users', count: stats.totalUsers },
    { id: 'learners', label: 'Learners', count: stats.learners },
    { id: 'instructors', label: 'Instructors', count: stats.instructors },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'suspended', label: 'Suspended', count: stats.suspended },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-semibold transition-all whitespace-nowrap ${
            selectedTab === tab.id
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
