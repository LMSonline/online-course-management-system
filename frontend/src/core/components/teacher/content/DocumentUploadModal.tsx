"use client";
import { useState, useEffect } from "react";
import { X, Upload, FileText, Download, ExternalLink, Trash2, Link2, File } from "lucide-react";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { lessonResourceService } from "@/services/courses/content/lesson-resource.service";
import { LessonResourceResponse } from "@/services/courses/content/lesson-resource.types";
import { toast } from "sonner";

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: LessonResponse;
    onUploadComplete: () => void;
}

type UploadMode = "file" | "link" | null;

export const DocumentUploadModal = ({
    isOpen,
    onClose,
    lesson,
    onUploadComplete,
}: DocumentUploadModalProps) => {
    const [resources, setResources] = useState<LessonResourceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadMode, setUploadMode] = useState<UploadMode>(null);

    // File upload states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileTitle, setFileTitle] = useState("");
    const [fileDescription, setFileDescription] = useState("");
    const [isFileRequired, setIsFileRequired] = useState(false);

    // Link upload states
    const [linkUrl, setLinkUrl] = useState("");
    const [linkTitle, setLinkTitle] = useState("");
    const [linkDescription, setLinkDescription] = useState("");
    const [isLinkRequired, setIsLinkRequired] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadResources();
        }
    }, [isOpen]);

    const loadResources = async () => {
        try {
            setIsLoading(true);
            const data = await lessonResourceService.getLessonResources(lesson.id);
            setResources(data);
        } catch (error: any) {
            console.error("Failed to load resources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!fileTitle) {
                setFileTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            toast.error("Please select a file");
            return;
        }

        if (!fileTitle.trim()) {
            toast.error("Please enter a title");
            return;
        }

        try {
            setIsLoading(true);
            await lessonResourceService.addFileResource(
                lesson.id,
                selectedFile,
                fileTitle.trim(),
                fileDescription.trim() || undefined,
                isFileRequired
            );
            toast.success("File uploaded successfully");
            resetFileForm();
            await loadResources();
            onUploadComplete();
        } catch (error: any) {
            toast.error(error?.message || "Failed to upload file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLink = async () => {
        if (!linkUrl.trim()) {
            toast.error("Please enter a URL");
            return;
        }

        if (!linkTitle.trim()) {
            toast.error("Please enter a title");
            return;
        }

        try {
            setIsLoading(true);
            await lessonResourceService.addLinkResource(lesson.id, {
                resourceType: "LINK",
                title: linkTitle.trim(),
                description: linkDescription.trim() || undefined,
                externalUrl: linkUrl.trim(),
                isRequired: isLinkRequired,
            });
            toast.success("Link added successfully");
            resetLinkForm();
            await loadResources();
            onUploadComplete();
        } catch (error: any) {
            toast.error(error?.message || "Failed to add link");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteResource = async (resourceId: number) => {
        if (!confirm("Are you sure you want to delete this resource?")) {
            return;
        }

        try {
            setIsLoading(true);
            await lessonResourceService.deleteResource(lesson.id, resourceId);
            toast.success("Resource deleted successfully");
            await loadResources();
            onUploadComplete();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete resource");
        } finally {
            setIsLoading(false);
        }
    };

    const resetFileForm = () => {
        setSelectedFile(null);
        setFileTitle("");
        setFileDescription("");
        setIsFileRequired(false);
        setUploadMode(null);
    };

    const resetLinkForm = () => {
        setLinkUrl("");
        setLinkTitle("");
        setLinkDescription("");
        setIsLinkRequired(false);
        setUploadMode(null);
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split(".").pop()?.toLowerCase();
        if (["pdf"].includes(ext || "")) return "📄";
        if (["doc", "docx"].includes(ext || "")) return "📝";
        if (["xls", "xlsx"].includes(ext || "")) return "📊";
        if (["ppt", "pptx"].includes(ext || "")) return "📽️";
        if (["zip", "rar"].includes(ext || "")) return "📦";
        return "📎";
    };

    const getResourceUrl = (resource: LessonResourceResponse) => {
        if (resource.resourceType === "FILE") {
            return resource.downloadUrl || resource.displayUrl || "";
        }
        return resource.externalUrl || "";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Learning Resources
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                {lesson.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Existing Resources */}
                    {resources.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Current Resources ({resources.length})
                            </h3>
                            <div className="space-y-2">
                                {resources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <span className="text-2xl flex-shrink-0">
                                                {resource.resourceType === "FILE"
                                                    ? getFileIcon(resource.fileName || "")
                                                    : "🔗"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                        {resource.title}
                                                    </h4>
                                                    {resource.isRequired && (
                                                        <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs font-medium border border-red-500/20">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                                {resource.description && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        {resource.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 capitalize">
                                                    {resource.resourceType.toLowerCase()}
                                                    {resource.resourceType === "FILE" && resource.formattedFileSize && (
                                                        <span> • {resource.formattedFileSize}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                                            {resource.resourceType === "FILE" ? (
                                                <a
                                                    href={getResourceUrl(resource)}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <a
                                                    href={getResourceUrl(resource)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                                    title="Open Link"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDeleteResource(resource.id)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add New Resource */}
                    {!uploadMode ? (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Add New Resource
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setUploadMode("file")}
                                    className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group"
                                >
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Upload File
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        PDF, Word, Excel, PowerPoint, etc.
                                    </p>
                                </button>

                                <button
                                    onClick={() => setUploadMode("link")}
                                    className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                                >
                                    <Link2 className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Add Link
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        External resources, videos, articles
                                    </p>
                                </button>
                            </div>
                        </div>
                    ) : uploadMode === "file" ? (
                        /* File Upload Form */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Upload File
                                </h3>
                                <button
                                    onClick={resetFileForm}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* File Selection */}
                            {!selectedFile ? (
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center">
                                    <File className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload-input"
                                        disabled={isLoading}
                                    />
                                    <label
                                        htmlFor="file-upload-input"
                                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Choose File
                                    </label>
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate flex-1">
                                            {selectedFile.name}
                                        </p>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={fileTitle}
                                    onChange={(e) => setFileTitle(e.target.value)}
                                    placeholder="e.g., Course Syllabus"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={fileDescription}
                                    onChange={(e) => setFileDescription(e.target.value)}
                                    placeholder="Brief description..."
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Required Toggle */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Required Resource
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsFileRequired(!isFileRequired)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFileRequired ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                    disabled={isLoading}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFileRequired ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUploadFile}
                                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !selectedFile || !fileTitle.trim()}
                            >
                                {isLoading ? "Uploading..." : "Upload File"}
                            </button>
                        </div>
                    ) : (
                        /* Link Form */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Add External Link
                                </h3>
                                <button
                                    onClick={resetLinkForm}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com/resource"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={linkTitle}
                                    onChange={(e) => setLinkTitle(e.target.value)}
                                    placeholder="e.g., Official Documentation"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={linkDescription}
                                    onChange={(e) => setLinkDescription(e.target.value)}
                                    placeholder="Brief description..."
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Required Toggle */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Required Resource
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsLinkRequired(!isLinkRequired)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLinkRequired ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                    disabled={isLoading}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLinkRequired ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAddLink}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !linkUrl.trim() || !linkTitle.trim()}
                            >
                                {isLoading ? "Adding..." : "Add Link"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                        disabled={isLoading}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
