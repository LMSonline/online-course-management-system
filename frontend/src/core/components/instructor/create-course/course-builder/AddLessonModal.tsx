import React, { useState } from 'react';
import { Video, FileText, CheckSquare } from 'lucide-react';
import { createLesson } from '@/services/core/api';
import { useRouter } from 'next/navigation';

interface AddLessonModalProps {
  setShowAddLessonModal: (show: boolean) => void;
  selectedChapterId: number | null;
  onLessonAdded?: () => void;
}

const LESSON_TYPES = [
  { key: 'VIDEO', label: 'Video', icon: Video, color: '#00ff00' },
  { key: 'TEXT', label: 'Article', icon: FileText, color: '#60a5fa' },
  { key: 'QUIZ', label: 'Quiz', icon: CheckSquare, color: '#a78bfa' }
];

export default function AddLessonModal({
  setShowAddLessonModal,
  selectedChapterId,
  onLessonAdded
}: AddLessonModalProps) {
  const [lessonType, setLessonType] = useState<'VIDEO' | 'TEXT' | 'QUIZ'>('VIDEO');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedChapterId || !title.trim()) {
      setError('Please enter lesson title.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (lessonType === 'VIDEO') {
        router.push(`/instructor/courses/add-video-lesson?chapterId=${selectedChapterId}`);
        setShowAddLessonModal(false);
        return;
      }
      await createLesson(selectedChapterId, {
        type: lessonType,
        title: title.trim()
      });
      setShowAddLessonModal(false);
      if (onLessonAdded) onLessonAdded();
    } catch (e: any) {
      setError(e?.message || 'Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-8 max-w-lg w-full mx-4">
        <h3 className="text-2xl font-semibold mb-6">Add New Lesson</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Type</label>
            <div className="grid grid-cols-3 gap-3">
              {LESSON_TYPES.map((type) => {
                const Icon = type.icon;
                const selected = lessonType === type.key;
                return (
                  <button
                    key={type.key}
                    type="button"
                    className={`p-4 border ${selected ? 'border-2 border-[#00ff00] bg-[#00ff00]/10' : 'border-gray-700 hover:border-gray-600'} rounded-lg text-center`}
                    onClick={() => setLessonType(type.key as any)}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2`} style={{ color: selected ? type.color : '#888' }} />
                    <span className={`text-sm ${selected ? 'text-white' : 'text-gray-400'}`}>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Title</label>
            <input
              type="text"
              placeholder="e.g., Understanding React Hooks"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddLessonModal(false)}
            className="flex-1 py-3 border border-gray-700 hover:bg-[#1a2237] rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}
