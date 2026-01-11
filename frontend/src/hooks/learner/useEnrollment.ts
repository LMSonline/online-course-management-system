// Hooks cho enrollment APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerEnrollmentService } from '../../services/learner/enrollmentService';
import { EnrollmentListResponse, EnrollmentResponse } from '../../lib/learner/enrollment/enrollments';

/** Lấy danh sách enrollment của student */
export function useEnrollments(studentId: number) {
  return useQuery<EnrollmentListResponse>({
    queryKey: ['learner-enrollments', studentId],
    queryFn: () => learnerEnrollmentService.getEnrollments(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết enrollment */
export function useEnrollmentDetail(enrollmentId: number) {
  return useQuery<EnrollmentResponse>({
    queryKey: ['learner-enrollment-detail', enrollmentId],
    queryFn: () => learnerEnrollmentService.getEnrollmentDetail(enrollmentId),
    enabled: !!enrollmentId,
  });
}

/** Đăng ký khoá học */
export function useEnrollCourse() {
  return useMutation({
    mutationFn: ({ studentId, courseId }: { studentId: number; courseId: number }) =>
      learnerEnrollmentService.enrollCourse(studentId, courseId),
  });
}

/** Huỷ đăng ký khoá học */
export function useCancelEnrollment() {
  return useMutation({
    mutationFn: (enrollmentId: number) => learnerEnrollmentService.cancelEnrollment(enrollmentId),
  });
}
