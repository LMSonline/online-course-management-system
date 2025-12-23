"use client";
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import LessonInfoForm from '@/core/components/instructor/create-course/course-builder/video-lesson/LessonInfoForm';
import VideoUploadBox from '@/core/components/instructor/create-course/course-builder/video-lesson/VideoUploadBox';
import UploadGuidelines from '@/core/components/instructor/create-course/course-builder/video-lesson/UploadGuidelines';
import VideoInfoBox from '@/core/components/instructor/create-course/course-builder/video-lesson/VideoInfoBox';

export default function AddVideoLessonPage() {
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'requesting' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [objectKey, setObjectKey] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [chapterId, setChapterId] = useState<number>(1);

  // Lấy duration của video file
  const extractVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        resolve(Math.floor(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const duration = await extractVideoDuration(file);
      setDurationSeconds(duration);
    } else {
      alert('Please select a valid video file');
    }
  };

  // Step 1: Request presigned URL from backend
  const requestUploadUrl = async () => {
    try {
      setUploadStatus('requesting');
      const token = localStorage.getItem('accessToken') || '';
      const response = await fetch(`/api/v1/lessons/${lessonId}/request-upload-url`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.presignedUrl && data.objectKey) {
        setPresignedUrl(data.presignedUrl);
        setObjectKey(data.objectKey);
        return data.presignedUrl;
      } else {
        throw new Error('Failed to get presigned URL');
      }
    } catch (error) {
      console.error('Error requesting upload URL:', error);
      setUploadStatus('error');
      return null;
    }
  };

  // Step 2: Upload video to S3 using presigned URL
  const uploadVideoToS3 = async (url: string, file: File) => {
    try {
      setUploadStatus('uploading');
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          notifyUploadComplete();
        } else {
          setUploadStatus('error');
        }
      });
      xhr.addEventListener('error', () => {
        setUploadStatus('error');
      });
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadStatus('error');
    }
  };

  // Step 3: Notify server that upload is complete
  const notifyUploadComplete = async () => {
    try {
      setUploadStatus('processing');
      const token = localStorage.getItem('accessToken') || '';
      // API Call: POST /api/v1/lessons/{lessonId}/upload-complete
      const response = await fetch(`/api/v1/lessons/${lessonId}/upload-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          objectKey,
          durationSeconds
        })
      });
      if (response.ok) {
        setUploadStatus('completed');
        setUploadProgress(100);
      } else {
        throw new Error('Failed to confirm upload');
      }
    } catch (error) {
      console.error('Error notifying upload complete:', error);
      setUploadStatus('error');
    }
  };

  // Main upload handler
  const handleUpload = async () => {
    if (!videoFile || !lessonId) {
      alert('Please create a lesson first');
      return;
    }
    const url = await requestUploadUrl();
    if (!url) return;
    await uploadVideoToS3(url, videoFile);
  };

  // Create lesson first (before upload)
  const createLesson = async () => {
    try {
      const token = localStorage.getItem('accessToken') || '';
      const response = await fetch(`/api/v1/chapters/${chapterId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: lessonTitle,
          description: lessonDescription,
          type: 'VIDEO'
        })
      });
      const data = await response.json();
      if (data.id || data.lessonId) {
        setLessonId(data.id || data.lessonId);
        handleUpload();
      } else {
        throw new Error('Lesson creation failed');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      setUploadStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'uploading':
      case 'processing':
      case 'requesting': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'requesting': return 'Requesting upload URL...';
      case 'uploading': return `Uploading... ${uploadProgress}%`;
      case 'processing': return 'Processing video...';
      case 'completed': return 'Upload completed!';
      case 'error': return 'Upload failed. Please try again.';
      default: return 'Ready to upload';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <main className="w-[95%] mx-auto py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span>Course Builder</span>
          <ChevronRight className="w-4 h-4" />
          <span>Chapter {chapterId}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Add Video Lesson</span>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Add Video Lesson</h2>
          <p className="text-gray-400">Upload video content for your course</p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <LessonInfoForm
              chapterId={chapterId}
              setChapterId={setChapterId}
              lessonTitle={lessonTitle}
              setLessonTitle={setLessonTitle}
              lessonDescription={lessonDescription}
              setLessonDescription={setLessonDescription}
            />
            <VideoUploadBox
              videoFile={videoFile}
              handleFileSelect={handleFileSelect}
              uploadStatus={uploadStatus}
              uploadProgress={uploadProgress}
              createLesson={createLesson}
              lessonTitle={lessonTitle}
              chapterId={chapterId}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-gray-700 hover:bg-[#1a2237] rounded-lg transition-colors">
                Cancel
              </button>
              <button
                disabled={uploadStatus !== 'completed'}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00ff00] hover:bg-[#00dd00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-500 rounded-lg font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Save Lesson
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <UploadGuidelines />
            {videoFile && (
              <VideoInfoBox
                videoFile={videoFile}
                durationSeconds={durationSeconds}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
