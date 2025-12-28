"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useNotifications } from "@/hooks/notification/useNotifications";
import { useMarkNotificationRead } from "@/hooks/notification/useNotifications";
import { NotificationResponse } from "@/services/community/community.types";
import { Loader2, Bell, CheckCircle2, Circle } from "lucide-react";
import { DEMO_MODE } from "@/lib/env";
import { DEMO_NOTIFICATIONS } from "@/lib/demo/demoData";

// Simple date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Notifications Page
 * Route: /notifications
 * Layout: AuthenticatedLayout
 * Guard: requireStudent (or any authenticated user)
 * 
 * Data:
 * - NOTIFICATION_GET_LIST
 * - NOTIFICATION_MARK_READ_ACTION (optional)
 */
export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");

  const page = pageParam ? parseInt(pageParam, 10) - 1 : 0; // Backend uses 0-based
  const size = sizeParam ? parseInt(sizeParam, 10) : 20;

  const { data, isLoading, error } = useNotifications(page, size);
  const { mutate: markAsRead } = useMarkNotificationRead();

  const notifications = data?.items || (DEMO_MODE ? DEMO_NOTIFICATIONS : []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error loading notifications
            </h2>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = notifications.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">No notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You're all caught up! Check back later for new updates.
          </p>
        </div>
      </div>
    );
  }

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with your learning progress
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`bg-white dark:bg-gray-800 border rounded-lg p-4 cursor-pointer hover:shadow-md transition ${
              notification.read
                ? "border-gray-200 dark:border-gray-700"
                : "border-[var(--brand-600)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {notification.read ? (
                  <Circle className="h-5 w-5 text-gray-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-[var(--brand-600)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">{notification.title}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
                {notification.type && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {notification.type.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {data.hasPrevious && (
            <Link
              href={`/notifications?page=${page}&size=${size}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {data.page + 1} of {data.totalPages}
          </span>
          {data.hasNext && (
            <Link
              href={`/notifications?page=${page + 2}&size=${size}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
