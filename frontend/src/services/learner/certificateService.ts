// Service cho certificate APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { CertificateListResponse, CertificateResponse } from '@/lib/learner/certificate/certificates';

export const learnerCertificateService = {
  /** Lấy danh sách certificate của student */
  getCertificates: async (studentId: number): Promise<CertificateListResponse> => {
    const res = await axiosClient.get(`/api/v1/students/${studentId}/certificates`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết certificate */
  getCertificateDetail: async (certificateId: number): Promise<CertificateResponse> => {
    const res = await axiosClient.get(`/api/v1/certificates/${certificateId}`);
    return unwrapResponse(res);
  },
};
