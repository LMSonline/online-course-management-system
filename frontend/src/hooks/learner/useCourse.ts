"use client";
import { learnerProgressService } from '../../services/learner/progressService';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
/**
 * Lấy danh sách khoá học student đã đăng ký kèm progressPercent
 */
export function useStudentCoursesWithProgress() {
  const { user } = useAuth();
  const [coursesWithProgress, setCoursesWithProgress] = useState<Array<any>>([]);
  // Lấy studentId đúng từ user
  const studentId = user?.accountId;
  const { data: courseList, isLoading } = useCourses({ studentId });

  useEffect(() => {
    async function fetchProgress() {
      if (!courseList || !courseList.items || !studentId) return;
      const results = await Promise.all(
        (courseList.items as Array<any>).map(async (course: any) => {
          try {
            const progress = await learnerProgressService.getCourseProgress(studentId, course.id);
            return {
              ...course,
              progressPercent: progress.progressPercent ?? 0,
            };
          } catch {
            return {
              ...course,
              progressPercent: 0,
            };
          }
        })
      );
      setCoursesWithProgress(results);
    }
    fetchProgress();
  }, [courseList, studentId]);

  return { data: coursesWithProgress, isLoading };
}
// Hooks liên quan đến course cho learner
import { useQuery } from '@tanstack/react-query';
import { learnerCourseService } from '../../services/learner/courseService';
import { Course, CourseListResponse } from '../../lib/learner/course/courses';

/**
 * Lấy danh sách khoá học public cho learner
 */
export function useCourses(params?: Record<string, any>) {
  return useQuery<CourseListResponse>({
    queryKey: ['learner-courses', params],
    queryFn: () => learnerCourseService.getCourses(params),
  });
}

/**
 * Lấy chi tiết khoá học public theo slug cho learner
 */
export function useCourseBySlug(slug: string) {
  return useQuery<Course>({
    queryKey: ['learner-course', slug],
    queryFn: () => learnerCourseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Tìm kiếm khoá học public cho learner
 */
export function useSearchCourses(params?: Record<string, any>) {
  return useQuery<CourseListResponse>({
    queryKey: ['learner-search-courses', params],
    queryFn: () => learnerCourseService.searchCourses(params),
  });
}
