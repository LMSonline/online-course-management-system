import { BookOpen, Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * Generic empty state component for public pages
 */
export function EmptyState({
  title = "No items found",
  description = "There are no items to display at the moment.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
        {icon || <BookOpen className="w-12 h-12 text-slate-400" />}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        {description}
      </p>
    </div>
  );
}

/**
 * Empty state for search results
 */
export function SearchEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      title="No courses found"
      description={
        query
          ? `No courses match your search "${query}". Try adjusting your search terms.`
          : "No courses found. Try a different search."
      }
      icon={<Search className="w-12 h-12 text-slate-400" />}
    />
  );
}

