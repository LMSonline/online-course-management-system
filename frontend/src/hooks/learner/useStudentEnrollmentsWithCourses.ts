// Hook: useStudentEnrollmentsWithCourses
// Lấy danh sách khoá học student đã đăng ký (có phân trang), trả về dạng MyCourse[]

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { learnerEnrollmentService } from "@/services/learner/enrollmentService";
import { learnerCourseService } from "@/services/learner/courseService";
import type { MyCourse } from "@/lib/learner/dashboard/types";
// Định nghĩa lại type cho CourseResponse đúng backend
type CourseResponse = {
  id: number;
  title: string;
  slug?: string;
  teacherName?: string;
  difficulty?: string;
  categoryName?: string;
  thumbnailUrl?: string;
};

export function useStudentEnrollmentsWithCourses(page: number, size: number) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user?.accountId) return;
      setIsLoading(true);
      try {
        // Lấy danh sách enrollment (có phân trang)
        const enrollmentsRes = await learnerEnrollmentService.getEnrollments(user.accountId, page, size);
        setTotal(enrollmentsRes.totalItems ?? enrollmentsRes.enrollments.length);
        const courseIds = enrollmentsRes.enrollments.map((e) => e.courseId);
        // Lấy chi tiết khoá học cho từng courseId
        const coursePromises = courseIds.map((id) => learnerCourseService.getCourseById(id));
        const courseDetails = await Promise.all(coursePromises);
        // Map sang MyCourse
        const mapped = courseDetails.map((course: CourseResponse) => ({
          id: String(course.id),
          slug: String(course.slug || course.id),
          title: course.title,
          instructor: String(course.teacherName || "Unknown"),
          thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
          thumbnailUrl: course.thumbnailUrl,
          progress: 0,
          lastViewed: "-",
          level: (course.difficulty === 'BEGINNER' ? 'Beginner' : course.difficulty === 'INTERMEDIATE' ? 'Intermediate' : 'Advanced') as 'Beginner' | 'Intermediate' | 'Advanced',
          category: String(course.categoryName || ""),
          rating: 0,
        }));
        setCourses(mapped);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.accountId, page, size]);

  return { courses, total, isLoading };
}
