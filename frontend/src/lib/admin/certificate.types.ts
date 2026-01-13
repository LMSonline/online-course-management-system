export interface CertificateResponse {
  id: number;
  code: string;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  issuedAt: string;
  finalScore: number;
  grade: string;
  isRevoked: boolean;
  expiresAt?: string;
  fileUrl?: string;
}

export interface CertificateDetailResponse extends CertificateResponse {
  studentEmail: string;
  courseVersionId: number;
  versionNumber: number;
  teacherId?: number;
  teacherName?: string;
  revokeReason?: string;
  revokedAt?: string;
  revokedBy?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateVerificationResponse {
  message: string;
  code: string;
  studentName: string;
  courseName: string;
  issuedAt: string;
  expiresAt?: string;
  isValid: boolean;
  status: string;
  finalScore?: number;
  grade?: string;
  isRevoked: boolean;
  revokeReason?: string;
}
