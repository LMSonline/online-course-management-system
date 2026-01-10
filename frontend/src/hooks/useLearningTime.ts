// src/hooks/useLearningTime.ts
import { useQuery } from "@tanstack/react-query";

// Mock API response type
interface LearningTimeData {
  week_minutes: number;
  week_goal: number;
}

// Always return mock data for now
export function useLearningTime(userId: string) {
  return useQuery<LearningTimeData>({
    queryKey: ["learning-time", userId],
    queryFn: async () => {
      // Mock: 75/120 minutes this week
      return {
        week_minutes: 75,
        week_goal: 120,
      };
    },
    staleTime: 60_000,
  });
}
