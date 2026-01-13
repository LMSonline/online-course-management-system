import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/lib/api/api.types";
import type {
  CertificateResponse,
  CertificateDetailResponse,
  CertificateVerificationResponse,
} from "@/lib/admin/certificate.types";

/**
 * API prefix
 */
const ADMIN_CERTIFICATE_PREFIX = "/admin/certificates";
const PUBLIC_CERTIFICATE_PREFIX = "/public/certificates";

export const adminCertificateService = {
  /**
   * ============================
   * ADMIN – VIEW / MANAGEMENT
   * ============================
   */



  /**
 * Get ALL certificates (Admin Dashboard)
 * GET /api/v1/admin/certificates
 */
getAllCertificates: async (): Promise<CertificateResponse[]> => {
  const response = await axiosClient.get<
    ApiResponse<CertificateResponse[]>
  >(ADMIN_CERTIFICATE_PREFIX);

  return unwrapResponse(response);
},

  /**
   * Get certificates of a student (Admin)
   * GET /api/v1/admin/certificates/student/{studentId}
   */
  getCertificatesByStudent: async (
    studentId: number
  ): Promise<CertificateResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CertificateResponse[]>
    >(`${ADMIN_CERTIFICATE_PREFIX}/student/${studentId}`);

    return unwrapResponse(response);
  },

  /**
   * Get certificates of a course (Admin)
   * GET /api/v1/admin/certificates/course/{courseId}
   */
  getCertificatesByCourse: async (
    courseId: number
  ): Promise<CertificateResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CertificateResponse[]>
    >(`${ADMIN_CERTIFICATE_PREFIX}/course/${courseId}`);

    return unwrapResponse(response);
  },

  /**
   * Get certificate detail (Admin)
   * GET /api/v1/admin/certificates/{id}
   */
  getCertificateDetail: async (
    certificateId: number
  ): Promise<CertificateDetailResponse> => {
    const response = await axiosClient.get<
      ApiResponse<CertificateDetailResponse>
    >(`${ADMIN_CERTIFICATE_PREFIX}/${certificateId}`);

    return unwrapResponse(response);
  },

  /**
   * Revoke a certificate (Admin only)
   * POST /api/v1/admin/certificates/{id}/revoke
   */
  revokeCertificate: async (
    certificateId: number,
    payload: { reason: string }
  ): Promise<CertificateDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<CertificateDetailResponse>
    >(`${ADMIN_CERTIFICATE_PREFIX}/${certificateId}/revoke`, payload);

    return unwrapResponse(response);
  },

  /**
   * Download certificate PDF (Admin)
   * GET /api/v1/admin/certificates/{id}/download
   */
  downloadCertificate: async (
    certificateId: number
  ): Promise<Blob> => {
    const response = await axiosClient.get(
      `${ADMIN_CERTIFICATE_PREFIX}/${certificateId}/download`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  /**
   * ============================
   * PUBLIC – VERIFY CERTIFICATE
   * ============================
   */

  /**
   * Verify certificate by code (Public)
   * GET /api/v1/public/certificates/verify?code=...
   */
  verifyCertificate: async (
    code: string
  ): Promise<CertificateVerificationResponse> => {
    const response = await axiosClient.get<
      ApiResponse<CertificateVerificationResponse>
    >(`${PUBLIC_CERTIFICATE_PREFIX}/verify`, {
      params: { code },
    });

    return unwrapResponse(response);
  },
};
