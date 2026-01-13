// ProgressService for learner (student)
// API chỉ student: /api/v1/students/{studentId}/progress, /students/{studentId}/courses/{courseId}/progress, /students/{studentId}/lessons/{lessonId}/progress, /lessons/{lessonId}/mark-viewed, /lessons/{lessonId}/mark-completed, /lessons/{lessonId}/update-duration

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { StudentProgressOverview, CourseProgress, LessonProgress } from '@/lib/learner/progress/progress';

export const learnerProgressService = {
  /**
   * Lấy tổng quan tiến độ học tập của student
   */
  getStudentProgress: async (studentId: number): Promise<StudentProgressOverview> => {
    const response = await axiosClient.get(`/students/${studentId}/progress`);
    return unwrapResponse(response);
  },

  /**
   * Lấy tiến độ từng khoá học
   */
  getCourseProgress: async (studentId: number, courseId: number): Promise<CourseProgress> => {
    const response = await axiosClient.get(`/students/${studentId}/courses/${courseId}/progress`);
    return unwrapResponse(response);
  },

  /**
   * Lấy tiến độ từng bài học
   */
  getLessonProgress: async (studentId: number, lessonId: number): Promise<LessonProgress> => {
    const response = await axiosClient.get(`students/${studentId}/lessons/${lessonId}/progress`);
    return unwrapResponse(response);
  },

  /**
   * Đánh dấu đã xem bài học
   */
  markLessonViewed: async (lessonId: number): Promise<LessonProgress> => {
    const response = await axiosClient.post(`/lessons/${lessonId}/mark-viewed`);
    return unwrapResponse(response);
  },

  /**
   * Đánh dấu hoàn thành bài học
   */
  markLessonCompleted: async (lessonId: number): Promise<LessonProgress> => {
    const response = await axiosClient.post(`/lessons/${lessonId}/mark-completed`);
    return unwrapResponse(response);
  },

  /**
   * Cập nhật thời lượng xem video bài học
   */
  updateWatchedDuration: async (lessonId: number, durationSeconds: number): Promise<LessonProgress> => {
    const response = await axiosClient.post(`/lessons/${lessonId}/update-duration`, { durationSeconds });
    return unwrapResponse(response);
  },
};
