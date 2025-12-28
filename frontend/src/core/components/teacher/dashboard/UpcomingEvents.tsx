// src/core/components/teacher/dashboard/UpcomingEvents.tsx
"use client";

import { Calendar, Clock, Video, Users } from "lucide-react";

interface Event {
    id: number;
    title: string;
    type: "lesson" | "meeting" | "deadline";
    date: string;
    time: string;
    participants?: number;
}

interface UpcomingEventsProps {
    events: Event[];
}

const eventIcons = {
    lesson: Video,
    meeting: Users,
    deadline: Clock,
};

const eventColors = {
    lesson: {
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        border: "border-indigo-200 dark:border-indigo-800",
    },
    meeting: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800",
    },
    deadline: {
        icon: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        border: "border-orange-200 dark:border-orange-800",
    },
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Upcoming Events
                </h2>
                <Calendar className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-3">
                {events.map((event) => {
                    const Icon = eventIcons[event.type];
                    const colors = eventColors[event.type];

                    return (
                        <div
                            key={event.id}
                            className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        <span>{event.date}</span>
                                        <span>•</span>
                                        <span>{event.time}</span>
                                        {event.participants && (
                                            <>
                                                <span>•</span>
                                                <span>{event.participants} participants</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {events.length === 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
                        No upcoming events
                    </p>
                )}
            </div>
        </section>
    );
}
