/* ================= DASHBOARD ================= */

export interface DashboardResponse {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;

  avgStudentsPerCourse: number;
  avgCompletionRate: number;
  avgScore: number;

  teacherActivity: {
    totalTeachers: number;
    activeTeachers: number;
    totalCoursesCreated: number;
    totalLessonsCreated: number;
  };
}

/* ================= STATISTICS ================= */

export interface DashboardStatisticsResponse {
  userGrowth: number;
  courseGrowth: number;
  revenueGrowth: number;
  completionRate: number;
}

/* ================= REPORTS ================= */

export interface RevenueReportResponse {
  totalRevenue: number;
  chart: {
    label: string;
    value: number;
  }[];
}

export interface UserReportResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface CourseReportResponse {
  totalCourses: number;
  activeCourses: number;
  closedCourses: number;
}
