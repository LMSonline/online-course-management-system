// Hooks liên quan đến comment cho learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerCommentService } from '../../services/learner/commentService';
import { Comment } from '../../lib/learner/comment/comments';

/**
 * Lấy tất cả comment của khoá học
 */
export function useCourseComments(courseId: number) {
  return useQuery<Comment[]>({
    queryKey: ['learner-course-comments', courseId],
    queryFn: () => learnerCommentService.getCourseComments(courseId),
    enabled: !!courseId,
  });
}

/**
 * Lấy tất cả comment của bài học
 */
export function useLessonComments(lessonId: number) {
  return useQuery<Comment[]>({
    queryKey: ['learner-lesson-comments', lessonId],
    queryFn: () => learnerCommentService.getLessonComments(lessonId),
    enabled: !!lessonId,
  });
}

/**
 * Lấy replies cho một comment
 */
export function useReplies(id: number) {
  return useQuery<Comment[]>({
    queryKey: ['learner-comment-replies', id],
    queryFn: () => learnerCommentService.getReplies(id),
    enabled: !!id,
  });
}

/**
 * Lấy các comment phổ biến của khoá học
 */
export function usePopularComments(courseId: number, limit: number = 10) {
  return useQuery<Comment[]>({
    queryKey: ['learner-popular-comments', courseId, limit],
    queryFn: () => learnerCommentService.getPopularComments(courseId, limit),
    enabled: !!courseId,
  });
}

/**
 * Tìm kiếm comment trong khoá học
 */
export function useSearchComments(courseId: number, keyword: string) {
  return useQuery<Comment[]>({
    queryKey: ['learner-search-comments', courseId, keyword],
    queryFn: () => learnerCommentService.searchComments(courseId, keyword),
    enabled: !!courseId && !!keyword,
  });
}

/**
 * Tạo comment mới cho khoá học
 */
export function useCreateCourseComment(courseId: number) {
  return useMutation({
    mutationFn: (payload: Partial<Comment>) => learnerCommentService.createCourseComment(courseId, payload),
  });
}

/**
 * Tạo comment mới cho bài học
 */
export function useCreateLessonComment(lessonId: number) {
  return useMutation({
    mutationFn: (payload: Partial<Comment>) => learnerCommentService.createLessonComment(lessonId, payload),
  });
}

/**
 * Trả lời một comment
 */
export function useReplyToComment(id: number) {
  return useMutation({
    mutationFn: (payload: Partial<Comment>) => learnerCommentService.replyToComment(id, payload),
  });
}

/**
 * Cập nhật comment
 */
export function useUpdateComment(id: number) {
  return useMutation({
    mutationFn: (payload: Partial<Comment>) => learnerCommentService.updateComment(id, payload),
  });
}

/**
 * Upvote một comment
 */
export function useUpvoteComment(id: number) {
  return useMutation({
    mutationFn: () => learnerCommentService.upvoteComment(id),
  });
}

/**
 * Xoá comment
 */
export function useDeleteComment(id: number) {
  return useMutation({
    mutationFn: () => learnerCommentService.deleteComment(id),
  });
}
