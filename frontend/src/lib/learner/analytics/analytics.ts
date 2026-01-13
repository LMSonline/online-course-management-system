// Type definitions for learner analytics APIs
// Chuẩn hóa tuyệt đối theo backend

export interface AnalyticsOverview {
  studentId: number;
  totalCourses: number;
  completedCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalCertificates: number;
  lastLogin: string;
}

export interface AnalyticsOverviewResponse {
  overview: AnalyticsOverview;
}
