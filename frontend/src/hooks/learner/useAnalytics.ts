// Hooks cho analytics APIs của learner
import { useQuery } from '@tanstack/react-query';
import { learnerAnalyticsService } from '../../services/learner/analyticsService';
import { AnalyticsOverviewResponse } from '../../lib/learner/analytics/analytics';

/** Lấy tổng quan analytics của student */
export function useAnalyticsOverview(studentId: number) {
  return useQuery<AnalyticsOverviewResponse>({
    queryKey: ['learner-analytics-overview', studentId],
    queryFn: () => learnerAnalyticsService.getOverview(studentId),
    enabled: !!studentId,
  });
}
