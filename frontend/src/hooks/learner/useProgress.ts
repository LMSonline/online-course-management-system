// Hooks liên quan đến progress cho learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerProgressService } from '../../services/learner/progressService';
import { StudentProgressOverview, CourseProgress, LessonProgress } from '../../lib/learner/progress/progress';

/**
 * Lấy tổng quan tiến độ học tập của student
 */
export function useStudentProgress(studentId: number) {
  return useQuery<StudentProgressOverview>({
    queryKey: ['learner-student-progress', studentId],
    queryFn: () => learnerProgressService.getStudentProgress(studentId),
    enabled: !!studentId,
  });
}

/**
 * Lấy tiến độ từng khoá học
 */
export function useCourseProgress(studentId: number, courseId: number) {
  return useQuery<CourseProgress>({
    queryKey: ['learner-course-progress', studentId, courseId],
    queryFn: () => learnerProgressService.getCourseProgress(studentId, courseId),
    enabled: !!studentId && !!courseId,
  });
}

/**
 * Lấy tiến độ từng bài học
 */
export function useLessonProgress(studentId: number, lessonId: number) {
  return useQuery<LessonProgress>({
    queryKey: ['learner-lesson-progress', studentId, lessonId],
    queryFn: () => learnerProgressService.getLessonProgress(studentId, lessonId),
    enabled: !!studentId && !!lessonId,
  });
}

/**
 * Đánh dấu đã xem bài học
 */
export function useMarkLessonViewed(lessonId: number) {
  return useMutation({
    mutationFn: () => learnerProgressService.markLessonViewed(lessonId),
  });
}

/**
 * Đánh dấu hoàn thành bài học
 */
export function useMarkLessonCompleted(lessonId: number) {
  return useMutation({
    mutationFn: () => learnerProgressService.markLessonCompleted(lessonId),
  });
}

/**
 * Cập nhật thời lượng xem video bài học
 */
export function useUpdateWatchedDuration(lessonId: number) {
  return useMutation({
    mutationFn: (durationSeconds: number) => learnerProgressService.updateWatchedDuration(lessonId, durationSeconds),
  });
}
