import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";

export interface StudentProfile {
  id: number;
  accountId: number;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export const studentService = {
  /**
   * Get current student profile (STUDENT_GET_ME)
   * Contract Key: STUDENT_GET_ME
   * Endpoint: GET /api/v1/students/me
   */
  getMe: async (): Promise<StudentProfile> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<ApiResponse<StudentProfile>>(
      "/students/me",
      {
        contractKey: CONTRACT_KEYS.STUDENT_GET_ME,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get student by ID (STUDENT_GET_BY_ID)
   * Contract Key: STUDENT_GET_BY_ID
   * Endpoint: GET /api/v1/students/{id}
   */
  getById: async (id: number): Promise<StudentProfile> => {
    const response = await axiosClient.get<ApiResponse<StudentProfile>>(
      `/students/${id}`,
      {
        contractKey: CONTRACT_KEYS.STUDENT_GET_BY_ID,
      }
    );
    return unwrapResponse(response);
  },
};

