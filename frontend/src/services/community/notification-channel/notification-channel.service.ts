import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  NotificationChannelCreateRequest,
  NotificationChannelResponse,
} from "./notification-channel.types";

const NOTIFICATION_CHANNEL_PREFIX = "/admin/notification-channels";

export const notificationChannelService = {
  /**
   * Create a notification channel (Admin only)
   */
  createChannel: async (
    payload: NotificationChannelCreateRequest
  ): Promise<NotificationChannelResponse> => {
    const response = await axiosClient.post<
      ApiResponse<NotificationChannelResponse>
    >(NOTIFICATION_CHANNEL_PREFIX, payload);

    return unwrapResponse(response);
  },

  /**
   * Get all notification channels (Admin only)
   */
  getAllChannels: async (): Promise<NotificationChannelResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<NotificationChannelResponse[]>
    >(NOTIFICATION_CHANNEL_PREFIX);

    return unwrapResponse(response);
  },

  /**
   * Update a notification channel (Admin only)
   */
  updateChannel: async (
    id: number,
    payload: NotificationChannelCreateRequest
  ): Promise<NotificationChannelResponse> => {
    const response = await axiosClient.put<
      ApiResponse<NotificationChannelResponse>
    >(`${NOTIFICATION_CHANNEL_PREFIX}/${id}`, payload);

    return unwrapResponse(response);
  },
};
