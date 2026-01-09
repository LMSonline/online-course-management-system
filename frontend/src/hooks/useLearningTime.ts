import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLearningTime = (userId: string) => {
  return useQuery({
    queryKey: ["learning-time", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/analytics/learning-time/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};
