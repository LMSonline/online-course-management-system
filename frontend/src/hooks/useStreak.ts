import { useQuery } from "@tanstack/react-query";
import { streakService } from "@/services/user/streak.service";

export const useStreak = () => {
  return useQuery({
    queryKey: ["user-streak"],
    queryFn: streakService.getStreak,
  });
};
