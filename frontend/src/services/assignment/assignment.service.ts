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
  StudentProgressResponse,
  FileCountResponse,
  DownloadUrlResponse,
  AverageScoreResponse,
  PassingRateResponse,
  AssignmentType,
  SubmissionStatus,
} from "./assignment.types";

export const assignmentService = {
  // =================================================================
  // MODULE 1: ASSIGNMENT MANAGEMENT (Teacher - CRUD & Linking)
  // =================================================================

  /** #44. Create Independent Assignment */
  createIndependentAssignment: async (payload: AssignmentRequest): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/assignments`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #48. Create Assignment & Link to Lesson (Convenience) */
  createAssignment: async (lessonId: number, payload: AssignmentRequest): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/lessons/${lessonId}/assignments`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #45. Get All Independent Assignments */
  getAllIndependentAssignments: async (): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/assignments`
    );
    return unwrapResponse(response);
  },

  /** #49. Get Assignments by Lesson */
  getAssignmentsByLesson: async (lessonId: number): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/lessons/${lessonId}/assignments`
    );
    return unwrapResponse(response);
  },

  /** #50. Get Assignment by ID */
  getAssignmentById: async (id: number): Promise<AssignmentResponse> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /** #51. Update Assignment */
  updateAssignment: async (id: number, payload: AssignmentRequest): Promise<AssignmentResponse> => {
    const response = await axiosClient.put<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #52. Delete Assignment */
  deleteAssignment: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /** #46. Link Assignment to Lesson */
  linkAssignmentToLesson: async (lessonId: number, assignmentId: number): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/lessons/${lessonId}/assignments/${assignmentId}`
    );
    return unwrapResponse(response);
  },

  /** #47. Unlink Assignment from Lesson */
  unlinkAssignmentFromLesson: async (lessonId: number, assignmentId: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/lessons/${lessonId}/assignments/${assignmentId}`
    );
    return unwrapResponse(response);
  },

  /** #55. Clone Assignment */
  cloneAssignment: async (id: number, targetLessonId: number): Promise<AssignmentResponse> => {
    const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}/clone`,
      null,
      { params: { targetLessonId } }
    );
    return unwrapResponse(response);
  },

  /** #59. Extend Due Date */
  extendDueDate: async (id: number, newDueDate: string): Promise<AssignmentResponse> => {
    const response = await axiosClient.put<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}/extend-due-date`,
      null,
      { params: { newDueDate } }
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 2: SUBMISSION ACTIONS (Student Operations)
  // =================================================================

  /** Check Assignment Eligibility */
  checkAssignmentEligibility: async (id: number): Promise<AssignmentEligibilityResponse> => {
    const response = await axiosClient.get<ApiResponse<AssignmentEligibilityResponse>>(
      `/assignments/${id}/eligibility`
    );
    return unwrapResponse(response);
  },

  /** Submit Assignment (Finalize) */
  submitAssignment: async (assignmentId: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/submit`
    );
    return unwrapResponse(response);
  },

  /** Update Submission Content (Text) */
  updateSubmissionContent: async (id: number, content: string): Promise<SubmissionResponse> => {
    const response = await axiosClient.put<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/content`,
      content // Sending raw string as body based on typical text submission, or wrap in object if needed
    );
    return unwrapResponse(response);
  },

  /** Resubmit Assignment */
  resubmitAssignment: async (assignmentId: number, previousSubmissionId: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/resubmit`,
      null,
      { params: { previousSubmissionId } }
    );
    return unwrapResponse(response);
  },

  /** Delete Submission (Draft) */
  deleteSubmission: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 3: SUBMISSION FILE MANAGEMENT
  // =================================================================

  /** #72. Get Submission Files */
  getSubmissionFiles: async (submissionId: number): Promise<SubmissionFileResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionFileResponse[]>>(
      `/submissions/${submissionId}/files`
    );
    return unwrapResponse(response);
  },

  /** Upload Single File */
  uploadSubmissionFile: async (submissionId: number, file: File): Promise<SubmissionFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResponse<SubmissionFileResponse>>(
      `/submissions/${submissionId}/files/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return unwrapResponse(response);
  },

  /** Upload Multiple Files */
  uploadMultipleFiles: async (submissionId: number, files: File[]): Promise<SubmissionFileResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await axiosClient.post<ApiResponse<SubmissionFileResponse[]>>(
      `/submissions/${submissionId}/files/batch`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return unwrapResponse(response);
  },

  /** #73. Get File Download URL */
  getFileDownloadUrl: async (submissionId: number, fileId: number): Promise<DownloadUrlResponse> => {
    const response = await axiosClient.get<ApiResponse<DownloadUrlResponse>>(
      `/submissions/${submissionId}/files/${fileId}/download`
    );
    return unwrapResponse(response);
  },

  /** Delete File */
  deleteSubmissionFile: async (submissionId: number, fileId: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/submissions/${submissionId}/files/${fileId}`
    );
    return unwrapResponse(response);
  },

  /** #74. Get File Count */
  getFileCount: async (submissionId: number): Promise<FileCountResponse> => {
    const response = await axiosClient.get<ApiResponse<FileCountResponse>>(
      `/submissions/${submissionId}/files/count`
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 4: GRADING & FEEDBACK (Teacher Operations)
  // =================================================================

  /** #62. Grade Submission */
  gradeSubmission: async (id: number, payload: GradeSubmissionRequest): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/grade`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #69. Regrade Submission */
  regradeSubmission: async (id: number, score: number, feedback?: string): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/regrade`,
      null,
      { params: { score, feedback } }
    );
    return unwrapResponse(response);
  },

  /** #63. Add Feedback (No Grade) */
  feedbackSubmission: async (id: number, payload: FeedbackSubmissionRequest): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/feedback`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #64. Bulk Grade Submissions */
  bulkGradeSubmissions: async (submissionIds: number[], score: number, feedback?: string): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse[]>>(
      `/submissions/bulk-grade`,
      submissionIds,
      { params: { score, feedback } }
    );
    return unwrapResponse(response);
  },

  /** #65. Reject Submission */
  rejectSubmission: async (id: number, feedback: string): Promise<SubmissionResponse> => {
    const response = await axiosClient.post<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}/reject`,
      null,
      { params: { feedback } }
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 5: QUERIES & STATISTICS (Filtering & Reports)
  // =================================================================

  /** #53 & #60. Get All Submissions by Assignment */
  getSubmissionsByAssignment: async (assignmentId: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions`
    );
    return unwrapResponse(response);
  },

  /** #61. Get Submission by ID */
  getSubmissionById: async (id: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  /** #66. Get Submissions by Status */
  getSubmissionsByStatus: async (assignmentId: number, status: SubmissionStatus): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions/by-status`,
      { params: { status } }
    );
    return unwrapResponse(response);
  },

  /** #58. Get Assignments by Type */
  getAssignmentsByType: async (lessonId: number, type: AssignmentType): Promise<AssignmentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
      `/lessons/${lessonId}/assignments/by-type`,
      { params: { type } }
    );
    return unwrapResponse(response);
  },

  /** #56. Get Late Submissions (List) */
  getLateSubmissions: async (id: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/late-submissions`
    );
    return unwrapResponse(response);
  },

  /** #57. Get Pending Submissions (Queue) */
  getPendingSubmissions: async (id: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/pending-submissions`
    );
    return unwrapResponse(response);
  },

  /** #67. Get Late Submissions by Student */
  getLateSubmissionsByStudent: async (studentId: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/students/${studentId}/late-submissions`
    );
    return unwrapResponse(response);
  },

  /** Get Student's Submissions (General) */
  getStudentSubmissions: async (studentId: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/students/${studentId}/submissions`
    );
    return unwrapResponse(response);
  },

  /** Get My Submissions for specific assignment */
  getMySubmissions: async (assignmentId: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/my-submissions`
    );
    return unwrapResponse(response);
  },

  /** Get My Latest Submission */
  getMyLatestSubmission: async (assignmentId: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/my-latest`
    );
    return unwrapResponse(response);
  },

  /** #68. Get Best Submission */
  getBestSubmission: async (assignmentId: number, studentId: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/assignments/${assignmentId}/students/${studentId}/best-submission`
    );
    return unwrapResponse(response);
  },

  /** Get Student Progress */
  getStudentProgress: async (assignmentId: number, studentId: number): Promise<StudentProgressResponse> => {
    const response = await axiosClient.get<ApiResponse<StudentProgressResponse>>(
      `/assignments/${assignmentId}/students/${studentId}/progress`
    );
    return unwrapResponse(response);
  },

  /** Get Student Average Score */
  getStudentAverageScore: async (studentId: number): Promise<AverageScoreResponse> => {
    const response = await axiosClient.get<ApiResponse<AverageScoreResponse>>(
      `/students/${studentId}/average-score`
    );
    return unwrapResponse(response);
  },

  /** #54. Get Assignment Statistics */
  getAssignmentStatistics: async (id: number): Promise<AssignmentStatisticsResponse> => {
    const response = await axiosClient.get<ApiResponse<AssignmentStatisticsResponse>>(
      `/assignments/${id}/statistics`
    );
    return unwrapResponse(response);
  },

  /** #70. Get Passing Rate */
  getPassingRate: async (assignmentId: number): Promise<PassingRateResponse> => {
    const response = await axiosClient.get<ApiResponse<PassingRateResponse>>(
      `/assignments/${assignmentId}/passing-rate`
    );
    return unwrapResponse(response);
  },

  /** #71. Export Submissions */
  exportSubmissions: async (assignmentId: number): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${assignmentId}/submissions/export`
    );
    return unwrapResponse(response);
  },
};