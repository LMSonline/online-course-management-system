// src/app/teacher/dashboard/overview/page.tsx
"use client";

import { ActivityFeed } from "@/core/components/teacher/dashboard/ActivityFeed";
import { UpcomingEvents } from "@/core/components/teacher/dashboard/UpcomingEvents";
import { TopStudents } from "@/core/components/teacher/dashboard/TopStudents";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardOverviewPage() {
    // Mock data - Replace with real API calls
    const mockActivities = [
        {
            id: 1,
            type: "review" as const,
            message: "New 5-star review received",
            user: "Sarah Johnson",
            course: "Complete Web Development Bootcamp",
            time: "5 minutes ago",
        },
        {
            id: 2,
            type: "question" as const,
            message: "New question in Q&A",
            user: "John Davis",
            course: "Advanced React Patterns",
            time: "15 minutes ago",
        },
        {
            id: 3,
            type: "enrollment" as const,
            message: "3 new students enrolled",
            course: "Node.js Deep Dive",
            time: "1 hour ago",
        },
        {
            id: 4,
            type: "submission" as const,
            message: "5 new assignment submissions",
            course: "Complete Web Development Bootcamp",
            time: "2 hours ago",
        },
    ];

    const mockEvents = [
        {
            id: 1,
            title: "Live Q&A Session",
            type: "meeting" as const,
            date: "Today",
            time: "3:00 PM",
            participants: 45,
        },
        {
            id: 2,
            title: "Assignment Grading Deadline",
            type: "deadline" as const,
            date: "Tomorrow",
            time: "11:59 PM",
        },
        {
            id: 3,
            title: "New Course Launch",
            type: "lesson" as const,
            date: "Dec 30",
            time: "10:00 AM",
        },
    ];

    const mockTopStudents = [
        {
            id: 1,
            name: "Emily Chen",
            avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=6366f1&color=fff",
            coursesCompleted: 5,
            avgScore: 98,
            progress: 95,
        },
        {
            id: 2,
            name: "Michael Brown",
            avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=ec4899&color=fff",
            coursesCompleted: 4,
            avgScore: 95,
            progress: 88,
        },
        {
            id: 3,
            name: "Jessica Liu",
            avatar: "https://ui-avatars.com/api/?name=Jessica+Liu&background=10b981&color=fff",
            coursesCompleted: 3,
            avgScore: 92,
            progress: 85,
        },
        {
            id: 4,
            name: "David Kim",
            avatar: "https://ui-avatars.com/api/?name=David+Kim&background=f59e0b&color=fff",
            coursesCompleted: 3,
            avgScore: 90,
            progress: 82,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/dashboard"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Detailed view of your teaching activities and student performance
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Activity Feed */}
                    <div className="lg:col-span-2">
                        <ActivityFeed activities={mockActivities} />
                    </div>

                    {/* Right Column - Events & Top Students */}
                    <div className="space-y-6">
                        <UpcomingEvents events={mockEvents} />
                        <TopStudents students={mockTopStudents} />
                    </div>
                </div>
            </div>
        </div>
    );
}
