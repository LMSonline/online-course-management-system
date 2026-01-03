import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";
import { DEMO_ENROLLMENTS, createDemoPageResponse } from "@/lib/demo/demoData";

/**
 * Enrollment Response Type
 * Matches backend EnrollmentResponse DTO
 */
export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseTitle: string;
  courseVersionId: number;
  versionNumber: number;
  status: "ENROLLED" | "COMPLETED" | "CANCELLED";
  enrolledAt: string;
  startAt: string;
  endAt: string;
  completionPercentage: number;
  averageScore?: number;
  certificateIssued: boolean;
  completedAt?: string;
  remainingDays: number;
  isActive: boolean;
  canTakeFinalExam: boolean;
}

export const enrollmentService = {
  /**
   * Get student enrollments (ENROLLMENT_GET_STUDENT_LIST)
   * Contract Key: ENROLLMENT_GET_STUDENT_LIST
   * Endpoint: GET /api/v1/students/{studentId}/enrollments?page={page}&size={size}
   */
  getStudentEnrollments: async (
    studentId: number,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<EnrollmentResponse>> => {
    // DEMO_MODE: Return mock data
    if (DEMO_MODE) {
      return createDemoPageResponse(DEMO_ENROLLMENTS, page + 1, size);
    }

    const response = await axiosClient.get<
      ApiResponse<PageResponse<EnrollmentResponse>>
    >(`/students/${studentId}/enrollments`, {
      params: {
        page,
        size,
        sort: "enrolledAt,desc",
      },
      contractKey: CONTRACT_KEYS.ENROLLMENT_GET_STUDENT_LIST,
    });

    return unwrapResponse(response);
  },
};

