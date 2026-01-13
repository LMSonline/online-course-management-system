// Service cho enrollment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Enrollment, EnrollmentListResponse, EnrollmentResponse } from '@/lib/learner/enrollment/enrollments';

export const learnerEnrollmentService = {
  /** Lấy danh sách enrollment của student */
  getEnrollments: async (studentId: number, page?: number, size?: number): Promise<EnrollmentListResponse> => {
    const params: any = {};
    if (page) params.page = page;
    if (size) params.size = size;
    const res = await axiosClient.get(`/students/${studentId}/enrollments`, { params });
    return unwrapResponse(res);
  },

  /** Lấy chi tiết enrollment */
  getEnrollmentDetail: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.get(`/enrollments/${enrollmentId}`);
    return unwrapResponse(res);
  },

  /** Đăng ký khoá học */
  enrollCourse: async (studentId: number, courseId: number, courseVersionId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.post(`/enrollments`, {
      studentId,
      courseId,
      courseVersionId,
    });
    return unwrapResponse(res);
  },

  /** Huỷ đăng ký khoá học */
  cancelEnrollment: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.post(`/enrollments/${enrollmentId}/cancel`);
    return unwrapResponse(res);
  },
};
