import {
  Users, DollarSign, Star, Clock, MoreVertical, TrendingUp, Eye, Edit, AlertCircle, FileText
} from "lucide-react";

type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  status: CourseStatus;
  students: number;
  revenue: number;
  rating: number;
  reviews: number;
  chapters: number;
  lessons: number;
  duration: string;
  lastUpdated: string;
  price: number;
}

function getStatusBadge(status: CourseStatus) {
  const styles = {
    draft: 'bg-gray-700 text-gray-300',
    pending: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700',
    published: 'bg-green-900/30 text-green-400 border border-green-700',
    rejected: 'bg-red-900/30 text-red-400 border border-red-700'
  };
  const labels = {
    draft: 'Draft',
    pending: 'Pending Review',
    published: 'Published',
    rejected: 'Rejected'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all group">
      <div className="flex gap-6 p-6">
        {/* Thumbnail */}
        <div className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Course Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-[#00ff00] transition-colors">
                  {course.title}
                </h3>
                {getStatusBadge(course.status)}
              </div>
              <p className="text-sm text-gray-400">Last updated {course.lastUpdated}</p>
            </div>
            <div className="relative">
              <button className="p-2 hover:bg-[#1a2237] rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-6 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Students</div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{course.students.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Revenue</div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">${course.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Rating</div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{course.rating > 0 ? course.rating.toFixed(1) : 'N/A'}</span>
                {course.reviews > 0 && (
                  <span className="text-xs text-gray-500">({course.reviews})</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Content</div>
              <div className="font-semibold">
                {course.chapters} chapters · {course.lessons} lessons
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{course.duration}</span>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-auto">
            {course.status === 'published' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2237] hover:bg-[#1f2844] border border-gray-700 rounded-lg transition-colors text-sm">
                  <TrendingUp className="w-4 h-4" />
                  View Analytics
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2237] hover:bg-[#1f2844] border border-gray-700 rounded-lg transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </>
            )}
            {course.status === 'draft' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors text-sm">
                <Edit className="w-4 h-4" />
                Continue Editing
              </button>
            )}
            {course.status === 'pending' && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span>Waiting for admin approval</span>
              </div>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2237] hover:bg-[#1f2844] border border-gray-700 rounded-lg transition-colors text-sm ml-auto">
              <FileText className="w-4 h-4" />
              Manage Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
