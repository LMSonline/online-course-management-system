import React from 'react';

interface AddChapterModalProps {
  setShowAddChapterModal: (show: boolean) => void;
}

export default function AddChapterModal({ setShowAddChapterModal }: AddChapterModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-8 max-w-lg w-full mx-4">
        <h3 className="text-2xl font-semibold mb-6">Add New Chapter</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Chapter Title</label>
            <input
              type="text"
              placeholder="e.g., Advanced React Patterns"
              className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of this chapter..."
              className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00] resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddChapterModal(false)}
            className="flex-1 py-3 border border-gray-700 hover:bg-[#1a2237] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
            Add Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
