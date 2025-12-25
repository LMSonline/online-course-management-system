"use client";

import { useState, useEffect } from "react";
import TeacherSidebar from "@/core/components/teacher/sidebar/TeacherSidebar";
import { Bell, User, Menu } from "lucide-react";
import Link from "next/link";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Auto-open sidebar on desktop, auto-close on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        // Set initial state
        handleResize();

        // Listen for resize events
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ${
                    sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-20 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
                    {/* Left: Menu button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Center: Empty for balance */}
                    <div className="flex-1 lg:flex-none"></div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
                        </button>

                        {/* User Profile */}
                        <Link
                            href="/teacher/profile"
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="hidden md:block text-sm text-slate-300 font-medium">
                                Teacher
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}