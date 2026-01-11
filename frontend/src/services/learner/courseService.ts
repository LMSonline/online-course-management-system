// CourseService for learner (student)
// API public: /api/v1/public/courses, /public/courses/{slug}, /public/courses/search

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Course, CourseListResponse } from '@/lib/learner/course/courses';

const COURSE_PUBLIC_PREFIX = '/api/v1/public/courses';

export const learnerCourseService = {
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
