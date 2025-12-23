'use client';

import { useState } from 'react';
import {
  ChevronRight,
  Eye,
  Send
} from 'lucide-react';

// Import các component đã tách
import CurriculumStatsBar from '@/core/components/instructor/create-course/course-builder/CurriculumStatsBar';
import CurriculumList from '@/core/components/instructor/create-course/course-builder/CurriculumList';
import CourseInfoSidebar from '@/core/components/instructor/create-course/course-builder/CourseInfoSidebar';
import PublishingChecklist from '@/core/components/instructor/create-course/course-builder/PublishingChecklist';
import QuickTips from '@/core/components/instructor/create-course/course-builder/QuickTips';
import AddChapterModal from '@/core/components/instructor/create-course/course-builder/AddChapterModal';
import AddLessonModal from '@/core/components/instructor/create-course/course-builder/AddLessonModal';

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

export default function CourseBuilderPage() {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Getting started with React fundamentals',
      expanded: true,
      lessons: [
        { id: 1, title: 'What is React?', type: 'video', duration: '10:30', status: 'completed' },
        { id: 2, title: 'Setting up development environment', type: 'video', duration: '15:20', status: 'completed' },
        { id: 3, title: 'Quiz: React Basics', type: 'quiz', status: 'draft' }
      ]
    },
    {
      id: 2,
      title: 'Components & Props',
      description: 'Learn about React components and props',
      expanded: false,
      lessons: []
    }
  ]);

  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const toggleChapter = (chapterId: number) => {
    setChapters(chapters.map(ch =>
      ch.id === chapterId ? { ...ch, expanded: !ch.expanded } : ch
    ));
  };

  const handleAddLesson = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setShowAddLessonModal(true);
  };

  // Hàm reload lại dữ liệu sau khi thêm lesson (giả lập, cần fetch lại thực tế)
  const handleLessonAdded = () => {
    // TODO: fetch lại chapters nếu dùng API thực tế
  };

  const getTotalLessons = () => {
    return chapters.reduce((total, ch) => total + ch.lessons.length, 0);
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    chapters.forEach(ch => {
      ch.lessons.forEach(lesson => {
        if (lesson.duration) {
          const [mins, secs] = lesson.duration.split(':').map(Number);
          totalMinutes += mins + (secs / 60);
        }
      });
    });
    return `${Math.floor(totalMinutes / 60)}h ${Math.floor(totalMinutes % 60)}m`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header
      <header className="bg-[#12182b] border-b border-gray-800">
        <div className="w-[95%] mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-[#00ff00]">LMS Instructor</h1>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-[#00ff00] transition-colors">Dashboard</a>
              <a href="#" className="text-gray-400 hover:text-[#00ff00] transition-colors">My Courses</a>
              <a href="#" className="text-white font-semibold">Course Builder</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2237] hover:bg-[#1f2844] border border-gray-700 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
              <Send className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="w-[95%] mx-auto py-8">
        {/* Breadcrumb */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span>My Courses</span>
          <ChevronRight className="w-4 h-4" />
          <span>React & TypeScript for Modern Web Apps</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Course Builder</span>
        </div> */}

        {/* Page Title */}
        <div className=" flex  justify-between">
          <h2 className="text-3xl font-bold mb-2">Course Builder</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2237] hover:bg-[#1f2844] border border-gray-700 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
              <Send className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>
        <p className="text-gray-400 mb-8 ">Organize your course content into chapters and lessons</p>


        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Course Curriculum */}
          <div className="col-span-2 space-y-6">
            {/* Stats Bar */}
            <CurriculumStatsBar
              chapters={chapters}
              getTotalLessons={getTotalLessons}
              getTotalDuration={getTotalDuration}
            />

            {/* Curriculum */}
            <CurriculumList
              chapters={chapters}
              setShowAddChapterModal={setShowAddChapterModal}
              toggleChapter={toggleChapter}
              handleAddLesson={handleAddLesson}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <CourseInfoSidebar />

            {/* Publishing Checklist */}
            <PublishingChecklist
              chapters={chapters}
              getTotalLessons={getTotalLessons}
            />

            {/* Quick Tips */}
            <QuickTips />
          </div>
        </div>
      </main>

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <AddChapterModal
          setShowAddChapterModal={setShowAddChapterModal}
        />
      )}

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <AddLessonModal
          setShowAddLessonModal={setShowAddLessonModal}
          selectedChapterId={selectedChapterId}
          onLessonAdded={handleLessonAdded}
        />
      )}
    </div>
  );
}
