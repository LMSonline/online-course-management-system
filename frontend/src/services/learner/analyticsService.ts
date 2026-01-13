// Service cho analytics APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { AnalyticsOverviewResponse } from '@/lib/learner/analytics/analytics';

export const learnerAnalyticsService = {
  /** Lấy tổng quan analytics của student */
  getOverview: async (studentId: number): Promise<AnalyticsOverviewResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/analytics/overview`);
    return unwrapResponse(res);
  },
};
