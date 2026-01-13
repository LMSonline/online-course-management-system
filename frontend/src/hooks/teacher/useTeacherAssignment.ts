import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignment/assignment.service";
import {
  AssignmentRequest,
  AssignmentResponse,
  SubmissionResponse,
  GradeSubmissionRequest,
  FeedbackSubmissionRequest,
  AssignmentStatisticsResponse,
  AssignmentEligibilityResponse,
  StudentAssignmentProgressResponse,
  AssignmentType,
  SubmissionStatus,
} from "@/services/assignment/assignment.types";
import { toast } from "sonner";

// ============================================
// QUERY KEYS - Centralized for cache management
// ============================================

export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (filters?: string) => [...assignmentKeys.lists(), { filters }] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: number) => [...assignmentKeys.details(), id] as const,
  submissions: (assignmentId: number) =>
    [...assignmentKeys.detail(assignmentId), "submissions"] as const,
  submission: (submissionId: number) =>
    [...assignmentKeys.all, "submission", submissionId] as const,
  statistics: (assignmentId: number) =>
    [...assignmentKeys.detail(assignmentId), "statistics"] as const,
  passingRate: (assignmentId: number) =>
    [...assignmentKeys.detail(assignmentId), "passingRate"] as const,
  eligibility: (assignmentId: number) =>
    [...assignmentKeys.detail(assignmentId), "eligibility"] as const,
};

// ============================================
// ASSIGNMENT MANAGEMENT HOOKS
// ============================================

/**
 * Get all independent assignments (assignment library)
 * Maps to: assignmentService.getAllIndependentAssignments()
 */
export function useAllIndependentAssignments() {
  return useQuery({
    queryKey: assignmentKeys.lists(),
    queryFn: () => assignmentService.getAllIndependentAssignments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get assignment by ID
 * Maps to: assignmentService.getAssignmentById(id)
 */
export function useAssignmentById(id: number) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get assignments by lesson
 * Maps to: assignmentService.getAssignmentsByLesson(lessonId)
 */
export function useAssignmentsByLesson(lessonId: number) {
  return useQuery({
    queryKey: [...assignmentKeys.lists(), "lesson", lessonId],
    queryFn: () => assignmentService.getAssignmentsByLesson(lessonId),
    enabled: !!lessonId && lessonId > 0,
  });
}

/**
 * Create independent assignment
 * Maps to: assignmentService.createIndependentAssignment(payload)
 */
export function useCreateIndependentAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentRequest) =>
      assignmentService.createIndependentAssignment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Assignment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create assignment");
    },
  });
}

/**
 * Update assignment
 * Maps to: assignmentService.updateAssignment(id, payload)
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignmentRequest }) =>
      assignmentService.updateAssignment(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Assignment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update assignment");
    },
  });
}

/**
 * Delete assignment
 * Maps to: assignmentService.deleteAssignment(id)
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.deleteAssignment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.removeQueries({ queryKey: assignmentKeys.detail(id) });
      toast.success("Assignment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
          "Failed to delete assignment. It may have submissions."
      );
    },
  });
}

/**
 * Clone assignment
 * Maps to: assignmentService.cloneAssignment(id, targetLessonId)
 */
export function useCloneAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      targetLessonId,
    }: {
      id: number;
      targetLessonId: number;
    }) => assignmentService.cloneAssignment(id, targetLessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Assignment cloned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clone assignment");
    },
  });
}

/**
 * Link assignment to lesson
 * Maps to: assignmentService.linkAssignmentToLesson(lessonId, assignmentId)
 */
export function useLinkAssignmentToLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      assignmentId,
    }: {
      lessonId: number;
      assignmentId: number;
    }) => assignmentService.linkAssignmentToLesson(lessonId, assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...assignmentKeys.lists(), "lesson", variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.assignmentId),
      });
      toast.success("Assignment linked to lesson successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to link assignment");
    },
  });
}

/**
 * Unlink assignment from lesson
 * Maps to: assignmentService.unlinkAssignmentFromLesson(lessonId, assignmentId)
 */
export function useUnlinkAssignmentFromLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      assignmentId,
    }: {
      lessonId: number;
      assignmentId: number;
    }) => assignmentService.unlinkAssignmentFromLesson(lessonId, assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...assignmentKeys.lists(), "lesson", variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.assignmentId),
      });
      toast.success("Assignment unlinked from lesson");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to unlink assignment");
    },
  });
}

/**
 * Extend due date
 * Maps to: assignmentService.extendDueDate(id, newDueDate)
 */
export function useExtendDueDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newDueDate }: { id: number; newDueDate: string }) =>
      assignmentService.extendDueDate(id, newDueDate),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Due date extended successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to extend due date");
    },
  });
}

// ============================================
// SUBMISSION MANAGEMENT HOOKS
// ============================================

/**
 * Get all submissions for an assignment
 * Maps to: assignmentService.getAssignmentSubmissions(id)
 */
