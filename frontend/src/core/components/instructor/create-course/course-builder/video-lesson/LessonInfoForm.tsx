import React from 'react';
import { Video } from 'lucide-react';

export default function LessonInfoForm({
  chapterId,
  setChapterId,
  lessonTitle,
  setLessonTitle,
  lessonDescription,
  setLessonDescription,
}: {
  chapterId: number;
  setChapterId: (id: number) => void;
  lessonTitle: string;
  setLessonTitle: (v: string) => void;
  lessonDescription: string;
  setLessonDescription: (v: string) => void;
}) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Video className="w-5 h-5 text-[#00ff00]" />
        Lesson Information
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Chapter <span className="text-red-400">*</span>
          </label>
          <select
            value={chapterId}
            onChange={e => setChapterId(Number(e.target.value))}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]"
          >
            <option value={1}>Chapter 1</option>
            <option value={2}>Chapter 2</option>
            {/* TODO: lấy danh sách chapter động */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Lesson Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Introduction to React Hooks"
            value={lessonTitle}
            onChange={e => setLessonTitle(e.target.value)}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Lesson Description
          </label>
          <textarea
            rows={4}
            placeholder="Brief description of what students will learn in this lesson..."
            value={lessonDescription}
            onChange={e => setLessonDescription(e.target.value)}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
