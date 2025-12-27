"use client";
import { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import { ChapterRequest } from "@/services/courses/content/chapter.types";

interface ChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ChapterRequest) => void;
    initialData?: ChapterRequest;
    isLoading?: boolean;
    mode: "create" | "edit";
}

export const ChapterModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading,
    mode,
}: ChapterModalProps) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
        } else {
            setTitle("");
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit({ title: title.trim() });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {mode === "create" ? "Create New Chapter" : "Edit Chapter"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Chapter Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Introduction to React"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                            disabled={isLoading}
                        />
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Give your chapter a clear, descriptive title
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !title.trim()}
                        >
                            {isLoading ? "Saving..." : mode === "create" ? "Create Chapter" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
