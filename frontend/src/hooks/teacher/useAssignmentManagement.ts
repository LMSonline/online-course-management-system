import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignment/assignment.service";
import {
  AssignmentRequest,
  GradeSubmissionRequest,
  FeedbackSubmissionRequest,
  SubmissionStatus,
} from "@/services/assignment/assignment.types";
import { toast } from "sonner";

// =================================================================
// ASSIGNMENT QUERIES
// =================================================================

/** Get all independent assignments (Library) */
export function useAllIndependentAssignments() {
  return useQuery({
    queryKey: ["assignments", "independent"],
    queryFn: () => assignmentService.getAllIndependentAssignments(),
  });
}

/** Get assignments by lesson */
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

/** Get assignment by ID */
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

/** Get assignment statistics */
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

/** Get passing rate */
export function usePassingRate(assignmentId: number | null) {
  return useQuery({
    queryKey: ["assignment", "passing-rate", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.getPassingRate(assignmentId)
        : Promise.reject("No assignment ID"),
    enabled: !!assignmentId,
  });
}

// =================================================================
// SUBMISSION QUERIES  
// =================================================================

/** Get all submissions by assignment */
export function useAssignmentSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.getSubmissionsByAssignment(assignmentId)
        : Promise.resolve([]),
    enabled: !!assignmentId,
  });
}

/** Get submissions by status */
export function useSubmissionsByStatus(assignmentId: number | null, status: SubmissionStatus) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId, "status", status],
    queryFn: () =>
      assignmentId
        ? assignmentService.getSubmissionsByStatus(assignmentId, status)
        : Promise.resolve([]),
    enabled: !!assignmentId,
  });
}

/** Get pending submissions */
export function usePendingSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId, "pending"],
    queryFn: () =>
      assignmentId
        ? assignmentService.getPendingSubmissions(assignmentId)
        : Promise.resolve([]),
    enabled: !!assignmentId,
  });
}

/** Get late submissions */
export function useLateSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId, "late"],
    queryFn: () =>
      assignmentId
        ? assignmentService.getLateSubmissions(assignmentId)
        : Promise.resolve([]),
    enabled: !!assignmentId,
  });
}

/** Get submission by ID */
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

/** Get submission files */
export function useSubmissionFiles(submissionId: number | null) {
  return useQuery({
    queryKey: ["submission", submissionId, "files"],
    queryFn: () =>
      submissionId
        ? assignmentService.getSubmissionFiles(submissionId)
        : Promise.resolve([]),
    enabled: !!submissionId,
  });
}

// =================================================================
// ASSIGNMENT MUTATIONS
// =================================================================

/** Create independent assignment (Library) */
export function useCreateIndependentAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentRequest) =>
      assignmentService.createIndependentAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", "independent"] });
      toast.success("Assignment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create assignment");
    },
  });
}

/** Create assignment linked to lesson */
export function useCreateAssignment(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentRequest) =>
      assignmentService.createAssignment(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", "lesson", lessonId] });
      toast.success("Assignment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create assignment");
    },
  });
}

/** Update assignment */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignmentRequest }) =>
      assignmentService.updateAssignment(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignment", data.id] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update assignment");
    },
  });
}

/** Delete assignment - handles constraint error */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.status === 400
        ? "Cannot delete assignment with existing submissions. Consider archiving instead."
        : error?.message || "Failed to delete assignment";
      toast.error(message);
    },
  });
}

/** Link assignment to lesson */
export function useLinkAssignmentToLesson(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) =>
      assignmentService.linkAssignmentToLesson(lessonId, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", "lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["assignments", "independent"] });
      toast.success("Assignment linked to lesson");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to link assignment");
    },
  });
}

/** Unlink assignment from lesson */
export function useUnlinkAssignmentFromLesson(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) =>
      assignmentService.unlinkAssignmentFromLesson(lessonId, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", "lesson", lessonId] });
      toast.success("Assignment unlinked from lesson");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to unlink assignment");
    },
  });
}

/** Clone assignment */
export function useCloneAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, targetLessonId }: { id: number; targetLessonId: number }) =>
      assignmentService.cloneAssignment(id, targetLessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment cloned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clone assignment");
    },
  });
}

/** Extend due date */
export function useExtendDueDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newDueDate }: { id: number; newDueDate: string }) =>
      assignmentService.extendDueDate(id, newDueDate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignment", data.id] });
      toast.success("Due date extended successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to extend due date");
    },
  });
}

// =================================================================
// GRADING MUTATIONS
// =================================================================

/** Grade submission */
export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GradeSubmissionRequest }) =>
      assignmentService.gradeSubmission(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "assignment", data.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "statistics", data.assignmentId] });
      toast.success("Submission graded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to grade submission");
    },
  });
}

/** Bulk grade submissions */
export function useBulkGradeSubmissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionIds, score, feedback }: { submissionIds: number[]; score: number; feedback?: string }) =>
      assignmentService.bulkGradeSubmissions(submissionIds, score, feedback),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "statistics"] });
      toast.success(`Graded ${data.length} submissions successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to bulk grade");
    },
  });
}

/** Reject submission (request resubmit) */
export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feedback }: { id: number; feedback: string }) =>
      assignmentService.rejectSubmission(id, feedback),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "assignment", data.assignmentId] });
      toast.success("Submission rejected - student notified to resubmit");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reject submission");
    },
  });
}

/** Add feedback (no grade) */
export function useFeedbackSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeedbackSubmissionRequest }) =>
      assignmentService.feedbackSubmission(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      toast.success("Feedback sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send feedback");
    },
  });
}

// =================================================================
// FILE MUTATIONS
// =================================================================

/** Upload submission file */
export function useUploadSubmissionFile(submissionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      assignmentService.uploadSubmissionFile(submissionId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId, "files"] });
      toast.success("File uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload file");
    },
  });
}

/** Delete submission file */
export function useDeleteSubmissionFile(submissionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) =>
      assignmentService.deleteSubmissionFile(submissionId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId, "files"] });
      toast.success("File deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete file");
    },
  });
}

/** Get file download URL */
export function useFileDownloadUrl(submissionId: number, fileId: number) {
  return useQuery({
    queryKey: ["submission", submissionId, "file", fileId, "download"],
    queryFn: () => assignmentService.getFileDownloadUrl(submissionId, fileId),
    enabled: false, // Manual trigger only
  });
}

// =================================================================
// ADDITIONAL QUERIES & MUTATIONS
// =================================================================

/** Export submissions */
export function useExportSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["submissions", "export", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.exportSubmissions(assignmentId)
        : Promise.resolve([]),
    enabled: false, // Manual trigger only
  });
}

/** Regrade submission */
export function useRegradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, score, feedback }: { id: number; score: number; feedback?: string }) =>
      assignmentService.regradeSubmission(id, score, feedback),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "assignment", data.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "statistics", data.assignmentId] });
      toast.success("Submission regraded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to regrade submission");
    },
  });
}

/** Check assignment eligibility (for student view) */
export function useAssignmentEligibility(assignmentId: number | null) {
  return useQuery({
    queryKey: ["assignment", "eligibility", assignmentId],
    queryFn: () =>
      assignmentId
        ? assignmentService.checkAssignmentEligibility(assignmentId)
        : Promise.reject("No assignment ID"),
    enabled: !!assignmentId,
  });
}

