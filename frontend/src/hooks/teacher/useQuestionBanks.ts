import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
  QuestionBankRequest,
  QuestionRequest,
  AnswerOptionRequest,
} from "@/services/assessment/assessment.types";
import { toast } from "sonner";

/**
 * Hook để lấy danh sách question banks của teacher
 */
export function useQuestionBanksByTeacher(teacherId: number | null) {
  return useQuery({
    queryKey: ["questionBanks", "teacher", teacherId],
    queryFn: () =>
      teacherId
        ? assessmentService.getQuestionBanksByTeacher(teacherId)
        : Promise.resolve([]),
    enabled: !!teacherId,
  });
}

/**
 * Hook để lấy chi tiết một question bank
 */
export function useQuestionBankById(bankId: number | null) {
  return useQuery({
    queryKey: ["questionBank", bankId],
    queryFn: () =>
      bankId
        ? assessmentService.getQuestionBankById(bankId)
        : Promise.reject("No bank ID"),
    enabled: !!bankId,
  });
}

/**
 * Hook để tạo question bank
 */
export function useCreateQuestionBank(teacherId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuestionBankRequest) =>
      assessmentService.createQuestionBank(teacherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questionBanks", "teacher", teacherId],
      });
      toast.success("Question bank created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create question bank");
    },
  });
}

/**
 * Hook để cập nhật question bank
 */
export function useUpdateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: QuestionBankRequest;
    }) => assessmentService.updateQuestionBank(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", data.id] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success("Question bank updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update question bank");
    },
  });
}

/**
 * Hook để xóa question bank
 */
export function useDeleteQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assessmentService.deleteQuestionBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success("Question bank deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete question bank");
    },
  });
}

/**
 * Hook để lấy danh sách questions trong một bank
 */
export function useQuestionsByBank(bankId: number | null) {
  return useQuery({
    queryKey: ["questions", "bank", bankId],
    queryFn: () =>
      bankId
        ? assessmentService.getQuestionsByBank(bankId)
        : Promise.resolve([]),
    enabled: !!bankId,
  });
}

/**
 * Hook để tạo question
 */
export function useCreateQuestion(bankId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuestionRequest) =>
      assessmentService.createQuestion(bankId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "bank", bankId],
      });
      toast.success("Question created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create question");
    },
  });
}

/**
 * Hook để cập nhật question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: QuestionRequest }) =>
      assessmentService.updateQuestion(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "bank", data.questionBankId],
      });
      toast.success("Question updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update question");
    },
  });
}

/**
 * Hook để xóa question
 */
export function useDeleteQuestion(bankId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assessmentService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "bank", bankId],
      });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success("Question deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete question");
    },
  });
}

/**
 * Hook để quản lý answer options
 */
export function useManageAnswerOptions(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AnswerOptionRequest[]) =>
      assessmentService.manageAnswerOptions(questionId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "bank", data.questionBankId],
      });
      toast.success("Answer options updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update answer options");
    },
  });
}

/**
 * Hook để clone question bank
 */
export function useCloneQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bankId,
      targetTeacherId,
    }: {
      bankId: number;
      targetTeacherId: number;
    }) => assessmentService.cloneQuestionBank(bankId, targetTeacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success("Question bank cloned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clone question bank");
    },
  });
}

/**
 * Hook để check xem question có đang được sử dụng trong quiz không
 */
export function useCheckQuestionInUse(questionId: number | null) {
  return useQuery({
    queryKey: ["questionInUse", questionId],
    queryFn: () =>
      questionId
        ? assessmentService.checkQuestionInUse(questionId)
        : Promise.resolve({ inUse: false }),
    enabled: !!questionId,
    staleTime: 0, // Always refetch to get latest status
  });
}

/**
 * Hook để bulk delete questions
 */
export function useBulkDeleteQuestions(bankId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionIds: number[]) =>
      assessmentService.bulkDeleteQuestions(questionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "bank", bankId],
      });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success("Questions deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete questions");
    },
  });
}
