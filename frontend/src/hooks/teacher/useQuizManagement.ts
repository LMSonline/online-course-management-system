import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
  QuizRequest,
  QuizResponse,
  AddQuestionsRequest,
  QuizStatisticsResponse,
  QuizResultResponse,
  QuestionResponse,
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
 * Hook để lấy chi tiết một quiz (bao gồm cả questions)
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
      // Invalidate quiz details to refetch with updated questions
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
      // Invalidate quiz details to refetch with updated questions
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

/**
 * Hook để lấy tất cả quizzes độc lập (Quiz Library)
 */
export function useAllIndependentQuizzes() {
  return useQuery({
    queryKey: ["quizzes", "independent"],
    queryFn: () => assessmentService.getAllIndependentQuizzes(),
  });
}

/**
 * Hook để tạo quiz độc lập
 */
export function useCreateIndependentQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizRequest) =>
      assessmentService.createIndependentQuiz(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create quiz");
    },
  });
}

/**
 * Hook để clone quiz
 */
export function useCloneQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      targetLessonId,
    }: {
      id: number;
      targetLessonId: number;
    }) => assessmentService.cloneQuiz(id, targetLessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz cloned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clone quiz");
    },
  });
}

/**
 * Hook để thêm câu hỏi ngẫu nhiên từ bank
 */
export function useAddQuestionsFromBank(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionBankId,
      count,
    }: {
      questionBankId: number;
      count?: number;
    }) => assessmentService.addQuestionsFromBank(quizId, questionBankId, count),
    onSuccess: () => {
      // Invalidate quiz details to refetch with updated questions
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Questions added from bank successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add questions from bank");
    },
  });
}

/**
 * Hook để xóa tất cả câu hỏi
 */
export function useRemoveAllQuestions(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => assessmentService.removeAllQuestions(quizId),
    onSuccess: () => {
      // Invalidate quiz details to refetch with updated questions
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("All questions removed");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove questions");
    },
  });
}

/**
 * Hook để sắp xếp lại câu hỏi
 */
export function useReorderQuestions(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionIdsInOrder: number[]) =>
      assessmentService.reorderQuestions(quizId, questionIdsInOrder),
    onSuccess: () => {
      // Invalidate quiz details to refetch with updated questions
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Questions reordered");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reorder questions");
    },
  });
}

/**
 * Hook để lấy số lượng câu hỏi
 */
export function useQuestionCount(quizId: number | null) {
  return useQuery({
    queryKey: ["quiz", "questionCount", quizId],
    queryFn: () =>
      quizId
        ? assessmentService.getQuestionCount(quizId)
        : Promise.reject("No quiz ID"),
    enabled: !!quizId,
  });
}

/**
 * Hook để cập nhật time limit
 */
export function useUpdateTimeLimit(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timeLimitMinutes: number) =>
      assessmentService.updateTimeLimit(quizId, timeLimitMinutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Time limit updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update time limit");
    },
  });
}

/**
 * Hook để cập nhật passing score
 */
export function useUpdatePassingScore(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passingScore: number) =>
      assessmentService.updatePassingScore(quizId, passingScore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Passing score updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update passing score");
    },
  });
}

/**
 * Hook để cập nhật max attempts
 */
export function useUpdateMaxAttempts(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maxAttempts: number) =>
      assessmentService.updateMaxAttempts(quizId, maxAttempts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Max attempts updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update max attempts");
    },
  });
}

/**
 * Hook để link quiz vào lesson
 */
export function useLinkQuiz(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) =>
      assessmentService.linkQuizToLesson(lessonId, quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", "lesson", lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["quizzes", "independent"] });
      toast.success("Quiz linked to lesson successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to link quiz to lesson");
    },
  });
}

/**
 * Hook để unlink quiz khỏi lesson
 */
export function useUnlinkQuiz(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) =>
      assessmentService.unlinkQuizFromLesson(lessonId, quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", "lesson", lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["quizzes", "independent"] });
      toast.success("Quiz unlinked from lesson");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to unlink quiz from lesson");
    },
  });
}
