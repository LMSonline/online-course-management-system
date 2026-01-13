// src/app/teacher/dashboard/overview/page.tsx
"use client";

import { ActivityFeed } from "@/core/components/teacher/dashboard/ActivityFeed";
import { UpcomingEvents } from "@/core/components/teacher/dashboard/UpcomingEvents";
import { TopStudents } from "@/core/components/teacher/dashboard/TopStudents";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockStudents, mockNotifications } from "@/lib/teacher/mockData";

export default function TeacherDashboardOverviewPage() {
    // Convert notifications to activities
    const mockActivities = mockNotifications.slice(0, 6).map((notif) => {
        const typeMap: Record<string, "review" | "question" | "enrollment" | "submission"> = {
            NEW_COMMENT: "question",
            NEW_ENROLLMENT: "enrollment",
            NEW_ASSIGNMENT: "submission",
            COURSE_APPROVED: "review",
        };
        return {
            id: notif.id,
            type: typeMap[notif.type] || "review" as const,
            message: notif.title,
            user: notif.message.split(" ")[0] || "Student",
            course: notif.message,
            time: new Date(notif.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            }),
        };
    });

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
            date: "Jan 20, 2026",
            time: "10:00 AM",
        },
    ];

    // Use top performers from mock students
    const mockTopStudents = mockStudents
        .sort((a, b) => b.averageGrade - a.averageGrade)
        .slice(0, 5)
        .map((student, index) => ({
            id: student.id,
            name: student.studentName,
            avatar: student.avatarUrl,
            coursesCompleted: Math.floor(student.completionPercentage / 20),
            avgScore: Math.round(student.averageGrade),
            progress: student.completionPercentage,
        }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">\n            <div className="max-w-7xl mx-auto p-6 space-y-6">\n                {/* Header */}\n                <div className="flex items-center gap-4">
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
