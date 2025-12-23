import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function UploadGuidelines() {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-[#00ff00]" />
        Upload Guidelines
      </h3>
      <ul className="space-y-3 text-sm text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00] mt-1">•</span>
          <span>Video resolution: 1080p (1920x1080) recommended</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00] mt-1">•</span>
          <span>Max file size: 2GB per video</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00] mt-1">•</span>
          <span>Supported formats: MP4, MOV, AVI</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00] mt-1">•</span>
          <span>Keep videos under 15 minutes for better engagement</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00] mt-1">•</span>
          <span>Use clear audio with minimal background noise</span>
        </li>
      </ul>
    </div>
  );
}
