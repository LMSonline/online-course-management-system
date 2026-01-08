import { Users, BookOpen, Eye } from "lucide-react";

import { CourseResponse } from "@/services/courses/course.types";

interface Props {
  course: Pick<
    CourseResponse,
    "id" | "title" | "shortDescription" | "teacherName" | "categoryName"
  >;
  onReview: () => void;
}


export default function CourseCardWithFilter({ course, onReview }: Props) {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold">{course.title}</h3>
          <p className="text-gray-400 mt-2">
            {course.shortDescription}
          </p>

          <div className="flex gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.teacherName ?? "Unknown"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.categoryName ?? "N/A"}
            </span>
          </div>
        </div>

        <button
          onClick={onReview}
          className="flex items-center gap-2 text-[#00ff00]"
        >
          <Eye className="w-4 h-4" />
          Review
        </button>
      </div>
    </div>
  );
}
