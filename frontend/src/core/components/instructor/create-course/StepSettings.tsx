import { Settings } from 'lucide-react';

interface StepSettingsProps {
  courseData: any;
  setCourseData: (data: any) => void;
  addArrayItem: (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience') => void;
  updateArrayItem: (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number, value: string) => void;
  removeArrayItem: (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number) => void;
}

export default function StepSettings({
  courseData, setCourseData, addArrayItem, updateArrayItem, removeArrayItem
}: StepSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#00ff00]" />
          Course Settings
        </h3>
        <p className="text-gray-400 mb-6">Additional information about your course</p>
      </div>

      {/* Course URL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Course URL Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">platform.com/course/</span>
          <input
            type="text"
            placeholder="react-typescript-masterclass"
            value={courseData.courseUrl}
            onChange={(e) => setCourseData({ ...courseData, courseUrl: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="flex-1 bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">This will be your course's unique URL</p>
      </div>

      {/* Max Students */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Maximum Students (Optional)
        </label>
        <input
          type="number"
          placeholder="Leave empty for unlimited"
          value={courseData.maxStudents}
          onChange={(e) => setCourseData({ ...courseData, maxStudents: e.target.value })}
          className="w-full bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
        />
        <p className="text-xs text-gray-500 mt-1">Limit the number of students who can enroll</p>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Course Requirements
        </label>
        <p className="text-xs text-gray-500 mb-3">What students need to know before taking this course</p>
        {courseData.requirements.map((req: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., Basic JavaScript knowledge"
              value={req}
              onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
              className="flex-1 bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
            />
            {courseData.requirements.length > 1 && (
              <button
                onClick={() => removeArrayItem('requirements', index)}
                className="p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('requirements')}
          className="text-sm text-[#00ff00] hover:text-[#00dd00] mt-2"
        >
          + Add more requirement
        </button>
      </div>

      {/* What You Will Learn */}
      <div>
        <label className="block text-sm font-medium mb-2">
          What Students Will Learn
        </label>
        <p className="text-xs text-gray-500 mb-3">Key learning outcomes and skills students will gain</p>
        {courseData.whatYouWillLearn.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., Build full-stack web applications"
              value={item}
              onChange={(e) => updateArrayItem('whatYouWillLearn', index, e.target.value)}
              className="flex-1 bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
            />
            {courseData.whatYouWillLearn.length > 1 && (
              <button
                onClick={() => removeArrayItem('whatYouWillLearn', index)}
                className="p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('whatYouWillLearn')}
          className="text-sm text-[#00ff00] hover:text-[#00dd00] mt-2"
        >
          + Add more learning outcome
        </button>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Target Audience
        </label>
        <p className="text-xs text-gray-500 mb-3">Who is this course for?</p>
        {courseData.targetAudience.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., Aspiring web developers"
              value={item}
              onChange={(e) => updateArrayItem('targetAudience', index, e.target.value)}
              className="flex-1 bg-[#1a2237] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
            />
            {courseData.targetAudience.length > 1 && (
              <button
                onClick={() => removeArrayItem('targetAudience', index)}
                className="p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('targetAudience')}
          className="text-sm text-[#00ff00] hover:text-[#00dd00] mt-2"
        >
          + Add more audience type
        </button>
      </div>
    </div>
  );
}