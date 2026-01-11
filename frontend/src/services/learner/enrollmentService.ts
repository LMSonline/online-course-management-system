// Service cho enrollment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Enrollment, EnrollmentListResponse, EnrollmentResponse } from '@/lib/learner/enrollment/enrollments';

export const learnerEnrollmentService = {
  /** Lấy danh sách enrollment của student */
  getEnrollments: async (studentId: number): Promise<EnrollmentListResponse> => {
    const res = await axiosClient.get(`/api/v1/students/${studentId}/enrollments`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết enrollment */
  getEnrollmentDetail: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.get(`/api/v1/enrollments/${enrollmentId}`);
    return unwrapResponse(res);
  },

  /** Đăng ký khoá học */
  enrollCourse: async (studentId: number, courseId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.post(`/api/v1/enrollments`, {
      studentId,
      courseId,
    });
    return unwrapResponse(res);
  },

  /** Huỷ đăng ký khoá học */
  cancelEnrollment: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.post(`/api/v1/enrollments/${enrollmentId}/cancel`);
    return unwrapResponse(res);
  },
};
