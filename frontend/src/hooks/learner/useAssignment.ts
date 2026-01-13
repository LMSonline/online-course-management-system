// Hooks cho assignment APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerAssignmentService } from '../../services/learner/assignmentService';
import { AssignmentListResponse, Assignment, AssignmentSubmissionResponse } from '../../lib/learner/assignment/assignments';

/** Lấy danh sách assignment của student */
export function useAssignments(studentId: number) {
  return useQuery<AssignmentListResponse>({
    queryKey: ['learner-assignments', studentId],
    queryFn: () => learnerAssignmentService.getAssignments(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết assignment */
export function useAssignmentDetail(assignmentId: number) {
  return useQuery<Assignment>({
    queryKey: ['learner-assignment-detail', assignmentId],
    queryFn: () => learnerAssignmentService.getAssignmentDetail(assignmentId),
    enabled: !!assignmentId,
  });
}

/** Lấy submission của student cho assignment */
export function useAssignmentSubmission(assignmentId: number, studentId: number) {
  return useQuery<AssignmentSubmissionResponse>({
    queryKey: ['learner-assignment-submission', assignmentId, studentId],
    queryFn: () => learnerAssignmentService.getSubmission(assignmentId, studentId),
    enabled: !!assignmentId && !!studentId,
  });
}

/** Nộp bài assignment */
export function useSubmitAssignment() {
  return useMutation({
    mutationFn: ({ assignmentId, studentId, content }: { assignmentId: number; studentId: number; content: string }) =>
      learnerAssignmentService.submitAssignment(assignmentId, studentId, content),
  });
}
