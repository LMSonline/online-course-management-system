"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useNotifications,
    useUnreadCount,
    useMarkAsRead,
    useMarkAllAsRead,
    useDeleteNotification,
} from "@/hooks/teacher/useNotifications";
import { NotificationResponse } from "@/services/community/notification/notification.types";
import Button from "@/core/components/ui/Button";
import { Card, CardContent } from "@/core/components/ui/Card";
import Badge from "@/core/components/ui/Badge";
import {
    Bell,
    CheckCheck,
    Trash2,
    FileText,
    MessageSquare,
    Award,
    AlertCircle,
    Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "NEW_ASSIGNMENT":
            return <FileText className="h-5 w-5 text-blue-600" />;
        case "NEW_COMMENT":
            return <MessageSquare className="h-5 w-5 text-green-600" />;
        case "COURSE_APPROVED":
            return <Award className="h-5 w-5 text-yellow-600" />;
        case "COURSE_REJECTED":
            return <AlertCircle className="h-5 w-5 text-red-600" />;
        case "NEW_ENROLLMENT":
            return <Users className="h-5 w-5 text-purple-600" />;
        default:
            return <Bell className="h-5 w-5 text-gray-600" />;
    }
};

const getNavigationPath = (notification: NotificationResponse): string => {
    const { referenceType, referenceId } = notification;

    switch (referenceType) {
        case "ASSIGNMENT":
            return `/teacher/assignments/${referenceId}/submissions`;
        case "COMMENT":
            return `/teacher/qna`;
        case "COURSE":
            return `/teacher/courses/${referenceId}`;
        case "ENROLLMENT":
            return `/teacher/students`;
        default:
            return "/teacher/dashboard";
    }
};

export default function NotificationsPage() {
    const router = useRouter();
    const { data: notificationsData, isLoading } = useNotifications(0, 50);
    const { data: unreadCount } = useUnreadCount();
    const markAsReadMutation = useMarkAsRead();
    const markAllAsReadMutation = useMarkAllAsRead();
    const deleteMutation = useDeleteNotification();

    const notifications = notificationsData?.items || [];

    const handleNotificationClick = async (notification: NotificationResponse) => {
        if (!notification.isRead) {
            await markAsReadMutation.mutateAsync(notification.id);
        }
        const path = getNavigationPath(notification);
        router.push(path);
    };

    const handleMarkAllRead = async () => {
        await markAllAsReadMutation.mutateAsync();
    };

    const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this notification?")) {
            await deleteMutation.mutateAsync(notificationId);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {unreadCount && unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                : "You're all caught up!"}
                        </p>
                    </div>
                    {unreadCount && unreadCount > 0 && (
                        <Button onClick={handleMarkAllRead} variant="outline" className="border-slate-200 dark:border-slate-800">
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardContent className="py-12 text-center">
                            <Bell className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No notifications yet</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                You'll see notifications here when students interact with your courses
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification: any) => (
                            <Card
                                key={notification.id}
                                className={`cursor-pointer transition-all hover:shadow-lg border ${!notification.isRead
                                    ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                            {getNotificationIcon(notification.notificationType)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="font-medium text-slate-900 dark:text-white">{notification.title}</p>
                                                {!notification.isRead && (
                                                    <Badge variant="default" className="flex-shrink-0 text-xs bg-indigo-600">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{notification.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                                <span>
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                                {notification.notificationType && (
                                                    <>
                                                        <span className="text-slate-400 dark:text-slate-600">•</span>
                                                        <span className="capitalize">
                                                            {notification.notificationType.replace(/_/g, " ").toLowerCase()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {notificationsData && notificationsData.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" disabled={!notificationsData.hasPrevious} className="border-slate-200 dark:border-slate-800">
                            Previous
                        </Button>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            Page {notificationsData.page + 1} of {notificationsData.totalPages}
                        </span>
                        <Button variant="outline" disabled={!notificationsData.hasNext} className="border-slate-200 dark:border-slate-800">
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
