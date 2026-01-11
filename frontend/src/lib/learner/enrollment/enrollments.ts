// Type definitions for learner enrollment APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface EnrollmentListResponse {
  enrollments: Enrollment[];
  totalItems?: number;
}

export interface EnrollmentResponse {
  enrollment: Enrollment;
}
