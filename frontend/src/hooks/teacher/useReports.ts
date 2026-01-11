import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/community/report";
import { ViolationReportCreateRequest } from "@/services/community/report/report.types";
import { toast } from "sonner";

// Get my reports
export function useMyReports(page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ["my-reports", page, size],
    queryFn: () => reportService.getMyReports(page, size),
  });
}

// Get report by ID
export function useReportById(id: number | null) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => reportService.getReportById(id!),
    enabled: !!id,
  });
}

// Create report
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ViolationReportCreateRequest) =>
      reportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
      toast.success("Report submitted successfully");
    },
    onError: () => {
      toast.error("Failed to submit report");
    },
  });
}
