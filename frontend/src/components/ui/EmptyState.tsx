import { Inbox, Search } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const defaultIcon = icon || <Inbox className="w-12 h-12 text-slate-500" />;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{defaultIcon}</div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 mb-4 max-w-md">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptySearchState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12 text-slate-500" />}
      title="No results found"
      message={`No courses found matching "${query}". Try adjusting your search terms.`}
    />
  );
}

