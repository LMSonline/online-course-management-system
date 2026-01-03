"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Bell,
    CheckCircle,
    Trash2,
    Filter,
    User,
    FileText,
    MessageSquare,
    DollarSign,
    AlertCircle,
    Settings,
    Search,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Notification {
    id: number;
    type: "student" | "assignment" | "message" | "payment" | "system";
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
}

// Mock API calls
const fetchNotifications = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
        {
            id: 1,
            type: "student" as const,
            title: "New Student Enrolled",
            message: "Sarah Johnson enrolled in Complete Web Development Bootcamp",
            time: "5 minutes ago",
            read: false,
            link: "/teacher/students/5",
        },
        {
            id: 2,
            type: "assignment" as const,
            title: "Assignment Submitted",
            message: "John Davis submitted React Hooks Deep Dive assignment",
            time: "15 minutes ago",
            read: false,
            link: "/teacher/assignments/1/submissions/3",
        },
        {
            id: 3,
            type: "message" as const,
            title: "New Question Posted",
            message: "Maria Garcia asked a question in Lesson 5: State Management",
            time: "1 hour ago",
            read: false,
            link: "/teacher/qna",
        },
        {
            id: 4,
            type: "payment" as const,
            title: "Payment Received",
            message: "You received a payout of $450.00 for last month",
            time: "2 hours ago",
            read: true,
            link: "/teacher/payouts",
        },
        {
            id: 5,
            type: "system" as const,
            title: "Course Update Required",
            message: "Your course 'Advanced React Patterns' needs content review",
            time: "3 hours ago",
            read: true,
            link: "/teacher/courses",
        },
        {
            id: 6,
            type: "student" as const,
            title: "Student Achievement",
            message: "Robert Kim completed your course and earned a certificate",
            time: "5 hours ago",
            read: true,
            link: "/teacher/students/3",
        },
        {
            id: 7,
            type: "assignment" as const,
            title: "Grading Needed",
            message: "5 assignments are waiting for your review",
            time: "1 day ago",
            read: true,
            link: "/teacher/assignments",
        },
        {
            id: 8,
            type: "message" as const,
            title: "Course Review Posted",
            message: "Emma Wilson left a 5-star review on your course",
            time: "1 day ago",
            read: true,
            link: "/teacher/analytics",
        },
    ];
};

const markAsRead = async (notificationIds: number[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
};

const deleteNotification = async (notificationId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
};

export default function NotificationsPage() {
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
    });

    const markReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Marked as read");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification deleted");
        },
    });

    const handleMarkAsRead = (id: number) => {
        markReadMutation.mutate([id]);
    };

    const handleMarkAllRead = () => {
        const unreadIds = notifications?.filter((n) => !n.read).map((n) => n.id) || [];
        if (unreadIds.length > 0) {
            markReadMutation.mutate(unreadIds);
        }
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "student":
                return <User className="w-5 h-5" />;
            case "assignment":
                return <FileText className="w-5 h-5" />;
            case "message":
                return <MessageSquare className="w-5 h-5" />;
            case "payment":
                return <DollarSign className="w-5 h-5" />;
            case "system":
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getIconColor = (type: Notification["type"]) => {
        switch (type) {
            case "student":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
            case "assignment":
                return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
            case "message":
                return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
            case "payment":
                return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
            case "system":
                return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
        }
    };

    // Filter notifications
    let filteredNotifications = notifications || [];

    if (filter !== "all") {
        if (filter === "unread") {
            filteredNotifications = filteredNotifications.filter((n) => !n.read);
        } else {
            filteredNotifications = filteredNotifications.filter((n) => n.type === filter);
        }
    }

    if (searchQuery) {
        filteredNotifications = filteredNotifications.filter(
            (n) =>
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const unreadCount = notifications?.filter((n) => !n.read).length || 0;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Bell className="w-8 h-8" />
                            Notifications
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={markReadMutation.isPending}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Mark All Read
                            </button>
                        )}
                        <Link
                            href="/teacher/profile?tab=notifications"
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                { value: "all", label: "All" },
                                { value: "unread", label: "Unread" },
                                { value: "student", label: "Students" },
                                { value: "assignment", label: "Assignments" },
                                { value: "message", label: "Messages" },
                                { value: "payment", label: "Payments" },
                                { value: "system", label: "System" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === option.value
                                            ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Notifications List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No notifications</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {searchQuery ? "No notifications match your search" : "You're all caught up!"}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="ml-2 w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full inline-block"></span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                                        {notification.time}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            disabled={markReadMutation.isPending}
                                                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notification.id)}
                                                        disabled={deleteMutation.isPending}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Link */}
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                                                >
                                                    View details →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        💡 <strong>Tip:</strong> Customize your notification preferences in{" "}
                        <Link href="/teacher/profile?tab=notifications" className="underline font-medium">
                            Profile Settings
                        </Link>{" "}
                        to control what emails you receive.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
