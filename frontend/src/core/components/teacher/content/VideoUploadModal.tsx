"use client";
import { useState, useEffect } from "react";
import { X, Upload, Video, Loader2, Play, Trash2, CheckCircle } from "lucide-react";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { lessonService } from "@/services/courses/content/lesson.service";
import { toast } from "sonner";

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: LessonResponse;
    onUploadComplete: () => void;
}

export const VideoUploadModal = ({
    isOpen,
    onClose,
    lesson,
    onUploadComplete,
}: VideoUploadModalProps) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [streamUrl, setStreamUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && lesson.videoObjectKey && lesson.videoStatus === "READY") {
            loadStreamUrl();
        }
    }, [isOpen, lesson]);

    const loadStreamUrl = async () => {
        try {
            const url = await lessonService.getVideoStreamingUrl(lesson.id);
            setStreamUrl(url);
        } catch (error: any) {
            console.error("Failed to load streaming URL:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            // Create local preview
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleUpload = async () => {
        if (!videoFile) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Step 1: Request upload URL
            toast.info("Preparing upload...");
            const { uploadUrl, objectKey, expiresInSeconds } = await lessonService.requestUploadUrl(lesson.id);

            // Step 2: Upload to S3
            toast.info("Uploading video...");
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 90; // Reserve 10% for completion
                    setUploadProgress(progress);
                }
            });

            await new Promise<void>((resolve, reject) => {
                xhr.open("PUT", uploadUrl);
                xhr.setRequestHeader("Content-Type", videoFile.type);

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Upload failed"));
                xhr.send(videoFile);
            });

            setUploadProgress(95);

            // Step 3: Get video duration
            const video = document.createElement("video");
            video.preload = "metadata";

            const duration = await new Promise<number>((resolve) => {
                video.onloadedmetadata = () => {
                    resolve(Math.round(video.duration));
                    URL.revokeObjectURL(video.src);
                };
                video.src = videoPreview!;
            });

            // Step 4: Complete upload
            toast.info("Finalizing upload...");
            await lessonService.uploadComplete(lesson.id, {
                objectKey,
                durationSeconds: duration,
            });

            setUploadProgress(100);
            toast.success("Video uploaded successfully! Processing will begin shortly.");

            // Clean up
            setVideoFile(null);
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
                setVideoPreview(null);
            }

            onUploadComplete();

            // Wait a bit to show success
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error(error?.message || "Failed to upload video");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteVideo = async () => {
        if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
            return;
        }

        try {
            await lessonService.deleteVideo(lesson.id);
            toast.success("Video deleted successfully");
            setStreamUrl(null);
            onUploadComplete();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete video");
        }
    };

    const clearSelection = () => {
        setVideoFile(null);
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Video Content
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                {lesson.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        disabled={isUploading}
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Current Video Status */}
                    {lesson.videoObjectKey && (
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Current Video
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${lesson.videoStatus === "READY"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            : lesson.videoStatus === "PROCESSING"
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                                                : lesson.videoStatus === "UPLOADED"
                                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                        }`}
                                >
                                    {lesson.videoStatus}
                                </span>
                            </div>

                            {lesson.videoStatus === "READY" && streamUrl && (
                                <div className="mb-3">
                                    <video
                                        controls
                                        className="w-full rounded-lg bg-black"
                                        src={streamUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {lesson.videoStatus === "PROCESSING" && (
                                <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Video is being processed to HLS format...
                                    </p>
                                </div>
                            )}

                            {lesson.videoStatus === "UPLOADED" && (
                                <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Video uploaded, waiting to process...
                                    </p>
                                </div>
                            )}

                            {lesson.videoStatus === "FAILED" && (
                                <div className="text-center py-8 text-red-600 dark:text-red-400">
                                    <p className="text-sm mb-3">Video processing failed</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Please upload a new video
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {lesson.durationSeconds && lesson.durationSeconds > 0 && (
                                        <span>
                                            Duration: {Math.floor(lesson.durationSeconds / 60)}:
                                            {(lesson.durationSeconds % 60).toString().padStart(2, "0")}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleDeleteVideo}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Video
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Upload New Video */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {lesson.videoObjectKey ? "Replace with New Video" : "Upload Video"}
                        </h3>

                        {/* File Selection */}
                        {!videoFile ? (
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="video-upload-input"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="video-upload-input"
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Choose Video File
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                                    Supported formats: MP4, MOV, AVI, MKV
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Maximum file size: 2GB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Video Preview */}
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {videoFile.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        {!isUploading && (
                                            <button
                                                onClick={clearSelection}
                                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {videoPreview && (
                                        <video
                                            controls
                                            className="w-full rounded-lg bg-black"
                                            src={videoPreview}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Uploading...
                                            </span>
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                {uploadProgress.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                {!isUploading && (
                                    <button
                                        onClick={handleUpload}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg inline-flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" />
                                        Upload Video
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> After uploading, the video will be automatically processed
                            to HLS format for optimal streaming. This may take a few minutes depending on video length.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Close"}
                    </button>
                </div>
            </div>
        </div>
    );
};
