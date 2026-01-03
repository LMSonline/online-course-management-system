// src/core/components/teacher/dashboard/ActivityFeed.tsx
"use client";

import { Clock, MessageSquare, FileText, Users, Star } from "lucide-react";

interface Activity {
    id: number;
    type: "review" | "question" | "enrollment" | "submission";
    message: string;
    time: string;
    user?: string;
    course?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

const activityIcons = {
    review: Star,
    question: MessageSquare,
    enrollment: Users,
    submission: FileText,
};

const activityColors = {
    review: {
        icon: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    question: {
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    enrollment: {
        icon: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    submission: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/30",
    },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Activity
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => {
                    const Icon = activityIcons[activity.type];
                    const colors = activityColors[activity.type];

                    return (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${colors.icon}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 dark:text-white">
                                    {activity.message}
                                </p>
                                {(activity.user || activity.course) && (
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                        {activity.user && <span>{activity.user}</span>}
                                        {activity.user && activity.course && <span> • </span>}
                                        {activity.course && <span>{activity.course}</span>}
                                    </p>
                                )}
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.time}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {activities.length === 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
                        No recent activity
                    </p>
                )}
            </div>
        </section>
    );
}