export function useAssignmentSubmissions(assignmentId: number) {
  return useQuery({
    queryKey: assignmentKeys.submissions(assignmentId),
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

/**
 * Get submission by ID
 * Maps to: assignmentService.getSubmissionById(id)
 */
export function useSubmissionById(submissionId: number) {
  return useQuery({
    queryKey: assignmentKeys.submission(submissionId),
    queryFn: () => assignmentService.getSubmissionById(submissionId),
    enabled: !!submissionId && submissionId > 0,
  });
}

/**
 * Grade submission
 * Maps to: assignmentService.gradeSubmission(id, payload)
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
    onSuccess: (data, variables) => {
      // Invalidate submission detail
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submission(variables.id),
      });
      // Invalidate assignment submissions list
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(data.assignmentId),
      });
      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.statistics(data.assignmentId),
      });
      toast.success("Submission graded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to grade submission");
    },
  });
}

/**
 * Provide feedback without grading
 * Maps to: assignmentService.feedbackSubmission(id, payload)
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submission(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(data.assignmentId),
      });
      toast.success("Feedback submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit feedback");
    },
  });
}

/**
 * Reject submission
 * Maps to: assignmentService.rejectSubmission(id, feedback)
 */
export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feedback }: { id: number; feedback: string }) =>
      assignmentService.rejectSubmission(id, feedback),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submission(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(data.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.statistics(data.assignmentId),
      });
      toast.success("Submission rejected");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reject submission");
    },
  });
}

/**
 * Regrade submission
 * Maps to: assignmentService.regradeSubmission(id, score, feedback)
 */
export function useRegradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      score,
      feedback,
    }: {
      id: number;
      score: number;
      feedback?: string;
    }) => assignmentService.regradeSubmission(id, score, feedback),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submission(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(data.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.statistics(data.assignmentId),
      });
      toast.success("Submission regraded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to regrade submission");
    },
  });
}

/**
 * Bulk grade submissions
 * Maps to: assignmentService.bulkGradeSubmissions(submissionIds, score, feedback)
 */
export function useBulkGradeSubmissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionIds,
      score,
      feedback,
    }: {
      submissionIds: number[];
      score: number;
      feedback?: string;
    }) =>
      assignmentService.bulkGradeSubmissions(submissionIds, score, feedback),
    onSuccess: (data) => {
      // Invalidate all submissions queries
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      toast.success(`${data.length} submissions graded successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to bulk grade submissions");
    },
  });
}

// ============================================
// STATISTICS & ANALYTICS HOOKS
// ============================================

/**
 * Get assignment statistics
 * Maps to: assignmentService.getAssignmentStatistics(id)
 */
export function useAssignmentStatistics(assignmentId: number) {
  return useQuery({
    queryKey: assignmentKeys.statistics(assignmentId),
    queryFn: () => assignmentService.getAssignmentStatistics(assignmentId),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

/**
 * Get passing rate
 * Maps to: assignmentService.getPassingRate(assignmentId)
 */
export function usePassingRate(assignmentId: number) {
  return useQuery({
    queryKey: assignmentKeys.passingRate(assignmentId),
    queryFn: () => assignmentService.getPassingRate(assignmentId),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

/**
 * Get pending submissions
 * Maps to: assignmentService.getPendingSubmissions(id)
 */
export function usePendingSubmissions(assignmentId: number) {
  return useQuery({
    queryKey: [...assignmentKeys.submissions(assignmentId), "pending"],
    queryFn: () => assignmentService.getPendingSubmissions(assignmentId),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

/**
 * Get late submissions
 * Maps to: assignmentService.getLateSubmissions(id)
 */
export function useLateSubmissions(assignmentId: number) {
  return useQuery({
    queryKey: [...assignmentKeys.submissions(assignmentId), "late"],
    queryFn: () => assignmentService.getLateSubmissions(assignmentId),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

/**
 * Get submissions by status
 * Maps to: assignmentService.getSubmissionsByStatus(assignmentId, status)
 */
export function useSubmissionsByStatus(
  assignmentId: number,
  status: SubmissionStatus
) {
  return useQuery({
    queryKey: [...assignmentKeys.submissions(assignmentId), "status", status],
    queryFn: () =>
      assignmentService.getSubmissionsByStatus(assignmentId, status),
    enabled: !!assignmentId && assignmentId > 0,
  });
}

// ============================================
// FILE MANAGEMENT HOOKS
// ============================================

/**
 * Get submission files
 * Maps to: assignmentService.getSubmissionFiles(submissionId)
 */
export function useSubmissionFiles(submissionId: number) {
  return useQuery({
    queryKey: [...assignmentKeys.submission(submissionId), "files"],
    queryFn: () => assignmentService.getSubmissionFiles(submissionId),
    enabled: !!submissionId && submissionId > 0,
  });
}

/**
 * Upload submission file
 * Maps to: assignmentService.uploadSubmissionFile(submissionId, file)
 */
export function useUploadSubmissionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      file,
    }: {
      submissionId: number;
      file: File;
    }) => assignmentService.uploadSubmissionFile(submissionId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...assignmentKeys.submission(variables.submissionId),
          "files",
        ],
      });
      toast.success("File uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload file");
    },
  });
}

/**
 * Delete submission file
 * Maps to: assignmentService.deleteSubmissionFile(submissionId, fileId)
 */
export function useDeleteSubmissionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      fileId,
    }: {
      submissionId: number;
      fileId: number;
    }) => assignmentService.deleteSubmissionFile(submissionId, fileId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...assignmentKeys.submission(variables.submissionId),
          "files",
        ],
      });
      toast.success("File deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete file");
    },
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper to get file download URL
 */
export async function getSubmissionFileDownloadUrl(
  submissionId: number,
  fileId: number
): Promise<string> {
  return assignmentService.getFileDownloadUrl(submissionId, fileId);
}

/**
 * Helper to export submissions
 */
export async function exportAssignmentSubmissions(
  assignmentId: number
): Promise<SubmissionResponse[]> {
  return assignmentService.exportSubmissions(assignmentId);
}
