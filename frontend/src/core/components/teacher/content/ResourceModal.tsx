"use client";
import { useState, useEffect } from "react";
import { X, FileText, Link as LinkIcon, Code, Upload, ExternalLink } from "lucide-react";
import { LessonResourceRequest, ResourceType } from "@/services/courses/content/lesson-resource.types";

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitFile: (file: File, title?: string, description?: string, isRequired?: boolean) => void;
    onSubmitLink: (data: LessonResourceRequest) => void;
    initialData?: LessonResourceRequest & { id?: number };
    isLoading?: boolean;
    mode: "create" | "edit";
}

const RESOURCE_TYPES: { value: ResourceType; label: string; icon: any; description: string }[] = [
    { value: "FILE", label: "File", icon: FileText, description: "Upload PDF, documents, or other files" },
    { value: "LINK", label: "Link", icon: LinkIcon, description: "Add external website or resource link" },
    { value: "EMBED", label: "Embed", icon: Code, description: "Embed content like Google Docs, Slides" },
];

export const ResourceModal = ({
    isOpen,
    onClose,
    onSubmitFile,
    onSubmitLink,
    initialData,
    isLoading,
    mode,
}: ResourceModalProps) => {
    const [resourceType, setResourceType] = useState<ResourceType>("FILE");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [isRequired, setIsRequired] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (initialData) {
            setResourceType(initialData.resourceType);
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            setExternalUrl(initialData.externalUrl || "");
            setIsRequired(initialData.isRequired || false);
        } else {
            setResourceType("FILE");
            setTitle("");
            setDescription("");
            setExternalUrl("");
            setIsRequired(false);
            setFile(null);
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        if (resourceType === "FILE") {
            if (file || mode === "edit") {
                onSubmitFile(file!, title.trim(), description.trim() || undefined, isRequired);
            }
        } else {
            if (!externalUrl.trim()) return;

            onSubmitLink({
                resourceType,
                title: title.trim(),
                description: description.trim() || undefined,
                externalUrl: externalUrl.trim(),
                isRequired,
            });
        }
    };

    if (!isOpen) return null;

    const Icon = RESOURCE_TYPES.find(t => t.value === resourceType)?.icon || FileText;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {mode === "create" ? "Add Resource" : "Edit Resource"}
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
                    {/* Resource Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Resource Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {RESOURCE_TYPES.map((type) => {
                                const TypeIcon = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setResourceType(type.value)}
                                        disabled={mode === "edit"}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${resourceType === type.value
                                                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                            } ${mode === "edit" ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <TypeIcon className={`w-6 h-6 mx-auto mb-2 ${resourceType === type.value
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-slate-600 dark:text-slate-400"
                                            }`} />
                                        <span className={`text-sm font-semibold block ${resourceType === type.value
                                                ? "text-emerald-900 dark:text-emerald-100"
                                                : "text-slate-900 dark:text-white"
                                            }`}>
                                            {type.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* File Upload (FILE type only) */}
                    {resourceType === "FILE" && mode === "create" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Upload File <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];
                                        setFile(selectedFile || null);
                                        if (selectedFile && !title) {
                                            setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
                                        }
                                    }}
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Choose File
                                </label>
                                {file && (
                                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* External URL (LINK/EMBED types) */}
                    {resourceType !== "FILE" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                URL <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                    placeholder={resourceType === "LINK" ? "https://example.com" : "https://docs.google.com/..."}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                            {resourceType === "EMBED" && (
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    For Google Docs, use File → Publish to web → Get embed link
                                </p>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Course Materials PDF"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this resource..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Required Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Required Resource
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Students must access this resource to complete the lesson
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRequired(!isRequired)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRequired ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                            disabled={isLoading}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRequired ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
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
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !title.trim() || (resourceType === "FILE" && !file && mode === "create") || (resourceType !== "FILE" && !externalUrl.trim())}
                        >
                            {isLoading ? "Saving..." : mode === "create" ? "Add Resource" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
