"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUnreadCount, useNotifications, useMarkAsRead } from "@/hooks/teacher";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { NotificationResponse } from "@/services/community/notification/notification.types";

export function NotificationBell() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const { data: unreadCount } = useUnreadCount();
    const { data: notificationsData } = useNotifications(0, 5); // Latest 5
    const markAsReadMutation = useMarkAsRead();

    const notifications = notificationsData?.items || [];

    const handleNotificationClick = (notification: NotificationResponse) => {
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification.id);
        }
        setIsOpen(false);
        router.push("/teacher/notifications");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="h-5 w-5" />
                {unreadCount && unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold">Notifications</h3>
                            {unreadCount && unreadCount > 0 && (
                                <button
                                    onClick={() => router.push("/teacher/notifications")}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View all
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification: NotificationResponse) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${!notification.isRead ? "bg-blue-50/50" : ""
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notification.isRead ? "bg-blue-600" : "bg-transparent"
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    {notification.title}
                                                </p>
                                                {notification.content && (
                                                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                                        {notification.content}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 bg-gray-50 border-t">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push("/teacher/notifications");
                                    }}
                                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
