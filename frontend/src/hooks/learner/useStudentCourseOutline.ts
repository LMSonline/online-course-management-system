import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/api/axios';

// Lấy danh sách chapter (section) cho student
export function useStudentChapters(courseId: number) {
  return useQuery({
    queryKey: ['student-chapters', courseId],
    queryFn: async () => {
      const res = await axiosClient.get(`/student/courses/${courseId}/chapters`);
      return res.data;
    },
    enabled: !!courseId,
  });
}

// Lấy danh sách lesson cho 1 chapter
export function useStudentLessons(chapterId: number) {
  return useQuery({
    queryKey: ['student-lessons', chapterId],
    queryFn: async () => {
      const res = await axiosClient.get(`/student/chapters/${chapterId}/lessons`);
      return res.data;
    },
    enabled: !!chapterId,
  });
}

// Lấy toàn bộ cấu trúc outline (chapter + lesson) cho 1 course (nếu backend hỗ trợ)
export function useStudentCourseStructure(courseId: number) {
  return useQuery({
    queryKey: ['student-course-structure', courseId],
    queryFn: async () => {
      const res = await axiosClient.get(`/student/courses/${courseId}/structure`);
      return res.data;
    },
    enabled: !!courseId,
  });
}
