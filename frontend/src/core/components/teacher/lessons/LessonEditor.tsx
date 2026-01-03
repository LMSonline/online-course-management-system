"use client";

import React, { useState } from "react";
import { useLessonEditor } from "@/hooks/teacher/useLessonEditor";
import { VideoUpload } from "./VideoUpload";
import {
    Save,
    Upload,
    FileText,
    Video,
    Link as LinkIcon,
    Plus,
    Trash2,
    Download,
    CheckSquare,
} from "lucide-react";
import { LessonType } from "@/services/courses/content/lesson.types";
import { ResourceType } from "@/services/courses/content/lesson-resource.types";

interface LessonEditorProps {
    lessonId: number;
    onClose?: () => void;
    onSaved?: () => void;
}

export function LessonEditor({ lessonId, onClose, onSaved }: LessonEditorProps) {
    const {
        lesson,
        resources,
        loading,
        saving,
        error,
        updateLesson,
        addResource,
        deleteResource,
        uploadFile,
    } = useLessonEditor({ lessonId });

    const [title, setTitle] = useState(lesson?.title || "");
    const [description, setDescription] = useState(lesson?.shortDescription || "");
    const [isPreview, setIsPreview] = useState(lesson?.isPreview || false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [showAddResource, setShowAddResource] = useState(false);

    // Update local state when lesson loads
    React.useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setDescription(lesson.shortDescription || "");
            setIsPreview(lesson.isPreview || false);
        }
    }, [lesson]);

    const handleSave = async () => {
        try {
            await updateLesson({
                title,
                shortDescription: description,
                isPreview,
                type: lesson?.type || "DOCUMENT",
            });
            onSaved?.();
        } catch (err) {
            console.error("Failed to save lesson:", err);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingFile(true);
            const uploaded = await uploadFile(file);

            // Add as resource
            await addResource({
                title: file.name,
                resourceType: "FILE",
                fileStorageId: uploaded.id,
            });
        } catch (err) {
            console.error("Failed to upload file:", err);
        } finally {
            setUploadingFile(false);
        }
    };

    const getResourceIcon = (type: ResourceType) => {
        if (type === "FILE") {
            return <FileText className="h-5 w-5 text-blue-600" />;
        } else if (type === "LINK" || type === "EMBED") {
            return <LinkIcon className="h-5 w-5 text-purple-600" />;
        }
        return <FileText className="h-5 w-5 text-gray-600" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Lesson Information
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter lesson title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Brief description of the lesson..."
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPreview"
                            checked={isPreview}
                            onChange={(e) => setIsPreview(e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                            htmlFor="isPreview"
                            className="text-sm font-medium text-gray-700"
                        >
                            Allow free preview
                        </label>
                    </div>
                </div>
            </div>

            {/* Video Upload Section (only for VIDEO type lessons) */}
            {lesson?.type === "VIDEO" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Video className="h-5 w-5 mr-2 text-purple-600" />
                            Video Content
                        </h3>
                    </div>
                    <VideoUpload
                        lessonId={lessonId}
                        currentVideoStatus={lesson.videoStatus}
                        onUploadComplete={() => {
                            // Refresh lesson to get updated status
                            window.location.reload();
                        }}
                    />
                </div>
            )}

            {/* Resources Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Resources & Materials
                    </h3>
                </div>

                {/* Upload buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploadingFile}
                        />
                        <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                            <Upload className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">
                                {uploadingFile ? "Uploading..." : "Upload File (PDF, DOC, etc)"}
                            </span>
                        </div>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowAddResource(!showAddResource)}
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                            Add Link/URL Resource
                        </span>
                    </button>
                </div>

                {/* Add resource form */}
                {showAddResource && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Add External Resource</h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Resource title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="resource-title"
                            />
                            <input
                                type="url"
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="resource-url"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const titleInput = document.getElementById('resource-title') as HTMLInputElement;
                                        const urlInput = document.getElementById('resource-url') as HTMLInputElement;
                                        if (titleInput.value && urlInput.value) {
                                            try {
                                                await addResource({
                                                    title: titleInput.value,
                                                    resourceType: "LINK",
                                                    externalUrl: urlInput.value,
                                                });
                                                titleInput.value = '';
                                                urlInput.value = '';
                                                setShowAddResource(false);
                                            } catch (err) {
                                                console.error("Failed to add resource:", err);
                                            }
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Add Resource
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddResource(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resources list */}
                {resources.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">No resources yet</p>
                        <p className="text-xs mt-1">
                            Upload files or add links to help students learn
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    {getResourceIcon(resource.resourceType)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {resource.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {resource.resourceType}
                                            {resource.fileSizeBytes &&
                                                ` • ${(resource.fileSizeBytes / 1024 / 1024).toFixed(2)} MB`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {resource.downloadUrl && (
                                        <a
                                            href={resource.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => deleteResource(resource.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quiz & Assignment Section */}
            {lesson && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                        Assessments
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                // Navigate to quiz creation
                                window.location.href = `/teacher/quizzes/create?lessonId=${lessonId}`;
                            }}
                            className="group relative overflow-hidden p-6 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-white"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <CheckSquare className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-base font-bold text-gray-900 mb-1">Create Quiz</p>
                                    <p className="text-sm text-gray-600">
                                        Add multiple-choice questions to test understanding
                                    </p>
                                    <div className="mt-3 flex items-center text-xs font-medium text-purple-600">
                                        <span>Go to Quiz Builder</span>
                                        <Plus className="h-3 w-3 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                // Navigate to assignment creation
                                window.location.href = `/teacher/assignments/create?lessonId=${lessonId}`;
                            }}
                            className="group relative overflow-hidden p-6 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-white"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-base font-bold text-gray-900 mb-1">Create Assignment</p>
                                    <p className="text-sm text-gray-600">
                                        Give students hands-on practice tasks
                                    </p>
                                    <div className="mt-3 flex items-center text-xs font-medium text-blue-600">
                                        <span>Go to Assignment Builder</span>
                                        <Plus className="h-3 w-3 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800">
                            <strong>💡 Tip:</strong> Add quizzes after important concepts and assignments for practical application. This helps reinforce learning!
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
