import React from 'react';
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, Video, FileText, CheckSquare, BookOpen } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration?: string;
  status: 'draft' | 'completed';
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  expanded: boolean;
}

interface CurriculumListProps {
  chapters: Chapter[];
  setShowAddChapterModal: (show: boolean) => void;
  toggleChapter: (chapterId: number) => void;
  handleAddLesson: (chapterId: number) => void;
}

export default function CurriculumList({
  chapters,
  setShowAddChapterModal,
  toggleChapter,
  handleAddLesson
}: CurriculumListProps) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Course Curriculum</h3>
        <button
          onClick={() => setShowAddChapterModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </button>
      </div>
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border border-gray-700 rounded-lg overflow-hidden">
            {/* Chapter Header */}
            <div className="bg-[#1a2237] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {chapter.expanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{chapter.title}</h4>
                    <p className="text-sm text-gray-400">{chapter.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{chapter.lessons.length} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#1f2844] rounded transition-colors">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-[#1f2844] rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
            {/* Lessons List */}
            {chapter.expanded && (
              <div className="bg-[#12182b]">
                {chapter.lessons.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-4 hover:bg-[#1a2237] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-[#1a2237] rounded flex items-center justify-center">
                              {lesson.type === 'video' && <Video className="w-4 h-4 text-[#00ff00]" />}
                              {lesson.type === 'text' && <FileText className="w-4 h-4 text-blue-400" />}
                              {lesson.type === 'quiz' && <CheckSquare className="w-4 h-4 text-purple-400" />}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-white">{lesson.title}</h5>
                              <div className="flex items-center gap-3 mt-1">
                                {lesson.duration && (
                                  <span className="text-xs text-gray-400">{lesson.duration}</span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  lesson.status === 'completed' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                  {lesson.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-[#1f2844] rounded transition-colors">
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-[#1f2844] rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-400 mb-4">No lessons yet</p>
                  </div>
                )}
                {/* Add Lesson Button */}
                <div className="p-4 border-t border-gray-800">
                  <button
                    onClick={() => handleAddLesson(chapter.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-700 hover:border-[#00ff00] text-gray-400 hover:text-[#00ff00] rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lesson
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {chapters.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No chapters yet. Start building your course!</p>
            <button
              onClick={() => setShowAddChapterModal(true)}
              className="px-6 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors"
            >
              Add First Chapter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
