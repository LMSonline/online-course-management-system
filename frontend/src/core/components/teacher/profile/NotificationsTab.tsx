"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface NotificationSettings {
    courseUpdates: boolean;
    newAssignments: boolean;
    gradeUpdates: boolean;
    marketingEmails: boolean;
    systemAlerts: boolean;
    studentMessages: boolean;
    courseReviews: boolean;
    paymentNotifications: boolean;
}

export const NotificationsTab = () => {
    const [settings, setSettings] = useState<NotificationSettings>({
        courseUpdates: true,
        newAssignments: true,
        gradeUpdates: true,
        marketingEmails: false,
        systemAlerts: true,
        studentMessages: true,
        courseReviews: true,
        paymentNotifications: true,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast.success("Notification preferences saved!");
    };

    const notificationGroups = [
        {
            title: "Course Activity",
            description: "Notifications about your courses and students",
            icon: Bell,
            items: [
                {
                    key: "courseUpdates" as keyof NotificationSettings,
                    label: "Course Updates",
                    description: "Receive notifications about your enrolled courses",
                },
                {
                    key: "newAssignments" as keyof NotificationSettings,
                    label: "New Assignments",
                    description: "Get notified when instructors post new assignments",
                },
                {
                    key: "studentMessages" as keyof NotificationSettings,
                    label: "Student Messages",
                    description: "Notifications when students send you messages",
                },
                {
                    key: "courseReviews" as keyof NotificationSettings,
                    label: "Course Reviews",
                    description: "Get notified when students review your courses",
                },
            ],
        },
        {
            title: "Academic Updates",
            description: "Important updates about your academic progress",
            icon: CheckCircle,
            items: [
                {
                    key: "gradeUpdates" as keyof NotificationSettings,
                    label: "Grade Updates",
                    description: "Receive notifications when you receive grades",
                },
                {
                    key: "systemAlerts" as keyof NotificationSettings,
                    label: "System Alerts",
                    description: "Important system announcements and updates",
                },
            ],
        },
        {
            title: "Financial",
            description: "Notifications about payments and earnings",
            icon: Mail,
            items: [
                {
                    key: "paymentNotifications" as keyof NotificationSettings,
                    label: "Payment Notifications",
                    description: "Get notified about payouts and earnings",
                },
                {
                    key: "marketingEmails" as keyof NotificationSettings,
                    label: "Marketing Emails",
                    description: "Receive emails about new courses and special offers",
                },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Email Notifications
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose what emails you want to receive
                </p>
            </div>

            <div className="space-y-6">
                {notificationGroups.map((group, groupIndex) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <group.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {group.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {group.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 ml-13">
                            {group.items.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-start justify-between gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {item.key === "courseUpdates" && (
                                                <Bell className="w-4 h-4 text-slate-400" />
                                            )}
                                            {item.key === "newAssignments" && (
                                                <Bell className="w-4 h-4 text-slate-400" />
                                            )}
                                            {item.key === "gradeUpdates" && (
                                                <CheckCircle className="w-4 h-4 text-slate-400" />
                                            )}
                                            {item.key === "marketingEmails" && (
                                                <Mail className="w-4 h-4 text-slate-400" />
                                            )}
                                            <label className="font-medium text-sm text-slate-900 dark:text-white">
                                                {item.label}
                                            </label>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => handleToggle(item.key)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${settings[item.key]
                                                ? "bg-indigo-600 dark:bg-indigo-500"
                                                : "bg-slate-300 dark:bg-slate-600"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key] ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving..." : "Save Preferences"}
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> You'll continue to receive important account and security
                    notifications regardless of these settings to keep your account safe.
                </p>
            </div>
        </div>
    );
};
