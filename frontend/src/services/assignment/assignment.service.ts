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
} from "./assignment.types";

export const assignmentService = {
  // ===========================
  // Assignment APIs
  // ===========================

  /**
   * Create assignment (Teacher only)
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
   * Get assignments by lesson
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
   * Get assignment by ID
   */
  getAssignmentById: async (id: number): Promise<AssignmentResponse> => {
    const response = await axiosClient.get<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update assignment (Teacher only)
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
   * Delete assignment (Teacher only)
   */
  deleteAssignment: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/assignments/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Get assignment submissions (Teacher only)
   */
  getAssignmentSubmissions: async (
    id: number
  ): Promise<SubmissionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse[]>>(
      `/assignments/${id}/submissions`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Submission APIs
  // ===========================

  /**
   * Submit assignment (Student only)
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
   * Get submissions by assignment (Teacher only)
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
   * Get submission by ID
   */
  getSubmissionById: async (id: number): Promise<SubmissionResponse> => {
    const response = await axiosClient.get<ApiResponse<SubmissionResponse>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Grade submission (Teacher only)
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
   * Add feedback to submission (Teacher only)
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
   * Get student submissions
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
   * Delete submission (Student only)
   */
  deleteSubmission: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/submissions/${id}`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Submission File APIs
  // ===========================

  /**
   * Upload submission file
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapResponse(response);
  },

  /**
   * Get submission files
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
   * Delete submission file
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
};
