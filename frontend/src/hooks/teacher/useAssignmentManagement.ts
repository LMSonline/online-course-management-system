import { useState, useEffect, useCallback } from "react";
import { assignmentService } from "@/services/assignment/assignment.service";
import {
  AssignmentResponse,
  SubmissionResponse,
  GradeSubmissionRequest,
  AssignmentStatisticsResponse,
} from "@/services/assignment/assignment.types";

interface UseAssignmentManagementOptions {
  assignmentId: number;
  autoLoad?: boolean;
}

export function useAssignmentManagement({
  assignmentId,
  autoLoad = true,
}: UseAssignmentManagementOptions) {
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [statistics, setStatistics] =
    useState<AssignmentStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load assignment details
  const loadAssignment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAssignmentById(assignmentId);
      setAssignment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load assignment");
      console.error("Failed to load assignment:", err);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  // Load submissions
  const loadSubmissions = useCallback(async () => {
    try {
      const data = await assignmentService.getSubmissionsByAssignment(
        assignmentId
      );
      setSubmissions(data);
    } catch (err: any) {
      console.error("Failed to load submissions:", err);
    }
  }, [assignmentId]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const data = await assignmentService.getAssignmentStatistics(
        assignmentId
      );
      setStatistics(data);
    } catch (err: any) {
      console.error("Failed to load statistics:", err);
    }
  }, [assignmentId]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && assignmentId) {
      loadAssignment();
      loadSubmissions();
      loadStatistics();
    }
  }, [autoLoad, assignmentId, loadAssignment, loadSubmissions, loadStatistics]);

  // Grade submission
  const gradeSubmission = useCallback(
    async (submissionId: number, payload: GradeSubmissionRequest) => {
      try {
        setLoading(true);
        setError(null);
        const graded = await assignmentService.gradeSubmission(
          submissionId,
          payload
        );
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? graded : sub))
        );
        // Reload statistics after grading
        await loadStatistics();
        return graded;
      } catch (err: any) {
        setError(err.message || "Failed to grade submission");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadStatistics]
  );

  // Download submission files
  const getSubmissionFiles = useCallback(async (submissionId: number) => {
    try {
      const files = await assignmentService.getSubmissionFiles(submissionId);
      return files;
    } catch (err: any) {
      console.error("Failed to get submission files:", err);
      throw err;
    }
  }, []);

  return {
    assignment,
    submissions,
    statistics,
    loading,
    error,
    refresh: () => {
      loadAssignment();
      loadSubmissions();
      loadStatistics();
    },
    gradeSubmission,
    getSubmissionFiles,
  };
}
