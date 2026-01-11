// Analytics Types for Teacher

export interface GlobalAnalytics {
  totalRevenue: number;
  revenueGrowth: number;
  totalEnrollments: number;
  enrollmentGrowth: number;
  activeStudents: number;
  avgCourseRating: number;
  ratingChange: number;
  revenueTrend: MonthlyRevenue[];
  topPerformingCourses: TopCourse[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  enrollments: number;
}

export interface TopCourse {
  courseId: number;
  courseName: string;
  revenue: number;
  enrollments: number;
  rating: number;
  thumbnail?: string;
}

export interface CourseRevenueBreakdown {
  courseId: number;
  courseName: string;
  price: number;
  unitsSold: number;
  totalRevenue: number;
  platformFee: number;
  netEarnings: number;
  percentage: number;
}

export interface CourseCompletionStats {
  courseId: number;
  courseName: string;
  totalEnrollments: number;
  registered: number;
  halfwayComplete: number;
  eligibleForExam: number;
  certified: number;
  dropOffRate: number;
  averageProgress: number;
}

export interface StudentProgress {
  studentId: number;
  studentName: string;
  studentAvatar?: string;
  progressPercentage: number;
  enrollmentDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "DROPPED";
  lastAccessDate: string;
}

export interface LessonEngagement {
  lessonId: number;
  lessonTitle: string;
  viewCount: number;
  avgWatchTime: number;
  completionRate: number;
  dropOffRate: number;
  dropOffPoint?: number;
}

export interface AssessmentStats {
  assessmentId: number;
  assessmentName: string;
  type: "QUIZ" | "ASSIGNMENT" | "FINAL_EXAM";
  averageScore: number;
  passRate: number;
  totalAttempts: number;
  scoreDistribution: ScoreDistribution[];
}

export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalysis {
  questionId: number;
  questionText: string;
  correctRate: number;
  avgTimeSpent: number;
  commonWrongAnswers: string[];
}

export interface IntegrityAlert {
  alertId: string;
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar?: string;
  courseName: string;
  assessmentName: string;
  alertType:
    | "TAB_SWITCHING"
    | "MULTIPLE_IP"
    | "SUSPICIOUS_SPEED"
    | "COPY_PASTE";
  flagType: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  details: string;
  description: string;
  timestamp: string;
  detectedAt: string;
  reviewed: boolean;
  status: "pending" | "reviewed" | "invalidated";
}

export interface CertificateStats {
  totalIssued: number;
  pendingReview: number;
  averageCompletionTime: number;
  recentCertificates: RecentCertificate[];
}

export interface RecentCertificate {
  studentName: string;
  studentAvatar?: string;
  issuedDate: string;
  finalScore: number;
}

// Filter Types
export interface AnalyticsFilters {
  timeRange: "30" | "90" | "180" | "365" | "all";
  courseId?: number;
}

export interface CourseAnalyticsFilters {
  assessmentId?: number;
  studentSearch?: string;
  status?: StudentProgress["status"];
}
