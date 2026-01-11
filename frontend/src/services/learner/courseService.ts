import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Course, CourseListResponse } from '@/lib/learner/course/courses';

const COURSE_PUBLIC_PREFIX = '/courses';

export const learnerCourseService = {
    /**
     * Lấy chi tiết khoá học public theo id
     */
    getCourseById: async (id: number): Promise<Course> => {
      const response = await axiosClient.get(`${COURSE_PUBLIC_PREFIX}/${id}`);
      return unwrapResponse(response);
    },
  /**
   * Lấy danh sách khoá học public (không cần đăng nhập)
   */
  getCourses: async (params?: Record<string, any>): Promise<CourseListResponse> => {
    const response = await axiosClient.get(COURSE_PUBLIC_PREFIX, { params });
    return unwrapResponse(response);
  },

  /**
   * Lấy chi tiết khoá học public theo slug
   */
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const response = await axiosClient.get(`${COURSE_PUBLIC_PREFIX}/${slug}`);
    return unwrapResponse(response);
  },

  /**
   * Tìm kiếm khoá học public
   */
  searchCourses: async (params?: Record<string, any>): Promise<CourseListResponse> => {
    const response = await axiosClient.get(`${COURSE_PUBLIC_PREFIX}/search`, { params });
    return unwrapResponse(response);
  },
};
