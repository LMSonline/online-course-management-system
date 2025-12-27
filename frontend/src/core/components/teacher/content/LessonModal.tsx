"use client";
import { useState, useEffect } from "react";
import { X, FileText, Video, FileQuestion, Award, Upload, Loader2, Paperclip, Trash2 } from "lucide-react";
import { CreateLessonRequest, UpdateLessonRequest, LessonType } from "@/services/courses/content/lesson.types";

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateLessonRequest | UpdateLessonRequest, attachments?: File[]) => void;
    initialData?: UpdateLessonRequest & { id?: number };
    isLoading?: boolean;
    mode: "create" | "edit";
    onUploadVideo?: (lessonId: number, file: File) => void;
    uploadProgress?: number;
}

const LESSON_TYPES: { value: LessonType; label: string; icon: any; description: string }[] = [
    { value: "VIDEO", label: "Video Lesson", icon: Video, description: "Upload a video tutorial" },
    { value: "DOCUMENT", label: "Document", icon: FileText, description: "Text-based learning material" },
    { value: "ASSIGNMENT", label: "Assignment", icon: FileQuestion, description: "Practice assignment for students" },
    { value: "QUIZ", label: "Quiz", icon: Award, description: "Test knowledge with questions" },
    { value: "FINAL_EXAM", label: "Final Exam", icon: Award, description: "Comprehensive final assessment" },
];

export const LessonModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading,
    mode,
    onUploadVideo,
    uploadProgress,
}: LessonModalProps) => {
    const [type, setType] = useState<LessonType>("VIDEO");
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [showVideoUpload, setShowVideoUpload] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setTitle(initialData.title);
            setShortDescription(initialData.shortDescription || "");
            setIsPreview(initialData.isPreview || false);
        } else {
            setType("VIDEO");
            setTitle("");
            setShortDescription("");
            setIsPreview(false);
            setVideoFile(null);
            setAttachments([]);
            setShowVideoUpload(false);
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            const data: any = {
                type,
                title: title.trim(),
                shortDescription: shortDescription.trim() || undefined,
            };

            if (mode === "edit") {
                data.isPreview = isPreview;
            }

            onSubmit(data, attachments.length > 0 ? attachments : undefined);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments([...attachments, ...files]);
        e.target.value = "";
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleVideoUpload = () => {
        if (videoFile && initialData?.id && onUploadVideo) {
            onUploadVideo(initialData.id, videoFile);
            setVideoFile(null);
            setShowVideoUpload(false);
        }
    };

    const getLessonIcon = (lessonType: LessonType) => {
        const typeConfig = LESSON_TYPES.find(t => t.value === lessonType);
        return typeConfig?.icon || FileText;
    };

    if (!isOpen) return null;

    const Icon = getLessonIcon(type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {mode === "create" ? "Create New Lesson" : "Edit Lesson"}
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
                    {/* Lesson Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Lesson Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {LESSON_TYPES.map((lessonType) => {
                                const TypeIcon = lessonType.icon;
                                return (
                                    <button
                                        key={lessonType.value}
                                        type="button"
                                        onClick={() => setType(lessonType.value)}
                                        disabled={mode === "edit"}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${type === lessonType.value
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                            } ${mode === "edit" ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <TypeIcon className={`w-5 h-5 ${type === lessonType.value
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-600 dark:text-slate-400"
                                                }`} />
                                            <span className={`font-semibold ${type === lessonType.value
                                                ? "text-indigo-900 dark:text-indigo-100"
                                                : "text-slate-900 dark:text-white"
                                                }`}>
                                                {lessonType.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {lessonType.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Lesson Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Introduction to Components"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Short Description
                        </label>
                        <textarea
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            placeholder="Brief description of what students will learn..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    {/* File Attachments (Create mode only) */}
                    {mode === "create" && (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Attachments
                                    </h3>
                                </div>
                                <label className="cursor-pointer text-sm px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Add Files
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                </label>
                            </div>

                            {attachments.length > 0 ? (
                                <div className="space-y-2">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors flex-shrink-0"
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No attachments yet
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Add PDFs, documents, or other learning materials
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview Toggle (Edit mode only) */}
                    {mode === "edit" && type === "VIDEO" && (
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Free Preview
                                </label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Allow students to preview this lesson before enrolling
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPreview(!isPreview)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPreview ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                disabled={isLoading}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPreview ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    )}

                    {/* Video Upload (Edit mode, VIDEO type only) */}
                    {mode === "edit" && type === "VIDEO" && onUploadVideo && (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Video Content
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowVideoUpload(!showVideoUpload)}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {showVideoUpload ? "Cancel" : "Upload Video"}
                                </button>
                            </div>

                            {showVideoUpload && (
                                <div className="space-y-3">
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <label
                                            htmlFor="video-upload"
                                            className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Choose video file
                                        </label>
                                        {videoFile && (
                                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                {videoFile.name}
                                            </p>
                                        )}
                                    </div>

                                    {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    Uploading...
                                                </span>
                                                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                    {uploadProgress.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {videoFile && (
                                        <button
                                            type="button"
                                            onClick={handleVideoUpload}
                                            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            disabled={!videoFile || (uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100)}
                                        >
                                            {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                "Upload Video"
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

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
                            {isLoading ? "Saving..." : mode === "create" ? "Create Lesson" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
