type Props = {
  selectedTab: 'all' | 'draft' | 'pending' | 'published';
  setSelectedTab: (tab: 'all' | 'draft' | 'pending' | 'published') => void;
  stats: { all: number; draft: number; pending: number; published: number };
};

export default function CourseTabs({ selectedTab, setSelectedTab, stats }: Props) {
  const tabs = [
    { key: 'all', label: 'All Courses' },
    { key: 'published', label: 'Published' },
    { key: 'pending', label: 'Pending Review' },
    { key: 'draft', label: 'Drafts' }
  ] as const;

  return (
    <div className="flex items-center gap-2 mb-6 border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setSelectedTab(tab.key)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            selectedTab === tab.key
              ? 'border-[#00ff00] text-[#00ff00]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
          <span className="ml-2 px-2 py-0.5 bg-[#1a2237] rounded-full text-xs">
            {stats[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
}
