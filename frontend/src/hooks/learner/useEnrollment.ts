// Hooks cho enrollment APIs của learner

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { learnerEnrollmentService } from '../../services/learner/enrollmentService';
import { learnerCourseService } from '../../services/learner/courseService';
import type { MyCourse } from '@/lib/learner/dashboard/types';
import type { EnrollmentResponse } from '../../lib/learner/enrollment/enrollments';


/** Lấy danh sách enrollment của student, kèm chi tiết khoá học */
export function useEnrollments(page: number, size: number) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const studentId = user?.profile?.studentId;
      if (!studentId) return;
      setIsLoading(true);
      try {
        // Lấy danh sách enrollment (có phân trang)
        const enrollmentsRes = await learnerEnrollmentService.getEnrollments(studentId, page, size);
        const items: any[] = enrollmentsRes.items ?? enrollmentsRes.enrollments ?? [];
        setTotal(enrollmentsRes.totalItems ?? items.length);
        // Lấy chi tiết khoá học cho từng courseId
        const coursePromises = items.map((enrollment: any) => learnerCourseService.getCourseById(enrollment.courseId));
        const courseDetails = await Promise.all(coursePromises);
        // Map sang MyCourse, có thể lấy thêm thông tin enrollment nếu cần
        const mapped = courseDetails.map((course: any, idx: number) => {
          const enrollment = items[idx];
          return {
            id: String(course.id),
            courseId: enrollment.courseId, // thêm trường này để so sánh chuẩn
            slug: String(course.slug || course.id),
            title: course.title,
            instructor: String(course.teacherName || "Unknown"),
            thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
            thumbnail: course.thumbnailUrl,
            progress: enrollment.completionPercentage ?? 0,
            lastViewed: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "-",
            level: (course.difficulty === 'BEGINNER' ? 'Beginner' : course.difficulty === 'INTERMEDIATE' ? 'Intermediate' : 'Advanced') as 'Beginner' | 'Intermediate' | 'Advanced',
            category: String(course.categoryName || ""),
            rating: course.rating ?? 0,
          };
        });
        setCourses(mapped);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.profile?.studentId, page, size]);

  return { courses, total, isLoading };
}

/** Lấy chi tiết enrollment */
export function useEnrollmentDetail(enrollmentId: number) {
  return useQuery<EnrollmentResponse>({
    queryKey: ['learner-enrollment-detail', enrollmentId],
    queryFn: () => learnerEnrollmentService.getEnrollmentDetail(enrollmentId),
    enabled: !!enrollmentId,
  });
}

/** Đăng ký khoá học */
export function useEnrollCourse() {
  return useMutation({
    mutationFn: ({ studentId, courseId, courseVersionId }: { studentId: number; courseId: number; courseVersionId: number }) =>
      learnerEnrollmentService.enrollCourse(studentId, courseId, courseVersionId),
  });
}

/** Huỷ đăng ký khoá học */
export function useCancelEnrollment() {
  return useMutation({
    mutationFn: (enrollmentId: number) => learnerEnrollmentService.cancelEnrollment(enrollmentId),
  });
}
