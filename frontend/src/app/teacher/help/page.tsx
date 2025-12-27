"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Video,
    FileText,
    CheckCircle,
    Users,
    Settings,
    PlayCircle,
    Upload,
    Eye,
    Lock,
    Rocket,
    ChevronRight,
    FileCheck,
    GitBranch,
    Layers,
    Target,
    Sparkles,
    ArrowRight,
    AlertCircle,
    Lightbulb,
    Zap,
} from "lucide-react";

export default function TeacherHelpPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "steps" | "tips">(
        "overview"
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Teacher Guide
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                        Course Creation Guide
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Complete step-by-step guide to create, manage, and publish your
                        courses successfully
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "overview"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Target className="w-5 h-5 inline mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("steps")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "steps"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Layers className="w-5 h-5 inline mr-2" />
                        Step by Step
                    </button>
                    <button
                        onClick={() => setActiveTab("tips")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "tips"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Lightbulb className="w-5 h-5 inline mr-2" />
                        Tips & Best Practices
                    </button>
                </div>

                {/* Content */}
                {activeTab === "overview" && <OverviewSection />}
                {activeTab === "steps" && <StepsSection />}
                {activeTab === "tips" && <TipsSection />}

                {/* Quick Start CTA */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <Rocket className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Create?</h3>
                    <p className="text-indigo-100 mb-6">
                        Start building your first course and share your knowledge with
                        students worldwide
                    </p>
                    <Link
                        href="/teacher/create-course"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        Create Your First Course
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function OverviewSection() {
    return (
        <div className="space-y-8">
            {/* Course Creation Flow */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <GitBranch className="w-8 h-8 text-indigo-600" />
                    Course Creation Flow
                </h2>

                <div className="grid md:grid-cols-5 gap-4">
                    {[
                        {
                            step: "1",
                            title: "Create Course",
                            icon: BookOpen,
                            color: "indigo",
                            desc: "Basic info & settings",
                        },
                        {
                            step: "2",
                            title: "Create Version",
                            icon: GitBranch,
                            color: "purple",
                            desc: "Content versioning",
                        },
                        {
                            step: "3",
                            title: "Add Content",
                            icon: Video,
                            color: "pink",
                            desc: "Chapters & lessons",
                        },
                        {
                            step: "4",
                            title: "Review",
                            icon: Eye,
                            color: "orange",
                            desc: "Preview & check",
                        },
                        {
                            step: "5",
                            title: "Publish",
                            icon: Rocket,
                            color: "green",
                            desc: "Go live!",
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="relative">
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                                <div
                                    className={`w-12 h-12 rounded-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                                >
                                    {item.step}
                                </div>
                                <item.icon className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {item.desc}
                                </p>
                            </div>
                            {idx < 4 && (
                                <ChevronRight className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-300 dark:text-slate-600 w-5 h-5 hidden md:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Status Flow */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-600" />
                    Course Status Lifecycle
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            status: "DRAFT",
                            icon: FileText,
                            color: "slate",
                            title: "Draft",
                            desc: "Course is being created. Not visible to students.",
                            actions: ["Edit freely", "Add content", "No student access"],
                        },
                        {
                            status: "PENDING_APPROVAL",
                            icon: AlertCircle,
                            color: "yellow",
                            title: "Pending Approval",
                            desc: "Submitted for admin review. Waiting for approval.",
                            actions: [
                                "Under review",
                                "Cannot edit",
                                "Admin will review content",
                            ],
                        },
                        {
                            status: "APPROVED",
                            icon: CheckCircle,
                            color: "green",
                            title: "Approved",
                            desc: "Course approved by admin. Ready to publish.",
                            actions: [
                                "Can publish anytime",
                                "Edit if needed",
                                "Prepare for launch",
                            ],
                        },
                        {
                            status: "PUBLISHED",
                            icon: Rocket,
                            color: "indigo",
                            title: "Published",
                            desc: "Course is live! Students can enroll and learn.",
                            actions: [
                                "Visible to students",
                                "Track enrollments",
                                "Monitor reviews",
                            ],
                        },
                        {
                            status: "ARCHIVED",
                            icon: Lock,
                            color: "red",
                            title: "Archived",
                            desc: "Course is hidden. No new enrollments allowed.",
                            actions: [
                                "Not visible to new students",
                                "Existing students can access",
                                "Can restore anytime",
                            ],
                        },
                    ].map((status, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-700/50 dark:to-transparent rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                        >
                            <div
                                className={`w-16 h-16 rounded-full bg-${status.color}-100 dark:bg-${status.color}-900/30 flex items-center justify-center flex-shrink-0`}
                            >
                                <status.icon
                                    className={`w-8 h-8 text-${status.color}-600 dark:text-${status.color}-400`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                        {status.title}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-300`}
                                    >
                                        {status.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-3">
                                    {status.desc}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {status.actions.map((action, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                        >
                                            • {action}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {idx < 4 && (
                                <ChevronRight className="w-6 h-6 text-slate-300 dark:text-slate-600 mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StepsSection() {
    return (
        <div className="space-y-6">
            {/* Step 1 */}
            <StepCard
                number={1}
                title="Create Your Course"
                icon={BookOpen}
                color="indigo"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Start by creating a new course with basic information.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                            Required Information:
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Course Title (clear and descriptive)",
                                "Short Description (hook students' interest)",
                                "Category (help students find your course)",
                                "Level (Beginner, Intermediate, Advanced)",
                                "Language (course content language)",
                                "Price (or mark as free)",
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-slate-600 dark:text-slate-400"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link
                        href="/teacher/create-course"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        Create Course Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </StepCard>

            {/* Step 2 */}
            <StepCard
                number={2}
                title="Create Course Version"
                icon={GitBranch}
                color="purple"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Course versions allow you to manage and update content without
                        affecting live students.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                                ✅ Why Versions?
                            </h4>
                            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                                <li>• Update content safely</li>
                                <li>• Test changes before publishing</li>
                                <li>• Rollback if needed</li>
                                <li>• Track content history</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                                📝 Version Info:
                            </h4>
                            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                <li>• Version number (e.g., 1.0, 2.0)</li>
                                <li>• Release notes</li>
                                <li>• Status (Draft/Published)</li>
                                <li>• Activation date</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </StepCard>

            {/* Step 3 */}
            <StepCard
                number={3}
                title="Add Course Content"
                icon={Video}
                color="pink"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Organize your course into chapters and lessons for effective
                        learning.
                    </p>

                    {/* Content Structure */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800">
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-4">
                            Content Structure:
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">
                                        Create Chapters
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Group related lessons into chapters (e.g., "Introduction",
                                        "Advanced Topics")
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">
                                        Add Lessons
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Create lessons inside chapters. Choose lesson type:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            { icon: Video, label: "Video Lesson", color: "red" },
                                            {
                                                icon: FileText,
                                                label: "Document",
                                                color: "blue",
                                            },
                                            {
                                                icon: FileCheck,
                                                label: "Assignment",
                                                color: "green",
                                            },
                                            { icon: Target, label: "Quiz", color: "purple" },
                                        ].map((type, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                            >
                                                <type.icon
                                                    className={`w-4 h-4 text-${type.color}-500`}
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {type.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">
                                        Upload Videos
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Upload video content - automatic processing to HLS format
                                    </p>
                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                                            🎥 Video Upload Features:
                                        </p>
                                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                            <li>✅ Chunked upload (resumable)</li>
                                            <li>✅ Progress tracking</li>
                                            <li>✅ Automatic HLS conversion</li>
                                            <li>✅ Supports large files (up to 2GB)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Resources */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Add Resources to Lessons
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                            Enhance learning with additional materials:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "PDF Documents",
                                "Code Files",
                                "External Links",
                                "Reference Materials",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-2 bg-white dark:bg-slate-800 rounded text-sm text-slate-700 dark:text-slate-300"
                                >
                                    • {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </StepCard>

            {/* Step 4 */}
            <StepCard
                number={4}
                title="Review & Preview"
                icon={Eye}
                color="orange"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Review your course before publishing to ensure quality.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: PlayCircle,
                                title: "Preview Mode",
                                desc: "View course as students see it",
                                color: "blue",
                            },
                            {
                                icon: CheckCircle,
                                title: "Content Check",
                                desc: "Verify all videos and materials",
                                color: "green",
                            },
                            {
                                icon: Users,
                                title: "Test Run",
                                desc: "Try quizzes and assignments",
                                color: "purple",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800 rounded-lg`}
                            >
                                <item.icon
                                    className={`w-8 h-8 text-${item.color}-600 dark:text-${item.color}-400 mb-2`}
                                />
                                <h4
                                    className={`font-semibold text-${item.color}-800 dark:text-${item.color}-400 mb-1`}
                                >
                                    {item.title}
                                </h4>
                                <p
                                    className={`text-sm text-${item.color}-700 dark:text-${item.color}-300`}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </StepCard>

            {/* Step 5 */}
            <StepCard
                number={5}
                title="Publish Your Course"
                icon={Rocket}
                color="green"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Make your course available to students worldwide!
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-400 mb-4">
                            Publishing Checklist:
                        </h4>
                        <div className="space-y-3">
                            {[
                                "✅ All required information filled",
                                "✅ At least one version created",
                                "✅ Course content added (chapters & lessons)",
                                "✅ Videos uploaded and processed",
                                "✅ Preview looks good",
                                "✅ Submit for approval (if required)",
                                "🚀 Publish and promote!",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg"
                                >
                                    <span className="text-lg">{item.split(" ")[0]}</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        {item.substring(item.indexOf(" ") + 1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>Note:</strong> After publishing, track your course
                            performance in Analytics. Monitor enrollments, reviews, and
                            student progress!
                        </p>
                    </div>
                </div>
            </StepCard>
        </div>
    );
}

function TipsSection() {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Best Practices */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    Best Practices
                </h3>
                <div className="space-y-3">
                    {[
                        {
                            title: "Clear Structure",
                            desc: "Organize content logically from basics to advanced",
                        },
                        {
                            title: "Engaging Videos",
                            desc: "Keep videos concise (5-15 minutes) and engaging",
                        },
                        {
                            title: "Interactive Content",
                            desc: "Add quizzes and assignments to reinforce learning",
                        },
                        {
                            title: "Quality Thumbnails",
                            desc: "Use attractive thumbnails to grab attention",
                        },
                        {
                            title: "Regular Updates",
                            desc: "Keep content fresh with new versions",
                        },
                    ].map((tip, i) => (
                        <div
                            key={i}
                            className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                        >
                            <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                                {tip.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {tip.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Common Mistakes to Avoid
                </h3>
                <div className="space-y-3">
                    {[
                        {
                            mistake: "Too Long Videos",
                            solution: "Break into shorter, focused lessons",
                        },
                        {
                            mistake: "No Practice",
                            solution: "Add quizzes and assignments after each section",
                        },
                        {
                            mistake: "Poor Audio",
                            solution: "Invest in a good microphone",
                        },
                        {
                            mistake: "No Preview Lessons",
                            solution: "Offer 2-3 free preview lessons to attract students",
                        },
                        {
                            mistake: "Ignoring Feedback",
                            solution: "Read and respond to student reviews",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                            <h4 className="font-semibold text-red-800 dark:text-red-400 mb-1 flex items-center gap-2">
                                ❌ {item.mistake}
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-400">
                                ✅ {item.solution}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Upload Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Video className="w-6 h-6 text-purple-500" />
                    Video Upload Tips
                </h3>
                <div className="space-y-3">
                    {[
                        {
                            icon: "📹",
                            title: "Format",
                            desc: "MP4 (H.264) works best",
                        },
                        {
                            icon: "📏",
                            title: "Resolution",
                            desc: "1080p recommended, 720p minimum",
                        },
                        {
                            icon: "⏱️",
                            title: "Duration",
                            desc: "5-15 minutes per lesson ideal",
                        },
                        {
                            icon: "💾",
                            title: "File Size",
                            desc: "Up to 2GB supported with chunked upload",
                        },
                        {
                            icon: "🎬",
                            title: "Processing",
                            desc: "Wait for HLS conversion (5-10 min)",
                        },
                    ].map((tip, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                        >
                            <span className="text-2xl">{tip.icon}</span>
                            <div>
                                <h4 className="font-semibold text-purple-800 dark:text-purple-400">
                                    {tip.title}
                                </h4>
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                    {tip.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-500" />
                    Success Metrics
                </h3>
                <div className="space-y-3">
                    {[
                        {
                            metric: "Completion Rate",
                            target: "> 70%",
                            tip: "Engaging content keeps students learning",
                        },
                        {
                            metric: "Average Rating",
                            target: "> 4.5/5",
                            tip: "Quality content earns high ratings",
                        },
                        {
                            metric: "Student Enrollments",
                            target: "Growing",
                            tip: "Good courses attract more students",
                        },
                        {
                            metric: "Review Response",
                            target: "< 24 hours",
                            tip: "Quick responses show you care",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-green-800 dark:text-green-400">
                                    {item.metric}
                                </h4>
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                    {item.target}
                                </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {item.tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StepCard({
    number,
    title,
    icon: Icon,
    color,
    children,
}: {
    number: number;
    title: string;
    icon: any;
    color: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div
                className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-6 text-white`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                        {number}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Icon className="w-8 h-8" />
                            {title}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}
