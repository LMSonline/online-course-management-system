import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignment/assignment.service";
import {
  AssignmentRequest,
  GradeSubmissionRequest,
  FeedbackSubmissionRequest,
} from "@/services/assignment/assignment.types";
import { toast } from "sonner";

/**
 * Hook để lấy danh sách assignments theo lesson
 */
export function useAssignmentsByLesson(lessonId: number | null) {
  return useQuery({
    queryKey: ["assignments", "lesson", lessonId],
    queryFn: () =>
      lessonId
        ? assignmentService.getAssignmentsByLesson(lessonId)
        : Promise.resolve([]),
    enabled: !!lessonId,
  });
}

/**
 * Hook để lấy chi tiết một assignment
 */
export function useAssignmentById(assignmentId: number | null) {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.getAssignmentById(assignmentId)
        : Promise.reject("No assignment ID"),
    enabled: !!assignmentId,
  });
}

/**
 * Hook để tạo assignment
 */
export function useCreateAssignment(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentRequest) =>
      assignmentService.createAssignment(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", "lesson", lessonId],
      });
      toast.success("Assignment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create assignment");
    },
  });
}

/**
 * Hook để cập nhật assignment
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignmentRequest }) =>
      assignmentService.updateAssignment(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignment", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["assignments", "lesson", data.lessonId],
      });
      toast.success("Assignment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update assignment");
    },
  });
}

/**
 * Hook để xóa assignment
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete assignment");
    },
  });
}

/**
 * Hook để lấy danh sách submissions của một assignment
 */
export function useAssignmentSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.getAssignmentSubmissions(assignmentId)
        : Promise.resolve([]),
    enabled: !!assignmentId,
  });
}

/**
 * Hook để lấy chi tiết một submission
 */
export function useSubmissionById(submissionId: number | null) {
  return useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () =>
      submissionId
        ? assignmentService.getSubmissionById(submissionId)
        : Promise.reject("No submission ID"),
    enabled: !!submissionId,
  });
}

/**
 * Hook để chấm điểm submission
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: GradeSubmissionRequest;
    }) => assignmentService.gradeSubmission(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["submissions", "assignment", data.assignmentId],
      });
      toast.success("Submission graded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to grade submission");
    },
  });
}

/**
 * Hook để thêm feedback cho submission
 */
export function useFeedbackSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: FeedbackSubmissionRequest;
    }) => assignmentService.feedbackSubmission(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      toast.success("Feedback added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add feedback");
    },
  });
}

/**
 * Hook để lấy thống kê assignment
 */
export function useAssignmentStatistics(assignmentId: number | null) {
  return useQuery({
    queryKey: ["assignment", "statistics", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.getAssignmentStatistics(assignmentId)
        : Promise.reject("No assignment ID"),
    enabled: !!assignmentId,
  });
}

/**
 * Hook để upload submission file
 */
export function useUploadSubmissionFile(submissionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      assignmentService.uploadSubmissionFile(submissionId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
      toast.success("File uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload file");
    },
  });
}

/**
 * Hook để xóa submission file
 */
export function useDeleteSubmissionFile(submissionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) =>
      assignmentService.deleteSubmissionFile(submissionId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
      toast.success("File deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete file");
    },
  });
}
