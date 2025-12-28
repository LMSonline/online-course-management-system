import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
  QuizRequest,
  QuizResponse,
  AddQuestionsRequest,
  QuizStatisticsResponse,
  QuizResultResponse,
} from "@/services/assessment/assessment.types";
import { toast } from "sonner";

/**
 * Hook để quản lý danh sách quizzes theo lesson
 */
export function useQuizzesByLesson(lessonId: number | null) {
  return useQuery({
    queryKey: ["quizzes", "lesson", lessonId],
    queryFn: () =>
      lessonId
        ? assessmentService.getQuizzesByLesson(lessonId)
        : Promise.resolve([]),
    enabled: !!lessonId,
  });
}

/**
 * Hook để lấy chi tiết một quiz
 */
export function useQuizById(quizId: number | null) {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () =>
      quizId
        ? assessmentService.getQuizById(quizId)
        : Promise.reject("No quiz ID"),
    enabled: !!quizId,
  });
}

/**
 * Hook để tạo quiz mới
 */
export function useCreateQuiz(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizRequest) =>
      assessmentService.createQuiz(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", "lesson", lessonId],
      });
      toast.success("Quiz created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create quiz");
    },
  });
}

/**
 * Hook để cập nhật quiz
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: QuizRequest }) =>
      assessmentService.updateQuiz(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quiz", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["quizzes", "lesson", data.lessonId],
      });
      toast.success("Quiz updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update quiz");
    },
  });
}

/**
 * Hook để xóa quiz
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assessmentService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete quiz");
    },
  });
}

/**
 * Hook để thêm câu hỏi vào quiz
 */
export function useAddQuestionsToQuiz(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddQuestionsRequest) =>
      assessmentService.addQuestionsToQuiz(quizId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Questions added to quiz successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add questions");
    },
  });
}

/**
 * Hook để xóa câu hỏi khỏi quiz
 */
export function useRemoveQuestionFromQuiz(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) =>
      assessmentService.removeQuestionFromQuiz(quizId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Question removed from quiz");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove question");
    },
  });
}

/**
 * Hook để lấy thống kê quiz
 */
export function useQuizStatistics(quizId: number | null) {
  return useQuery({
    queryKey: ["quiz", "statistics", quizId],
    queryFn: () =>
      quizId
        ? assessmentService.getQuizStatistics(quizId)
        : Promise.reject("No quiz ID"),
    enabled: !!quizId,
  });
}

/**
 * Hook để lấy kết quả quiz
 */
export function useQuizResults(quizId: number | null) {
  return useQuery({
    queryKey: ["quiz", "results", quizId],
    queryFn: () =>
      quizId
        ? assessmentService.getQuizResults(quizId)
        : Promise.reject("No quiz ID"),
    enabled: !!quizId,
  });
}
