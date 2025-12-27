import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Generic error state component with retry button
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
        {message || "An error occurred while loading data. Please try again."}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

