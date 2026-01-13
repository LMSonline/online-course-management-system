// Hooks cho quiz APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerQuizService } from '../../services/learner/quizService';
import { QuizListResponse, QuizDetailResponse, QuizSubmissionResponse } from '../../lib/learner/quiz/quizzes';

/** Lấy danh sách quiz của student */
export function useQuizzes(studentId: number) {
  return useQuery<QuizListResponse>({
    queryKey: ['learner-quizzes', studentId],
    queryFn: () => learnerQuizService.getQuizzes(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết quiz và câu hỏi */
export function useQuizDetail(quizId: number) {
  return useQuery<QuizDetailResponse>({
    queryKey: ['learner-quiz-detail', quizId],
    queryFn: () => learnerQuizService.getQuizDetail(quizId),
    enabled: !!quizId,
  });
}

/** Lấy submission của student cho quiz */
export function useQuizSubmission(quizId: number, studentId: number) {
  return useQuery<QuizSubmissionResponse>({
    queryKey: ['learner-quiz-submission', quizId, studentId],
    queryFn: () => learnerQuizService.getSubmission(quizId, studentId),
    enabled: !!quizId && !!studentId,
  });
}

/** Nộp bài quiz */
export function useSubmitQuiz() {
  return useMutation({
    mutationFn: ({ quizId, studentId, answers }: { quizId: number; studentId: number; answers: Array<{ questionId: number; selectedOptionId: number }> }) =>
      learnerQuizService.submitQuiz(quizId, studentId, answers),
  });
}
