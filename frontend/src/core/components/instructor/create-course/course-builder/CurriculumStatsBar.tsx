import React from 'react';

interface CurriculumStatsBarProps {
  chapters: any[];
  getTotalLessons: () => number;
  getTotalDuration: () => string;
}

export default function CurriculumStatsBar({ chapters, getTotalLessons, getTotalDuration }: CurriculumStatsBarProps) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-4 gap-6">
        <div>
          <div className="text-2xl font-bold text-[#00ff00]">{chapters.length}</div>
          <div className="text-sm text-gray-400">Chapters</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#00ff00]">{getTotalLessons()}</div>
          <div className="text-sm text-gray-400">Lessons</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#00ff00]">{getTotalDuration()}</div>
          <div className="text-sm text-gray-400">Total Duration</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-400">Draft</div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
      </div>
    </div>
  );
}
