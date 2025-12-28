// ===========================
// Progress Types - Mapped from Backend APIs
// ===========================

export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// Response DTOs

/** Backend: StudentProgressOverviewResponse */
export interface StudentProgressOverviewResponse {
  studentId: number;
  studentName: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalLessonsCompleted: number;
  totalLessons: number;
  overallProgress: number; // 0-100 percentage
  averageScore?: number;
  certificatesEarned: number;
  totalStudyTimeMinutes?: number;
  streakDays?: number;
  lastActivityAt?: string; // ISO datetime string
}

/** Backend: CourseProgressResponse */
export interface CourseProgressResponse {
  courseId: number;
  courseName: string;
  courseImageUrl?: string;
  studentId: number;
  enrollmentId: number;
  enrollmentStatus: string;
  completionPercentage: number; // 0-100
  totalChapters: number;
  completedChapters: number;
  totalLessons: number;
  completedLessons: number;
  totalVideos: number;
  completedVideos: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalAssignments: number;
  completedAssignments: number;
  averageQuizScore?: number;
  averageAssignmentScore?: number;
  totalStudyTimeMinutes?: number;
  lastAccessedAt?: string; // ISO datetime string
  chapters?: ChapterProgressResponse[];
}

/** Backend: ChapterProgressResponse */
export interface ChapterProgressResponse {
  chapterId: number;
  chapterTitle: string;
  chapterOrder: number;
  completionPercentage: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  lessons?: LessonProgressResponse[];
}

/** Backend: LessonProgressResponse */
export interface LessonProgressResponse {
  lessonId: number;
  lessonTitle: string;
  lessonType: string; // VIDEO, DOCUMENT, QUIZ, ASSIGNMENT
  lessonOrder: number;
  status: ProgressStatus;
  isViewed: boolean;
  isCompleted: boolean;
  viewedAt?: string; // ISO datetime string
  completedAt?: string; // ISO datetime string
  lastAccessedAt?: string; // ISO datetime string
  studyTimeMinutes?: number;
  score?: number;
  attempts?: number;
}

/** Backend: CourseProgressStatsResponse */
export interface CourseProgressStatsResponse {
  courseId: number;
  courseName: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageCompletionPercentage: number;
  averageStudyTimeMinutes?: number;
  studentsWithProgress: number;
  studentsCompleted: number;
  completionRate: number; // percentage
  lessonsCompleted: number;
  totalLessons: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  averageQuizScore?: number;
  averageAssignmentScore?: number;
}
