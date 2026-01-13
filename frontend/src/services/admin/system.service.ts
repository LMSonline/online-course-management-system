import { axiosClient } from "@/lib/api/axios";
import { ApiResponse } from "@/lib/api/api.types";
import { SystemSetting } from "@/lib/admin/types";

const PREFIX = "/admin/settings";

export const systemSettingService = {
  getAll: async (): Promise<SystemSetting[]> => {
    const res = await axiosClient.get<ApiResponse<SystemSetting[]>>(PREFIX);
    return res.data.data ?? []; // 🔥 FIX TRIỆT ĐỂ
  },

  create: async (payload: any): Promise<SystemSetting> => {
    const res = await axiosClient.post<ApiResponse<SystemSetting>>(
      PREFIX,
      payload
    );
    if (!res.data.data) {
      throw new Error("SystemSetting create failed");
    }
    return res.data.data;
  },

  update: async (
    id: number,
    payload: any
  ): Promise<SystemSetting> => {
    const res = await axiosClient.put<ApiResponse<SystemSetting>>(
      `${PREFIX}/${id}`,
      payload
    );
    if (!res.data.data) {
      throw new Error("SystemSetting update failed");
    }
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`${PREFIX}/${id}`);
  },
};
