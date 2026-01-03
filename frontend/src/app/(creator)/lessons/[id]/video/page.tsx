"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLessonDetail } from "@/hooks/lesson/useLessonDetail";
import { useGetLessonUploadUrl, useCompleteVideoUploadMutation } from "@/hooks/creator/useVideoUpload";
import { Loader2, ArrowLeft, Upload, CheckCircle2, AlertCircle, Video } from "lucide-react";
import { toast } from "sonner";

/**
 * LessonVideoUploadFlowScreen
 * Route: /lessons/:id/video
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Flow:
 * 1. GET /lessons/:id (LESSON_GET_BY_ID) - get lesson detail
 * 2. User selects video file
 * 3. POST /lessons/:id/video/upload-url (LESSON_GET_VIDEO_UPLOAD_URL) - get presigned URL
 * 4. PUT file to presigned URL with progress tracking
 * 5. POST /lessons/:id/video/upload-complete (LESSON_VIDEO_UPLOAD_COMPLETE_ACTION) - complete upload
 */
export default function LessonVideoUploadFlowScreen({
  params,
}: {
  params: { id: string };
}) {
  const lessonId = parseInt(params.id, 10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "getting-url" | "uploading" | "completing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: lesson, isLoading: isLoadingLesson, error: lessonError } = useLessonDetail(lessonId);
  const { mutate: getUploadUrl, isPending: isGettingUrl } = useGetLessonUploadUrl();
  const { mutate: completeUpload, isPending: isCompleting } = useCompleteVideoUploadMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (e.g., max 2GB)
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      toast.error("File size must be less than 2GB");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("idle");
    setErrorMessage(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile || !lesson) return;

    setUploadStatus("getting-url");
    setErrorMessage(null);

    // Step 1: Get upload URL
    getUploadUrl(lessonId, {
      onSuccess: async (uploadData) => {
        setUploadStatus("uploading");

        try {
          // Step 2: Upload file to presigned URL using PUT
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              setUploadProgress(percentComplete);
            }
          });

          // Handle upload completion
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              // Step 3: Complete upload
              setUploadStatus("completing");

              // Get video duration (simplified - in real app, might need to extract from video)
              const video = document.createElement("video");
              video.preload = "metadata";
              video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const durationSeconds = Math.floor(video.duration);

                completeUpload(
                  {
                    lessonId,
                    payload: {
                      objectKey: uploadData.objectKey,
                      durationSeconds,
                    },
                  },
                  {
                    onSuccess: () => {
                      setUploadStatus("success");
                      setSelectedFile(null);
                      setUploadProgress(0);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    },
                    onError: (error) => {
                      setUploadStatus("error");
                      setErrorMessage(error.message || "Failed to complete upload");
                    },
                  }
                );
              };

              video.onerror = () => {
                // If duration extraction fails, use 0 or estimate
                completeUpload(
                  {
                    lessonId,
                    payload: {
                      objectKey: uploadData.objectKey,
                      durationSeconds: 0, // Will be updated later or by backend
                    },
                  },
                  {
                    onSuccess: () => {
                      setUploadStatus("success");
                      setSelectedFile(null);
                      setUploadProgress(0);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    },
                    onError: (error) => {
                      setUploadStatus("error");
                      setErrorMessage(error.message || "Failed to complete upload");
                    },
                  }
                );
              };

              video.src = URL.createObjectURL(selectedFile);
            } else {
              setUploadStatus("error");
              setErrorMessage(`Upload failed with status ${xhr.status}`);
            }
          });

          xhr.addEventListener("error", () => {
            setUploadStatus("error");
            setErrorMessage("Upload failed. Please try again.");
          });

          xhr.open("PUT", uploadData.uploadUrl);
          xhr.setRequestHeader("Content-Type", selectedFile.type);
          xhr.send(selectedFile);
        } catch (error) {
          setUploadStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Upload failed");
        }
      },
      onError: (error) => {
        setUploadStatus("error");
        setErrorMessage(error.message || "Failed to get upload URL");
      },
    });
  };

  if (isLoadingLesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Lesson not found
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {lessonError instanceof Error ? lessonError.message : "The lesson you're looking for doesn't exist."}
          </p>
          <Link
            href="/teacher/courses"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (lesson.type !== "VIDEO") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            This lesson is not a video lesson
          </h2>
          <p className="text-yellow-600 dark:text-yellow-300 text-sm">
            Video upload is only available for VIDEO type lessons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href={`/courses/${lesson.chapterId}/versions`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Versions
      </Link>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Lesson: {lesson.title}
        </p>

        {/* File Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Video File</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[var(--brand-600)] transition">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
              disabled={uploadStatus === "uploading" || uploadStatus === "completing" || uploadStatus === "getting-url"}
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Video className="h-16 w-16 text-gray-400" />
              <div>
                <span className="text-[var(--brand-600)] font-medium">Click to select</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">or drag and drop</span>
              </div>
              <p className="text-sm text-gray-500">MP4, MOV, AVI up to 2GB</p>
            </label>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadProgress(0);
                    setUploadStatus("idle");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {(uploadStatus === "uploading" || uploadStatus === "completing") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {uploadStatus === "uploading" ? "Uploading..." : "Completing upload..."}
              </span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[var(--brand-600)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                Video uploaded successfully!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadStatus === "error" && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={
              !selectedFile ||
              uploadStatus === "uploading" ||
              uploadStatus === "completing" ||
              uploadStatus === "getting-url" ||
              uploadStatus === "success"
            }
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(uploadStatus === "getting-url" || uploadStatus === "uploading" || uploadStatus === "completing") ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {uploadStatus === "getting-url" && "Getting upload URL..."}
                {uploadStatus === "uploading" && "Uploading..."}
                {uploadStatus === "completing" && "Completing..."}
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload Video
              </>
            )}
          </button>

          {lesson.videoStatus && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current status: <span className="font-medium">{lesson.videoStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

