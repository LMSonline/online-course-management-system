"use client";

import { Search, User, BookOpen, X } from "lucide-react";

interface CertificateFiltersProps {
  studentId?: number;
  courseId?: number;
  onStudentIdChange: (id?: number) => void;
  onCourseIdChange: (id?: number) => void;
}

export function CertificateFilters({
  studentId,
  courseId,
  onStudentIdChange,
  onCourseIdChange,
}: CertificateFiltersProps) {
  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <h3 className="text-white font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student ID Filter */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Student ID
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter student ID..."
              value={studentId ?? ""}
              onChange={(e) =>
                onStudentIdChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {studentId && (
              <button
                onClick={() => onStudentIdChange(undefined)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Course ID Filter */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            <BookOpen className="w-4 h-4 inline mr-1" />
            Course ID
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter course ID..."
              value={courseId ?? ""}
              onChange={(e) =>
                onCourseIdChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full bg-[#141d2b] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {courseId && (
              <button
                onClick={() => onCourseIdChange(undefined)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(studentId || courseId) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-sm">Active filters:</span>
            {studentId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                <User className="w-3 h-3" />
                Student #{studentId}
              </span>
            )}
            {courseId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm">
                <BookOpen className="w-3 h-3" />
                Course #{courseId}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
