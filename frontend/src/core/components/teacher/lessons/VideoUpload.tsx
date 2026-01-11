"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { lessonService } from "@/services/courses/content/lesson.service";
import { toast } from "sonner";
import Hls from "hls.js";

interface VideoUploadProps {
    lessonId: number;
    currentVideoStatus?: string | null;
    onUploadComplete?: () => void;
}

export function VideoUpload({ lessonId, currentVideoStatus, onUploadComplete }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [loadingStream, setLoadingStream] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load video stream if video is ready
    useEffect(() => {
        if (currentVideoStatus === "READY") {
            loadVideoStream();
        } else {
            // Reset nếu status không còn là READY
            setStreamUrl(null);
        }
    }, [currentVideoStatus, lessonId]);

    // --- FIX: Logic xử lý HLS Player giống hệt TeacherViewCoursePage ---
    useEffect(() => {
        if (!streamUrl || !videoRef.current) return;

        const video = videoRef.current;

        // Cleanup instance cũ
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // Trường hợp 1: Backend trả về playlist dạng Base64 Data URI
        if (streamUrl.startsWith("data:application/vnd.apple.mpegurl")) {
            const base64Data = streamUrl.split(",")[1];
            const playlistContent = atob(base64Data);

            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90,
                });

                hlsRef.current = hls;
                const blob = new Blob([playlistContent], { type: "application/vnd.apple.mpegurl" });
                const blobUrl = URL.createObjectURL(blob);

                hls.loadSource(blobUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // Tự động play hoặc để user bấm play
                    // video.play().catch(e => console.log("Auto-play prevented:", e));
                    console.log("Video manifest loaded");
                });

                // Xử lý lỗi (Quan trọng: Copy từ page view để player ổn định)
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS Error:", data);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("Network error, trying to recover...");
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log("Media error, trying to recover...");
                                hls.recoverMediaError();
                                break;
                            default:
                                console.log("Fatal error, cannot recover");
                                hls.destroy();
                                break;
                        }
                    }
                });

                return () => {
                    URL.revokeObjectURL(blobUrl);
                    hls.destroy();
                };
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Fallback cho Safari native
                video.src = streamUrl;
                video.addEventListener("loadedmetadata", () => {
                    // video.play().catch(e => console.log("Auto-play prevented:", e));
                });
            }
        } else {
            // Trường hợp 2: URL thường (mp4 hoặc m3u8 trực tiếp) -> FALLBACK QUAN TRỌNG ĐÃ BỊ THIẾU
            video.src = streamUrl;
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [streamUrl]);

    const loadVideoStream = async () => {
        try {
            setLoadingStream(true);
            const url = await lessonService.getVideoStreamingUrl(lessonId);
            setStreamUrl(url);
        } catch (err: any) {
            console.error("Failed to load video stream:", err);
            toast.error("Failed to load video");
        } finally {
            setLoadingStream(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            toast.error("Please select a video file");
            return;
        }

        // Validate file size (max 2GB)
        const maxSize = 2 * 1024 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size must be less than 2GB");
            return;
        }

        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleUpload = async () => {
        if (!videoFile) return;

        try {
            setUploading(true);
            setUploadProgress(0);

            // Step 1: Request upload URL
            toast.info("Preparing upload...");
            const { uploadUrl, fileKey } = await lessonService.requestUploadUrl(lessonId);

            // Step 2: Upload to S3
            toast.info("Uploading video...");
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(progress);
                }
            });

            await new Promise<void>((resolve, reject) => {
                xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                });

                xhr.addEventListener("error", () => reject(new Error("Upload failed")));
                xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

                xhr.open("PUT", uploadUrl);
                xhr.setRequestHeader("Content-Type", videoFile.type);
                xhr.send(videoFile);
            });

            // Step 3: Notify backend
            toast.info("Processing video...");
            await lessonService.uploadComplete(lessonId, {
                fileKey,
                fileName: videoFile.name,
                fileSize: videoFile.size,
            });

            toast.success("Video uploaded successfully! Processing in background.");
            setVideoFile(null);
            setPreviewUrl(null);
            setUploadProgress(0);
            onUploadComplete?.();
        } catch (err: any) {
            console.error("Upload failed:", err);
            toast.error(err.message || "Failed to upload video");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            await lessonService.deleteVideo(lessonId);
            toast.success("Video deleted successfully");
            setStreamUrl(null);
            onUploadComplete?.();
        } catch (err: any) {
            console.error("Failed to delete video:", err);
            toast.error("Failed to delete video");
        }
    };

    const getStatusBadge = () => {
        switch (currentVideoStatus) {
            case "UPLOADED":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Uploaded
                    </span>
                );
            case "PROCESSING":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing
                    </span>
                );
            case "READY":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                    </span>
                );
            case "FAILED":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {/* Current Video Status */}
            {currentVideoStatus && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Video Status</p>
                            <div className="mt-1">{getStatusBadge()}</div>
                        </div>
                    </div>
                    {currentVideoStatus === "READY" && (
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Delete Video
                        </button>
                    )}
                </div>
            )}

            {/* Video Player (if ready) */}
            {currentVideoStatus === "READY" && streamUrl && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {loadingStream ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-full"
                            playsInline
                        >
                            Your browser does not support video playback.
                        </video>
                    )}
                </div>
            )}

            {/* Upload Section */}
            {(!currentVideoStatus || currentVideoStatus === "FAILED") && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />

                    {!videoFile ? (
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Select Video
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                MP4, MOV, AVI up to 2GB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Preview */}
                            {previewUrl && (
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                    <video
                                        src={previewUrl}
                                        controls
                                        className="w-full h-full"
                                    />
                                </div>
                            )}

                            {/* File Info */}
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Video className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {videoFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setVideoFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    disabled={uploading}
                                    className="p-1 hover:bg-purple-100 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Upload Progress */}
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Uploading...</span>
                                        <span className="font-medium text-purple-600">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setVideoFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    disabled={uploading}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Video
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Processing Message */}
            {(currentVideoStatus === "UPLOADED" || currentVideoStatus === "PROCESSING") && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin mt-0.5" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-900">
                                Video is being processed
                            </h4>
                            <p className="mt-1 text-sm text-yellow-700">
                                This may take a few minutes depending on the video length. You can continue editing other content.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}