// Type definitions for learner progress APIs
// Chuẩn hóa theo backend

export interface StudentProgressOverview {
  studentId: number;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  progressPercent: number;
}

export interface CourseProgress {
  studentId: number;
  courseId: number;
  chapters: Array<{
    chapterId: number;
    title: string;
    lessons: Array<LessonProgress>;
    progressPercent: number;
  }>;
  progressPercent: number;
}

export interface LessonProgress {
  studentId: number;
  lessonId: number;
  viewed: boolean;
  completed: boolean;
  watchedDuration?: number;
  progressPercent?: number;
}
