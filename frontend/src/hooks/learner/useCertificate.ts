// Hooks cho certificate APIs của learner
import { useQuery } from '@tanstack/react-query';
import { learnerCertificateService } from '../../services/learner/certificateService';
import { CertificateListResponse, CertificateResponse } from '../../lib/learner/certificate/certificates';

/** Lấy danh sách certificate của student */
export function useCertificates(studentId: number) {
  return useQuery<CertificateListResponse>({
    queryKey: ['learner-certificates', studentId],
    queryFn: () => learnerCertificateService.getCertificates(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết certificate */
export function useCertificateDetail(certificateId: number) {
  return useQuery<CertificateResponse>({
    queryKey: ['learner-certificate-detail', certificateId],
    queryFn: () => learnerCertificateService.getCertificateDetail(certificateId),
    enabled: !!certificateId,
  });
}
