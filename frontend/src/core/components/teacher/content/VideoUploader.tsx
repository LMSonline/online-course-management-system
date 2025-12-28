import { useState, useRef, useEffect } from "react";
import { Upload, Video, CheckCircle, XCircle, Loader2, Trash2, AlertCircle } from "lucide-react";
import { useVideoUpload } from "@/hooks/teacher/useVideoUpload";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { VideoPlayer } from "./VideoPlayer";
import { lessonService } from "@/services/courses/content/lesson.service";
import { toast } from "sonner";

interface VideoUploaderProps {
    lessonId: number;
    currentVideo?: {
        objectKey?: string;
        status?: "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
        videoUrl?: string;
    };
    onUploadSuccess?: (lesson: LessonResponse) => void;
    onUploadError?: (error: Error) => void;
    className?: string;
}

export function VideoUploader({
    lessonId,
    currentVideo,
    onUploadSuccess,
    onUploadError,
    className = "",
}: VideoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [streamingUrl, setStreamingUrl] = useState<string | null>(null);
    const [loadingStream, setLoadingStream] = useState(false);

    const { uploadVideo, deleteVideo, uploadState, resetUploadState } =
        useVideoUpload({
            lessonId,
            onSuccess: (lesson) => {
                setSelectedFile(null);
                onUploadSuccess?.(lesson);
            },
            onError: (error) => {
                onUploadError?.(error);
            },
        });

    // Load streaming URL when video is ready
    useEffect(() => {
        if (currentVideo?.status === "READY") {
            loadStreamingUrl();
        } else {
            setStreamingUrl(null);
        }
    }, [currentVideo?.status, lessonId]);

    const loadStreamingUrl = async () => {
        try {
            setLoadingStream(true);
            const url = await lessonService.getVideoStreamingUrl(lessonId);
            setStreamingUrl(url);
        } catch (error: any) {
            console.error("Failed to load video stream:", error);
            toast.error("Không thể tải video");
        } finally {
            setLoadingStream(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            resetUploadState();
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        await uploadVideo(selectedFile);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        resetUploadState();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteVideo = () => {
        deleteVideo();
        setShowDeleteConfirm(false);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const getVideoStatusDisplay = () => {
        if (!currentVideo?.status) return null;

        const statusConfig = {
            UPLOADED: {
                icon: <Loader2 className="w-5 h-5 animate-spin text-blue-500" />,
                text: "Đang tải lên...",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-200 dark:border-blue-800",
            },
            PROCESSING: {
                icon: <Loader2 className="w-5 h-5 animate-spin text-amber-500" />,
                text: "Đang xử lý video...",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                border: "border-amber-200 dark:border-amber-800",
            },
            READY: {
                icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
                text: "Video sẵn sàng",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                border: "border-emerald-200 dark:border-emerald-800",
            },
            FAILED: {
                icon: <XCircle className="w-5 h-5 text-red-500" />,
                text: "Xử lý video thất bại",
                bg: "bg-red-50 dark:bg-red-900/20",
                border: "border-red-200 dark:border-red-800",
            },
        };

        const config = statusConfig[currentVideo.status];

        return (
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${config.bg} ${config.border}`}>
                {config.icon}
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {config.text}
                    </p>
                    {currentVideo.status === "PROCESSING" && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Video đang được xử lý, có thể mất vài phút...
                        </p>
                    )}
                </div>
                {currentVideo.status === "READY" && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Xóa video"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                )}
            </div>
        );
    };

    const hasVideo = currentVideo?.objectKey;
    const isVideoReady = currentVideo?.status === "READY";

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Video Player - Show when READY */}
            {hasVideo && isVideoReady && (
                <div className="space-y-4">
                    {loadingStream ? (
                        <div className="relative bg-black aspect-video rounded-lg overflow-hidden flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                    ) : streamingUrl ? (
                        <VideoPlayer url={streamingUrl} autoPlay={false} />
                    ) : (
                        <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden flex items-center justify-center">
                            <div className="text-center text-white">
                                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-400" />
                                <p className="text-sm">Không thể tải video</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                Video sẵn sàng
                            </span>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa video
                        </button>
                    </div>
                </div>
            )}

            {/* Current Video Status (UPLOADING, PROCESSING, FAILED) */}
            {hasVideo && !isVideoReady && getVideoStatusDisplay()}

            {/* Upload Area */}
            {!hasVideo && !selectedFile && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploadState.isUploading}
                    />
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <Video className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                Upload Video
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Click để chọn video hoặc kéo thả file vào đây
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            Hỗ trợ MP4, MOV, AVI • Tối đa 500MB
                        </p>
                    </div>
                </div>
            )}

            {/* Selected File Preview */}
            {selectedFile && !uploadState.isUploading && uploadState.status === "idle" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {uploadState.isUploading && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate mb-1">
                                {selectedFile?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadState.progress}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 min-w-[45px] text-right">
                                    {uploadState.progress}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {uploadState.status === "requesting" && (
                            <p className="text-slate-600 dark:text-slate-400">
                                Đang chuẩn bị upload...
                            </p>
                        )}
                        {uploadState.status === "uploading" && (
                            <p className="text-slate-600 dark:text-slate-400">
                                Đang upload video lên server...
                            </p>
                        )}
                        {uploadState.status === "processing" && (
                            <p className="text-slate-600 dark:text-slate-400">
                                Đang xử lý video...
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Upload Error */}
            {uploadState.status === "error" && uploadState.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                                Upload thất bại
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {uploadState.error}
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Xóa video?
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteVideo}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
