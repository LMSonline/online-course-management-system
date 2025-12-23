import React from 'react';
import { Upload, FileVideo, Play, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function VideoUploadBox({
  videoFile,
  handleFileSelect,
  uploadStatus,
  uploadProgress,
  createLesson,
  lessonTitle,
  chapterId,
  getStatusColor,
  getStatusText,
}: {
  videoFile: File | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadStatus: string;
  uploadProgress: number;
  createLesson: () => void;
  lessonTitle: string;
  chapterId: number;
  getStatusColor: () => string;
  getStatusText: () => string;
}) {
  const [showFile, setShowFile] = React.useState(true);

  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Upload className="w-5 h-5 text-[#00ff00]" />
        Video Upload
      </h3>
      {!videoFile ? (
        <label className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-[#00ff00] transition-colors cursor-pointer block">
          <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-white mb-2">Click to upload video</p>
          <p className="text-sm text-gray-400 mb-4">
            Supported formats: MP4, MOV, AVI (Max 2GB)
          </p>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button className="px-6 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
            Choose File
          </button>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-[#00ff00]/10 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-[#00ff00]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{videoFile.name}</h4>
                  <p className="text-sm text-gray-400">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {uploadStatus === 'idle' && (
                <button
                  onClick={() => setShowFile(false)}
                  className="p-2 hover:bg-[#1f2844] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            {uploadStatus !== 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={getStatusColor()}>{getStatusText()}</span>
                  {uploadStatus === 'uploading' && (
                    <span className="text-gray-400">{uploadProgress}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      uploadStatus === 'completed' ? 'bg-green-400' :
                      uploadStatus === 'error' ? 'bg-red-400' :
                      'bg-[#00ff00]'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {uploadStatus === 'idle' && (
            <button
              onClick={createLesson}
              disabled={!lessonTitle || !chapterId}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#00ff00] hover:bg-[#00dd00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-500 rounded-lg font-medium transition-colors"
            >
              <Upload className="w-5 h-5" />
              Start Upload
            </button>
          )}
          {uploadStatus === 'completed' && (
            <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-400 mb-1">Upload Successful!</h4>
                <p className="text-sm text-gray-300">
                  Your video is being processed. It will be available in your course shortly.
                </p>
              </div>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-400 mb-1">Upload Failed</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Something went wrong during the upload. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-red-400 hover:text-red-300 font-medium"
                >
                  Retry Upload
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
