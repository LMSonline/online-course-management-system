// ===========================
// Course Analytics Types
// ===========================

export interface EnrollmentTrendData {
  date: string; // ISO date or month label
  count: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  enrollments: number;
}

export interface LessonPerformanceData {
  lessonId: number;
  lessonTitle: string;
  completionRate: number;
  averageScore?: number;
  viewCount: number;
}

export interface CourseAnalyticsResponse {
  totalEnrollments: number;
  totalRevenue: number;
  averageCompletionRate: number;
  averageTimeSpent: number; // in seconds
  activeStudents: number;
  revenueGrowth: number; // percentage
  enrollmentTrend: EnrollmentTrendData[];
  revenueData: RevenueData[];
  topPerformingLessons: LessonPerformanceData[];
  completionRateByMonth: {
    month: string;
    rate: number;
  }[];
}

export interface AnalyticsDateRange {
  startDate: string; // ISO date
  endDate: string; // ISO date
}
