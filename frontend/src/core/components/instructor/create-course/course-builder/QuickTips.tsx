import React from 'react';

export default function QuickTips() {
  return (
    <div className="bg-[#1a2237] border border-[#00ff00]/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-[#00ff00]">Quick Tips</h3>
      <ul className="space-y-2 text-sm text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00]">•</span>
          <span>Organize content into logical chapters</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00]">•</span>
          <span>Keep videos under 15 minutes</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00]">•</span>
          <span>Add quizzes to reinforce learning</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#00ff00]">•</span>
          <span>Include downloadable resources</span>
        </li>
      </ul>
    </div>
  );
}
