import { axiosClient } from "@/lib/api/axios";

export const streakService = {
  getStreak: async (): Promise<number> => {
    const res = await axiosClient.get("/api/v1/users/me/streak");
    return res.data?.data ?? 0;
  },
};
