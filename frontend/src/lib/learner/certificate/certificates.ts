// Type definitions for learner certificate APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Certificate {
  id: number;
  studentId: number;
  courseId: number;
  issuedAt: string;
  certificateUrl: string;
  status: 'issued' | 'revoked';
}

export interface CertificateListResponse {
  certificates: Certificate[];
}

export interface CertificateResponse {
  certificate: Certificate;
}
