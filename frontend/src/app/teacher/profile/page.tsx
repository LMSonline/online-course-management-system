"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    ProfileTab,
    SecurityTab,
    NotificationsTab,
    PreferencesTab
} from "@/core/components/teacher/profile";

type TabType = "profile" | "security" | "notifications" | "preferences";

export default function TeacherProfilePage() {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get("tab") as TabType) || "profile";
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const tabs = [
        { id: "profile" as TabType, label: "Profile" },
        { id: "security" as TabType, label: "Security" },
        { id: "notifications" as TabType, label: "Notifications" },
        { id: "preferences" as TabType, label: "Preferences" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileTab />;
            case "security":
                return <SecurityTab />;
            case "notifications":
                return <NotificationsTab />;
            case "preferences":
                return <PreferencesTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Account Settings
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <div className="flex gap-1 p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6"
                    >
                        {renderTabContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
