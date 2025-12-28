import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { RejectRequest } from "../account/account.types";
import {
  CourseRequest,
  CourseUpdateRequest,
  CourseResponse,
  CourseDetailResponse,
} from "./course.types";

const COURSE_PREFIX = "/courses";
const TEACHER_COURSE_PREFIX = "/teacher/courses";
const ADMIN_COURSE_PREFIX = "/admin/courses";

export const courseService = {
  /**
   * Create a new course (COURSE_CREATE)
   * Contract Key: COURSE_CREATE
   * Endpoint: POST /api/v1/teacher/courses
   */
  createCourse: async (
    payload: CourseRequest
  ): Promise<CourseDetailResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseDetailResponse>>(
      TEACHER_COURSE_PREFIX,
      payload,
      {
        contractKey: CONTRACT_KEYS.COURSE_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  uploadThumbnail: async (
    courseId: number,
    file: File
  ): Promise<CourseDetailResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResponse<CourseDetailResponse>>(
      `${TEACHER_COURSE_PREFIX}/${courseId}/thumbnail`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get course by slug
   * Contract Key: COURSE_GET_DETAIL
   */
  getCourseBySlug: async (slug: string): Promise<CourseDetailResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseDetailResponse>>(
      `${COURSE_PREFIX}/${slug}`,
      {
        contractKey: CONTRACT_KEYS.COURSE_GET_DETAIL,
      }
    );

    return unwrapResponse(response, CONTRACT_KEYS.COURSE_GET_DETAIL);
  },

  /**
   * Get all active courses
   * Contract Key: COURSE_GET_LIST
   * Supports: page, size, q (search), sort, category (categorySlug)
   */
  getCoursesActive: async (
    params?: {
      page?: number;
      size?: number;
      q?: string;
      sort?: string;
      category?: string;
      filter?: string;
    }
  ): Promise<PageResponse<CourseResponse>> => {
    const queryParams: Record<string, any> = {};
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.size !== undefined) queryParams.size = params.size;
    if (params?.q) queryParams.q = params.q;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.category) queryParams.category = params.category;
    if (params?.filter) queryParams.filter = params.filter;

    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseResponse>>
    >(COURSE_PREFIX, {
      params: queryParams,
      contractKey: CONTRACT_KEYS.COURSE_GET_LIST,
    });

    return unwrapResponse(response, CONTRACT_KEYS.COURSE_GET_LIST);
  },

  /**
   * Get all courses (Admin only)
   */
  getAllCourses: async (
    page?: number,
    size?: number,
    filter?: string
  ): Promise<PageResponse<CourseResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseResponse>>
    >(ADMIN_COURSE_PREFIX, {
      params: { page, size, filter },
    });

    return unwrapResponse(response);
  },

  /**
   * Close a course (COURSE_CLOSE_ACTION)
   * Contract Key: COURSE_CLOSE_ACTION
   * Endpoint: PATCH /api/v1/teacher/courses/{id}/close
   */
  closeCourse: async (id: number): Promise<CourseDetailResponse> => {
    const response = await axiosClient.patch<ApiResponse<CourseDetailResponse>>(
      `${TEACHER_COURSE_PREFIX}/${id}/close`,
      {},
      {
        contractKey: CONTRACT_KEYS.COURSE_CLOSE_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Open a course (COURSE_OPEN_ACTION)
   * Contract Key: COURSE_OPEN_ACTION
   * Endpoint: PATCH /api/v1/teacher/courses/{id}/open
   */
  openCourse: async (id: number): Promise<CourseDetailResponse> => {
    const response = await axiosClient.patch<ApiResponse<CourseDetailResponse>>(
      `${TEACHER_COURSE_PREFIX}/${id}/open`,
      {},
      {
        contractKey: CONTRACT_KEYS.COURSE_OPEN_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Update a course (COURSE_UPDATE)
   * Contract Key: COURSE_UPDATE
   * Endpoint: PUT /api/v1/teacher/courses/{id}
   */
  updateCourse: async (
    id: number,
    payload: CourseUpdateRequest
  ): Promise<CourseDetailResponse> => {
    const response = await axiosClient.put<ApiResponse<CourseDetailResponse>>(
      `${TEACHER_COURSE_PREFIX}/${id}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.COURSE_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a course (COURSE_DELETE)
   * Contract Key: COURSE_DELETE
   * Endpoint: DELETE /api/v1/teacher/courses/{id}
   */
  deleteCourse: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${TEACHER_COURSE_PREFIX}/${id}`, {
      contractKey: CONTRACT_KEYS.COURSE_DELETE,
    });
  },

  /**
   * Restore a deleted course (Teacher only)
   */
  restoreCourse: async (id: number): Promise<CourseDetailResponse> => {
    const response = await axiosClient.patch<ApiResponse<CourseDetailResponse>>(
      `${TEACHER_COURSE_PREFIX}/${id}/restore`
    );

    return unwrapResponse(response);
  },

  /**
   * Get my courses (TEACHER_GET_COURSES)
   * Contract Key: TEACHER_GET_COURSES
   * Endpoint: GET /api/v1/teachers/{id}/courses
   * Note: This uses /teacher/courses which should map to teacher's own courses
   */
  getMyCourses: async (
    page?: number,
    size?: number,
    filter?: string
  ): Promise<PageResponse<CourseResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseResponse>>
    >(TEACHER_COURSE_PREFIX, {
      params: { page, size, filter },
      contractKey: CONTRACT_KEYS.TEACHER_GET_COURSES,
    });

    return unwrapResponse(response);
  },
};
