import React from 'react';

export default function VideoInfoBox({
  videoFile,
  durationSeconds,
}: {
  videoFile: File;
  durationSeconds: number | null;
}) {
  return (
    <div className="bg-[#1a2237] border border-[#00ff00]/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-[#00ff00]">Video Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Filename:</span>
          <span className="text-white font-medium truncate ml-2">{videoFile.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Size:</span>
          <span className="text-white font-medium">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className="text-white font-medium">{videoFile.type}</span>
        </div>
        {durationSeconds && (
          <div className="flex justify-between">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white font-medium">{durationSeconds} seconds</span>
          </div>
        )}
      </div>
    </div>
  );
}
