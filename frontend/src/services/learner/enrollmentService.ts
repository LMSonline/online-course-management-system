// Service cho enrollment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Enrollment, EnrollmentListResponse } from '@/lib/learner/enrollment/enrollments';
import { EnrollmentResponse } from '../learning';
import { ApiResponse, PageResponse } from "@/lib/api/api.types";

export const learnerEnrollmentService = {
  /** Lấy danh sách enrollment của student */
getEnrollments: async (
  studentId: number,
  page?: number,
  size?: number
): Promise<PageResponse<Enrollment>> => {
  const res = await axiosClient.get<ApiResponse<PageResponse<Enrollment>>>(
    `/students/${studentId}/enrollments`,
    { params: { page, size } }
  );

  return unwrapResponse(res); //  trả thẳng PageResponse
},


  /** Lấy chi tiết enrollment */
  getEnrollmentDetail: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.get(`/enrollments/${enrollmentId}`);
    // const res = await axiosClient.get(`/api/v1/enrollments/${enrollmentId}`);

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

//   enrollCourse: async (
// courseId: number, payload: { courseVersionId: number; }, versionId: number  ): Promise<EnrollmentResponse> => {
//     const res = await axiosClient.post(
//       `/api/v1/courses/${courseId}/enroll`,
//       payload
//     );
//     return unwrapResponse(res);
//   },


  /** Huỷ đăng ký khoá học */
  cancelEnrollment: async (enrollmentId: number): Promise<EnrollmentResponse> => {
    const res = await axiosClient.post(`/enrollments/${enrollmentId}/cancel`);

    // const res = await axiosClient.post(
    //   `/api/v1/enrollments/${enrollmentId}/cancel`
    // );
    
    return unwrapResponse(res);
  },
};
