"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Clock, Video, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PreferencesSettings {
    language: string;
    timezone: string;
    autoPlayNextLesson: boolean;
    showSubtitles: boolean;
    videoQuality: string;
}

export const PreferencesTab = () => {
    const [settings, setSettings] = useState<PreferencesSettings>({
        language: "en",
        timezone: "America/New_York",
        autoPlayNextLesson: true,
        showSubtitles: false,
        videoQuality: "auto",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key: keyof PreferencesSettings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast.success("Preferences saved!");
    };

    const handleDeleteAccount = () => {
        // This would trigger account deletion process
        toast.error("Account deletion is not implemented in this demo");
        setShowDeleteModal(false);
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "vi", name: "Tiếng Việt" },
        { code: "es", name: "Español" },
        { code: "fr", name: "Français" },
        { code: "de", name: "Deutsch" },
        { code: "ja", name: "日本語" },
        { code: "zh", name: "中文" },
    ];

    const timezones = [
        { value: "America/New_York", label: "Eastern Time (ET)" },
        { value: "America/Chicago", label: "Central Time (CT)" },
        { value: "America/Denver", label: "Mountain Time (MT)" },
        { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
        { value: "Europe/London", label: "GMT (London)" },
        { value: "Europe/Paris", label: "CET (Paris)" },
        { value: "Asia/Tokyo", label: "JST (Tokyo)" },
        { value: "Asia/Shanghai", label: "CST (Shanghai)" },
        { value: "Asia/Ho_Chi_Minh", label: "ICT (Ho Chi Minh)" },
    ];

    const videoQualities = [
        { value: "auto", label: "Auto" },
        { value: "1080p", label: "1080p (Full HD)" },
        { value: "720p", label: "720p (HD)" },
        { value: "480p", label: "480p (SD)" },
        { value: "360p", label: "360p" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Language & Region
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Set your language and regional preferences
                </p>
            </div>

            <div className="space-y-6">
                {/* Language */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                Language
                            </h3>
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleInputChange}
                                className="w-full md:w-64 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timezone */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                Timezone
                            </h3>
                            <select
                                name="timezone"
                                value={settings.timezone}
                                onChange={handleInputChange}
                                className="w-full md:w-64 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                            >
                                {timezones.map((tz) => (
                                    <option key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </div>

            {/* Learning Preferences */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Learning Preferences
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Customize your learning experience
                </p>

                <div className="space-y-4">
                    {/* Auto-play Next Lesson */}
                    <div className="flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Video className="w-4 h-4 text-slate-400" />
                                <label className="font-medium text-sm text-slate-900 dark:text-white">
                                    Auto-play next lesson
                                </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Automatically start the next lesson when one finishes
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("autoPlayNextLesson")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${settings.autoPlayNextLesson
                                    ? "bg-indigo-600 dark:bg-indigo-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoPlayNextLesson ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Show Subtitles */}
                    <div className="flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Video className="w-4 h-4 text-slate-400" />
                                <label className="font-medium text-sm text-slate-900 dark:text-white">
                                    Show subtitles by default
                                </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Display subtitles when watching video lessons
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showSubtitles")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${settings.showSubtitles
                                    ? "bg-indigo-600 dark:bg-indigo-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showSubtitles ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Video Quality */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Video className="w-4 h-4 text-slate-400" />
                                    <label className="font-medium text-sm text-slate-900 dark:text-white">
                                        Default Video Quality
                                    </label>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Choose your preferred video quality
                                </p>
                                <select
                                    name="videoQuality"
                                    value={settings.videoQuality}
                                    onChange={handleInputChange}
                                    className="w-full md:w-48 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white text-sm"
                                >
                                    {videoQualities.map((quality) => (
                                        <option key={quality.value} value={quality.value}>
                                            {quality.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">
                                Danger Zone
                            </h3>
                            <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                                Irreversible and destructive actions
                            </p>
                            <div className="flex items-center justify-between bg-white dark:bg-red-900/30 rounded-lg p-4 border border-red-200 dark:border-red-700">
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Delete Account
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Permanently delete your account and all data
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Are you sure you want to delete your account? This action cannot be
                                    undone and all your data will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
