import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";

export interface TeacherProfile {
  id: number;
  accountId: number;
  fullName?: string;
  bio?: string;
  headline?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  totalReviews: number;
  completionRate?: number;
  activeEnrollments?: number;
}

export interface TeacherRevenue {
  totalRevenue: number;
  revenueByCourse: Array<{
    courseId: number;
    courseTitle: string;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  currency: string;
}

export const teacherService = {
  /**
   * Get current teacher profile (TEACHER_GET_ME)
   * Contract Key: TEACHER_GET_ME
   * Endpoint: GET /api/v1/teachers/me
   */
  getMe: async (): Promise<TeacherProfile> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<ApiResponse<TeacherProfile>>(
      "/teachers/me",
      {
        contractKey: CONTRACT_KEYS.TEACHER_GET_ME,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher by ID (TEACHER_GET_BY_ID)
   * Contract Key: TEACHER_GET_BY_ID
   * Endpoint: GET /api/v1/teachers/{id}
   * Note: id must be teacherId (NOT accountId)
   */
  getById: async (id: number): Promise<TeacherProfile> => {
    const response = await axiosClient.get<ApiResponse<TeacherProfile>>(
      `/teachers/${id}`,
      {
        contractKey: CONTRACT_KEYS.TEACHER_GET_BY_ID,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher stats (TEACHER_GET_STATS)
   * Contract Key: TEACHER_GET_STATS
   * Endpoint: GET /api/v1/teachers/{id}/stats
   * Note: id must be teacherId (NOT accountId)
   */
  getStats: async (teacherId: number): Promise<TeacherStats> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<ApiResponse<TeacherStats>>(
      `/teachers/${teacherId}/stats`,
      {
        contractKey: CONTRACT_KEYS.TEACHER_GET_STATS,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher revenue (TEACHER_GET_REVENUE)
   * Contract Key: TEACHER_GET_REVENUE
   * Endpoint: GET /api/v1/teachers/{id}/revenue
   * Note: id must be teacherId (NOT accountId)
   */
  getRevenue: async (
    teacherId: number,
    range?: string
  ): Promise<TeacherRevenue> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<ApiResponse<TeacherRevenue>>(
      `/teachers/${teacherId}/revenue`,
      {
        contractKey: CONTRACT_KEYS.TEACHER_GET_REVENUE,
        params: { range },
      }
    );
    return unwrapResponse(response);
  },
};

