import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemSettingService } from "@/services/admin/system.service";

export const useSystemSettings = () =>
  useQuery({
    queryKey: ["admin", "system-settings"],
    queryFn: systemSettingService.getAll,
  });

export const useCreateSystemSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: systemSettingService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "system-settings"] }),
  });
};

export const useUpdateSystemSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      systemSettingService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "system-settings"] }),
  });
};

export const useDeleteSystemSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: systemSettingService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "system-settings"] }),
  });
};
