import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  AssignmentRequest,
  AssignmentResponse,
  SubmissionResponse,
  GradeSubmissionRequest,
  FeedbackSubmissionRequest,
  SubmissionFileResponse,
  AssignmentEligibilityResponse,
  AssignmentStatisticsResponse,
  StudentAssignmentProgressResponse,
  AssignmentType,
  SubmissionStatus,
} from "./assignment.types";

export const assignmentService = {
  // =================================================================
  // MODULE 1: ASSIGNMENT MANAGEMENT (Teacher - Core CRUD & Linking)
  // =================================================================

  /**
   * #1. Create Independent Assignment
   * Create an assignment not linked to any lesson yet
   * Endpoint: POST /api/v1/assignments
   */
  createIndependentAssignment: async (
    payload: AssignmentRequest
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/assignments`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * #2. Get All Independent Assignments
   * Get all assignments that are not linked to any lesson (assignment library/pool)
   * Endpoint: GET /api/v1/assignments
   */
  getAllIndependentAssignments: async (): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/assignments`
    );
    return unwrapResponse(response);
  },

  /**
   * #3. Link Assignment to Lesson
   * Link existing assignment to a lesson (allows assignment reusability)
   * Endpoint: POST /api/v1/lessons/{lessonId}/assignments/{assignmentId}
   */
  linkAssignmentToLesson: async (
    lessonId: number,
    assignmentId: number
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/lessons/${lessonId}/assignments/${assignmentId}`
    );
    return unwrapResponse(response);
  },

  /**
   * #4. Unlink Assignment from Lesson
   * Unlink assignment from lesson (assignment becomes independent again)
   * Endpoint: DELETE /api/v1/lessons/{lessonId}/assignments/{assignmentId}
   */
  unlinkAssignmentFromLesson: async (
    lessonId: number,
    assignmentId: number
  ): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/lessons/${lessonId}/assignments/${assignmentId}`
    );
    return unwrapResponse(response);
  },

  /**
   * #5. Create Assignment & Link to Lesson (Convenience)
   * Create assignment and immediately link to lesson
   * Endpoint: POST /api/v1/lessons/{lessonId}/assignments
   */
  createAssignment: async (
    lessonId: number,
    payload: AssignmentRequest
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/lessons/${lessonId}/assignments`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * #6. Get Assignments by Lesson
   * Get all assignments for a specific lesson
   * Endpoint: GET /api/v1/lessons/{lessonId}/assignments
   */
  getAssignmentsByLesson: async (
    lessonId: number
  ): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/lessons/${lessonId}/assignments`
    );
    return unwrapResponse(response);
  },

  /**
   * #7. Get Assignment by ID
   * Get assignment details by ID
   * Endpoint: GET /api/v1/assignments/{id}
   */
  getAssignmentById: async (id: number): Promise<AssignmentResponse> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * #8. Update Assignment
   * Update assignment details
   * Endpoint: PUT /api/v1/assignments/{id}
   */
  updateAssignment: async (
    id: number,
    payload: AssignmentRequest
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.put<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * #9. Delete Assignment
   * Delete an assignment
   * Endpoint: DELETE /api/v1/assignments/{id}
   */
  deleteAssignment: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * #10. Get Assignment Submissions
   * Get all submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{id}/submissions
   */
  getAssignmentSubmissions: async (
    id: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #11. Check Assignment Eligibility
   * Check if student can submit to assignment
   * Endpoint: GET /api/v1/assignments/{id}/eligibility
   */
  checkEligibility: async (
    id: number
  ): Promise<AssignmentEligibilityResponse> => {
    const response = await axiosClient.get<
      ApiResponse<AssignmentEligibilityResponse>
    >(`/assignments/${id}/eligibility`);
    return unwrapResponse(response);
  },

  /**
   * #12. Get Assignment Statistics
   * Get statistics for an assignment (teacher view)
   * Endpoint: GET /api/v1/assignments/{id}/statistics
   */
  getAssignmentStatistics: async (
    id: number
  ): Promise<AssignmentStatisticsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<AssignmentStatisticsResponse>
    >(`/assignments/${id}/statistics`);
    return unwrapResponse(response);
  },

  /**
   * #13. Get Student Progress
   * Get student's progress on an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/students/{studentId}/progress
   */
  getStudentProgress: async (
    assignmentId: number,
    studentId: number
  ): Promise<StudentAssignmentProgressResponse> => {
    const response = await axiosClient.get<
      ApiResponse<StudentAssignmentProgressResponse>
    >(`/assignments/${assignmentId}/students/${studentId}/progress`);
    return unwrapResponse(response);
  },

  /**
   * #14. Clone Assignment
   * Clone an assignment to another lesson
   * Endpoint: POST /api/v1/assignments/{id}/clone
   */
  cloneAssignment: async (
    id: number,
    targetLessonId: number
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}/clone`,
      null,
      { params: { targetLessonId } }
    );
    return unwrapResponse(response);
  },

  /**
   * #15. Get Late Submissions
   * Get all late submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{id}/late-submissions
   */
  getLateSubmissions: async (id: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/late-submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #16. Get Pending Submissions
   * Get all pending submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{id}/pending-submissions
   */
  getPendingSubmissions: async (id: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/pending-submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #17. Get Assignments by Type
   * Get assignments by type for a lesson
   * Endpoint: GET /api/v1/lessons/{lessonId}/assignments/by-type
   */
  getAssignmentsByType: async (
    lessonId: number,
    type: AssignmentType
  ): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/lessons/${lessonId}/assignments/by-type`,
      { params: { type } }
    );
    return unwrapResponse(response);
  },

  /**
   * #18. Extend Due Date
   * Extend the due date for an assignment
   * Endpoint: PUT /api/v1/assignments/{id}/extend-due-date
   */
  extendDueDate: async (
    id: number,
    newDueDate: string
  ): Promise<AssignmentResponse> => {
    const response = await axiosClient.put<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}/extend-due-date`,
      null,
      { params: { newDueDate } }
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 2: SUBMISSION MANAGEMENT (Student & Teacher Operations)
  // =================================================================

  /**
   * #19. Submit Assignment
   * Submit an assignment (finalize submission)
   * Endpoint: POST /api/v1/assignments/{assignmentId}/submit
   */
  submitAssignment: async (
    assignmentId: number
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/submit`
    );
    return unwrapResponse(response);
  },

  /**
   * #20. Get Submissions by Assignment
   * Get all submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/submissions
   */
  getSubmissionsByAssignment: async (
    assignmentId: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #21. Get Submission by ID
   * Get submission details by ID
   * Endpoint: GET /api/v1/submissions/{id}
   */
  getSubmissionById: async (id: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * #22. Grade Submission
   * Grade a submission
   * Endpoint: POST /api/v1/submissions/{id}/grade
   */
  gradeSubmission: async (
    id: number,
    payload: GradeSubmissionRequest
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/grade`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * #23. Feedback Submission
   * Provide feedback on a submission (without grading)
   * Endpoint: POST /api/v1/submissions/{id}/feedback
   */
  feedbackSubmission: async (
    id: number,
    payload: FeedbackSubmissionRequest
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/feedback`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * #24. Get Student Submissions
   * Get all submissions by a student
   * Endpoint: GET /api/v1/students/{studentId}/submissions
   */
  getStudentSubmissions: async (
    studentId: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/students/${studentId}/submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #25. Delete Submission
   * Delete a submission (student only, before grading)
   * Endpoint: DELETE /api/v1/submissions/{id}
   */
  deleteSubmission: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * #26. Update Submission Content
   * Update submission content (text)
   * Endpoint: PUT /api/v1/submissions/{id}/content
   */
  updateSubmissionContent: async (
    id: number,
    content: string
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.put<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/content`,
      content,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    return unwrapResponse(response);
  },

  /**
   * #27. Get My Submissions
   * Get current student's submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/my-submissions
   */
  getMySubmissions: async (
    assignmentId: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/my-submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #28. Resubmit Assignment
   * Resubmit an assignment after previous submission
   * Endpoint: POST /api/v1/assignments/{assignmentId}/resubmit
   */
  resubmitAssignment: async (
    assignmentId: number,
    previousSubmissionId: number
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/resubmit`,
      null,
      { params: { previousSubmissionId } }
    );
    return unwrapResponse(response);
  },

  /**
   * #29. Bulk Grade Submissions
   * Grade multiple submissions at once
   * Endpoint: POST /api/v1/submissions/bulk-grade
   */
  bulkGradeSubmissions: async (
    submissionIds: number[],
    score: number,
    feedback?: string
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse[]>>(
      `/submissions/bulk-grade`,
      submissionIds,
      { params: { score, feedback } }
    );
    return unwrapResponse(response);
  },

  /**
   * #30. Reject Submission
   * Reject a submission with feedback
   * Endpoint: POST /api/v1/submissions/{id}/reject
   */
  rejectSubmission: async (
    id: number,
    feedback: string
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/reject`,
      null,
      { params: { feedback } }
    );
    return unwrapResponse(response);
  },

  /**
   * #31. Get Submissions by Status
   * Get submissions filtered by status
   * Endpoint: GET /api/v1/assignments/{assignmentId}/submissions/by-status
   */
  getSubmissionsByStatus: async (
    assignmentId: number,
    status: SubmissionStatus
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions/by-status`,
      { params: { status } }
    );
    return unwrapResponse(response);
  },

  /**
   * #32. Get Late Submissions by Student
   * Get all late submissions by a student
   * Endpoint: GET /api/v1/students/{studentId}/late-submissions
   */
  getLateSubmissionsByStudent: async (
    studentId: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/students/${studentId}/late-submissions`
    );
    return unwrapResponse(response);
  },

  /**
   * #33. Get Best Submission
   * Get best submission for a student on an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/students/{studentId}/best-submission
   */
  getBestSubmission: async (
    assignmentId: number,
    studentId: number
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/students/${studentId}/best-submission`
    );
    return unwrapResponse(response);
  },

  /**
   * #34. Get Student Average Score
   * Get average score for a student across all assignments
   * Endpoint: GET /api/v1/students/{studentId}/average-score
   */
  getStudentAverageScore: async (studentId: number): Promise<number> => {
    const response = await axiosClient.get<ApiResponse<number>>(
      `/students/${studentId}/average-score`
    );
    return unwrapResponse(response);
  },

  /**
   * #35. Regrade Submission
   * Regrade a previously graded submission
   * Endpoint: POST /api/v1/submissions/{id}/regrade
   */
  regradeSubmission: async (
    id: number,
    score: number,
    feedback?: string
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/regrade`,
      null,
      { params: { score, feedback } }
    );
    return unwrapResponse(response);
  },

  /**
   * #36. Get Passing Rate
   * Get passing rate for an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/passing-rate
   */
  getPassingRate: async (assignmentId: number): Promise<number> => {
    const response = await axiosClient.get<ApiResponse<number>>(
      `/assignments/${assignmentId}/passing-rate`
    );
    return unwrapResponse(response);
  },

  /**
   * #37. Get My Latest Submission
   * Get current student's latest submission for an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/my-latest
   */
  getMyLatestSubmission: async (
    assignmentId: number
  ): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/my-latest`
    );
    return unwrapResponse(response);
  },

  /**
   * #38. Export Submissions
   * Export submissions for an assignment
   * Endpoint: GET /api/v1/assignments/{assignmentId}/submissions/export
   */
  exportSubmissions: async (
    assignmentId: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions/export`
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 3: SUBMISSION FILE MANAGEMENT
  // =================================================================

  /**
   * #39. Upload Submission File
   * Upload a single file to a submission
   * Endpoint: POST /api/v1/submissions/{submissionId}/files
   */
  uploadSubmissionFile: async (
    submissionId: number,
    file: File
  ): Promise<SubmissionFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<
      ApiResponse<SubmissionFileResponse>
    >(`/submissions/${submissionId}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapResponse(response);
  },

  /**
   * #40. Upload Multiple Files
   * Upload multiple files to a submission
   * Endpoint: POST /api/v1/submissions/{submissionId}/files/batch
   */
  uploadMultipleFiles: async (
    submissionId: number,
    files: File[]
  ): Promise<SubmissionFileResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await axiosClient.post<
      ApiResponse<SubmissionFileResponse[]>
    >(`/submissions/${submissionId}/files/batch`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapResponse(response);
  },

  /**
   * #41. Get Submission Files
   * Get all files for a submission
   * Endpoint: GET /api/v1/submissions/{submissionId}/files
   */
  getSubmissionFiles: async (
    submissionId: number
  ): Promise<SubmissionFileResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<SubmissionFileResponse[]>
    >(`/submissions/${submissionId}/files`);
    return unwrapResponse(response);
  },

  /**
   * #42. Get File Download URL
   * Get download URL for a file
   * Endpoint: GET /api/v1/submissions/{submissionId}/files/{fileId}/download
   */
  getFileDownloadUrl: async (
    submissionId: number,
    fileId: number
  ): Promise<string> => {
    const response = await axiosClient.get<
      ApiResponse<{ downloadUrl: string }>
    >(`/submissions/${submissionId}/files/${fileId}/download`);
    const result = unwrapResponse(response);
    return result.downloadUrl;
  },

  /**
   * #43. Delete Submission File
   * Delete a file from a submission
   * Endpoint: DELETE /api/v1/submissions/{submissionId}/files/{fileId}
   */
  deleteSubmissionFile: async (
    submissionId: number,
    fileId: number
  ): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/submissions/${submissionId}/files/${fileId}`
    );
    return unwrapResponse(response);
  },

  /**
   * #44. Get File Count
   * Get number of files in a submission
   * Endpoint: GET /api/v1/submissions/{submissionId}/files/count
   */
  getFileCount: async (submissionId: number): Promise<number> => {
    const response = await axiosClient.get<ApiResponse<number>>(
      `/submissions/${submissionId}/files/count`
    );
    return unwrapResponse(response);
  },
};
