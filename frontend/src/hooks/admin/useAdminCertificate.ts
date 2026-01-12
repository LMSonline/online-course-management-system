import { useState, useEffect, useCallback } from "react";
import { adminCertificateService } from "@/services/admin/certificate.service";
import type {
  CertificateResponse,
  CertificateDetailResponse,
  CertificateVerificationResponse,
} from "@/lib/admin/certificate.types";

interface UseCertificateAdminOptions {
  studentId?: number;
  courseId?: number;
  certificateId?: number;
  autoLoad?: boolean;
}

export function useCertificateAdmin({
  studentId,
  courseId,
  certificateId,
  autoLoad = true,
}: UseCertificateAdminOptions) {
  const [certificates, setCertificates] = useState<
    CertificateResponse[] | null
  >(null);
  const [certificateDetail, setCertificateDetail] =
    useState<CertificateDetailResponse | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<CertificateVerificationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
   * Load certificates
   * ========================= */

  const loadCertificatesByStudent = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);
      const data =
        await adminCertificateService.getCertificatesByStudent(studentId);
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || "Failed to load certificates by student");
      console.error("Failed to load certificates by student:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const loadCertificatesByCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const data =
        await adminCertificateService.getCertificatesByCourse(courseId);
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || "Failed to load certificates by course");
      console.error("Failed to load certificates by course:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  /* =========================
   * Load certificate detail
   * ========================= */

  const loadCertificateDetail = useCallback(async () => {
    if (!certificateId) return;

    try {
      setLoading(true);
      setError(null);
      const data =
        await adminCertificateService.getCertificateDetail(certificateId);
      setCertificateDetail(data);
    } catch (err: any) {
      setError(err.message || "Failed to load certificate detail");
      console.error("Failed to load certificate detail:", err);
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  /* =========================
   * Revoke certificate
   * ========================= */

  const revokeCertificate = useCallback(
    async (reason: string) => {
      if (!certificateId) {
        throw new Error("Certificate ID is required to revoke");
      }

      try {
        setLoading(true);
        setError(null);
        const data = await adminCertificateService.revokeCertificate(
          certificateId,
          { reason }
        );
        setCertificateDetail(data);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to revoke certificate");
        console.error("Failed to revoke certificate:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [certificateId]
  );

  /* =========================
   * Download certificate
   * ========================= */

  const downloadCertificate = useCallback(async () => {
    if (!certificateId) return;

    try {
      const blob =
        await adminCertificateService.downloadCertificate(certificateId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to download certificate");
      console.error("Failed to download certificate:", err);
    }
  }, [certificateId]);

  /* =========================
   * Verify certificate (public)
   * ========================= */

  const verifyCertificate = useCallback(async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const data =
        await adminCertificateService.verifyCertificate(code);
      setVerificationResult(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to verify certificate");
      console.error("Failed to verify certificate:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
   * Auto load
   * ========================= */

  useEffect(() => {
    if (!autoLoad) return;

    if (studentId) {
      loadCertificatesByStudent();
    } else if (courseId) {
      loadCertificatesByCourse();
    }

    if (certificateId) {
      loadCertificateDetail();
    }
  }, [
    autoLoad,
    studentId,
    courseId,
    certificateId,
    loadCertificatesByStudent,
    loadCertificatesByCourse,
    loadCertificateDetail,
  ]);

  return {
    /* data */
    certificates,
    certificateDetail,
    verificationResult,

    /* state */
    loading,
    error,

    /* actions */
    reloadByStudent: loadCertificatesByStudent,
    reloadByCourse: loadCertificatesByCourse,
    reloadDetail: loadCertificateDetail,
    revokeCertificate,
    downloadCertificate,
    verifyCertificate,
  };
}
