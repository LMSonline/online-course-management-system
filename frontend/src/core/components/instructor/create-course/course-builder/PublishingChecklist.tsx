import React from 'react';
import { CheckSquare } from 'lucide-react';

interface PublishingChecklistProps {
  chapters: any[];
  getTotalLessons: () => number;
}

export default function PublishingChecklist({ chapters, getTotalLessons }: PublishingChecklistProps) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Publishing Checklist</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckSquare className="w-5 h-5 text-[#00ff00] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="text-white font-medium">Basic information</div>
            <div className="text-gray-400 text-xs">Title, description, category</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 border-2 border-gray-700 rounded flex-shrink-0 mt-0.5"></div>
          <div className="text-sm">
            <div className="text-white font-medium">Add at least 3 chapters</div>
            <div className="text-gray-400 text-xs">Current: {chapters.length}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 border-2 border-gray-700 rounded flex-shrink-0 mt-0.5"></div>
          <div className="text-sm">
            <div className="text-white font-medium">Add at least 10 lessons</div>
            <div className="text-gray-400 text-xs">Current: {getTotalLessons()}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 border-2 border-gray-700 rounded flex-shrink-0 mt-0.5"></div>
          <div className="text-sm">
            <div className="text-white font-medium">Upload course thumbnail</div>
            <div className="text-gray-400 text-xs">1280x720 recommended</div>
          </div>
        </div>
      </div>
    </div>
  );
}
