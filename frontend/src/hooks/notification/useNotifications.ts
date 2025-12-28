import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communityService } from "@/services/community/community.service";
import { NotificationResponse, PageResponse } from "@/services/community/community.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";
import { DEMO_NOTIFICATIONS, createDemoPageResponse } from "@/lib/demo/demoData";
import { toast } from "sonner";

/**
 * Hook to fetch notifications
 * Contract Key: NOTIFICATION_GET_LIST
 */
export function useNotifications(page: number = 0, size: number = 20) {
  return useQuery<PageResponse<NotificationResponse>>({
    queryKey: [CONTRACT_KEYS.NOTIFICATION_GET_LIST, { page, size }],
    queryFn: async () => {
      if (DEMO_MODE) {
        return createDemoPageResponse(DEMO_NOTIFICATIONS, page + 1, size);
      }
      return communityService.getNotifications(page, size);
    },
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to mark notification as read
 * Contract Key: NOTIFICATION_MARK_READ_ACTION
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => communityService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.NOTIFICATION_GET_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.NOTIFICATION_GET_UNREAD_COUNT],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
}

