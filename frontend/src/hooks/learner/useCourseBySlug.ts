// Hook: useCourseBySlug (lấy chi tiết khoá học public cho learner)
import { useQuery } from '@tanstack/react-query';
import { learnerCourseService } from '../../services/learner/courseService';
import { Course } from '../../lib/learner/course/courses';

/**
 * Hook lấy chi tiết khoá học public cho learner theo slug
 */
export function useCourseBySlug(slug: string) {
  return useQuery<Course>({
    queryKey: ['learner-course', slug],
    queryFn: () => learnerCourseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}
