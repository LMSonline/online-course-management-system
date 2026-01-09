import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";

// ===================== MAPPING lastAccessed =====================
// - Interface EnrollmentResponse có trường lastAccessed (ISO string, optional)
// - Được trả về từ API getStudentEnrollments
// - Được sử dụng bởi:
//   + src/hooks/enrollment/useStudentEnrollments.ts (trả về cho FE)
//   + src/app/(student)/my-learning/page.tsx (lấy danh sách enrollment)
//   + src/core/components/learner/dashboard/ContinueCourseCard.tsx (lọc, chọn, render)
// ================================================================

export type { PageResponse };
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";


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
  lastAccessed?: string; // ISO string, newly added
}


export const enrollmentService = {
  /**
   * Enroll in a course (ENROLLMENT_CREATE)
   * Endpoint: POST /api/v1/courses/{courseId}/enroll
   */
  enrollCourse: async (
    courseId: string | number,
    paymentTransactionId: number | null = null,
    notes?: string
  ) => {
    const response = await axiosClient.post(`/courses/${courseId}/enroll`, {
      paymentTransactionId,
      notes,
    });
    return unwrapResponse(response);
  },

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

