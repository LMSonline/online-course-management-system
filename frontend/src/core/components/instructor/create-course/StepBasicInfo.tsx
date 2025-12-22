import { BookOpen, Info } from 'lucide-react';

interface StepBasicInfoProps {
  courseData: any;
  setCourseData: (data: any) => void;
  categories: Array<{ value: string; label: string; subcategories: string[] }>;

}

export default function StepBasicInfo({ courseData, setCourseData, categories }: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#00ff00]" />
          Basic Information
        </h3>
      </div>

      {/* Course Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Course Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Complete React & TypeScript Masterclass"
          value={courseData.title}
          onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
          className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
        />
        <p className="text-xs text-gray-500 mt-1">Keep it concise and descriptive (max 60 characters)</p>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Course Subtitle
        </label>
        <input
          type="text"
          placeholder="e.g., Build modern web apps from scratch with hands-on projects"
          value={courseData.subtitle}
          onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
          className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
        />
        <p className="text-xs text-gray-500 mt-1">A brief overview of what students will learn</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Course Description <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={6}
          placeholder="Describe what students will learn in detail. Include key topics, skills they'll gain, and why they should take this course..."
          value={courseData.description}
          onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
          className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00] resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {courseData.description.length}/2000 characters (minimum 200 recommended)
        </p>
      </div>

      {/* Category, Subcategory, Topic */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value, subcategory: '' })}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Subcategory
          </label>
          <select
            value={courseData.subcategory}
            onChange={(e) => setCourseData({ ...courseData, subcategory: e.target.value })}
            disabled={!courseData.category}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select subcategory</option>
            {courseData.category && categories
              .find(cat => cat.value === courseData.category)
              ?.subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Topic/Tags
          </label>
          <input
            type="text"
            placeholder="e.g., React, TypeScript"
            value={courseData.topic}
            onChange={(e) => setCourseData({ ...courseData, topic: e.target.value })}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
          />
        </div>
      </div>

      {/* Language & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Language <span className="text-red-400">*</span>
          </label>
          <select
            value={courseData.language}
            onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]"
          >
            <option value="">Select language</option>
            <option value="english">English</option>
            <option value="vietnamese">Vietnamese (Tiếng Việt)</option>
            <option value="spanish">Spanish (Español)</option>
            <option value="french">French (Français)</option>
            <option value="german">German (Deutsch)</option>
            <option value="chinese">Chinese (中文)</option>
            <option value="japanese">Japanese (日本語)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Difficulty Level <span className="text-red-400">*</span>
          </label>
          <select
            value={courseData.level}
            onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
            className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]"
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner - No prior experience needed</option>
            <option value="intermediate">Intermediate - Some experience required</option>
            <option value="advanced">Advanced - Expert level</option>
            <option value="all-levels">All Levels - Suitable for everyone</option>
          </select>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <strong className="text-blue-400">Tip:</strong> Choose the right category and level to help students find your course. A clear, compelling title and description will improve enrollment rates.
        </div>
      </div>
    </div>
  );
}