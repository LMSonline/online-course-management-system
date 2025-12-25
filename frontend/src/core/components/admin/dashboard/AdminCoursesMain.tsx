import { CheckCircle, XCircle } from "lucide-react";

type Props = {
  pendingCourses: any[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  stats?: any; // Thêm nếu muốn truyền stats cho số lượng course
};

export function AdminCoursesMain({ pendingCourses, selectedTab, setSelectedTab, stats }: Props) {
  // Nếu không truyền stats từ ngoài vào thì có thể mock tạm ở đây:
  const defaultStats = {
    courses: 0,
    pendingApproval: pendingCourses.length,
    activeCourses: 0,
    rejected: 16,
  };
  const _stats = stats || defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Course Approval</h2>
          <p className="text-gray-400">Review and approve courses submitted by instructors</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg font-medium transition-colors">
            Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Courses</p>
          <p className="text-2xl font-bold text-white">{_stats.courses}</p>
        </div>
        <div className="bg-[#12182b] border border-yellow-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-400">{_stats.pendingApproval}</p>
        </div>
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Published</p>
          <p className="text-2xl font-bold text-green-400">{_stats.activeCourses}</p>
        </div>
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-400">{_stats.rejected ?? 16}</p>
        </div>
      </div>

      {/* Pending Courses List */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Courses Pending Review</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {pendingCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-[#1a2237] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                    <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 text-xs rounded">Pending</span>
                  </div>
                  <p className="text-gray-400 mb-3">Instructor: {course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {course.category}</span>
                    <span>•</span>
                    <span>Submitted: {course.submittedDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#1a2237] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors">
                    Review Details
                  </button>
                  <button className="px-4 py-2 bg-green-900/20 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
