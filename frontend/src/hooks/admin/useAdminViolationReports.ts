import { useEffect, useState, useCallback } from "react";
import { adminViolationReportService } from "@/services/admin/violation-report.service";
import type {
  ViolationReportResponse,
  ViolationReportDetailResponse,
} from "@/lib/admin/violation-report.types";

export function useAdminViolationReports({
  autoLoad = false,
}: {
  autoLoad?: boolean;
}) {
  const [reports, setReports] = useState<ViolationReportResponse[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<ViolationReportDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD LIST ================= */
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const page = await adminViolationReportService.getAll({
        page: 0,
        size: 10,
      });
      setReports(page.items);
    } catch (e: any) {
      setError(e.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= LOAD DETAIL ================= */
  const loadReportDetail = async (id: number) => {
    const data = await adminViolationReportService.getById(id);
    setSelectedReport(data);
  };

  /* ================= ACTIONS ================= */
  const reviewReport = async (
    id: number,
    payload: { note?: string }
  ) => {
    await adminViolationReportService.review(id, payload);
    await loadReports();          //  SYNC LIST
    await loadReportDetail(id);   //  SYNC DETAIL
  };

  const dismissReport = async (
    id: number,
    payload: { reason: string }
  ) => {
    await adminViolationReportService.dismiss(id, payload);
    await loadReports();          //  SYNC LIST
    await loadReportDetail(id);   //  SYNC DETAIL
  };

  const takeAction = async (
    id: number,
    payload: { action: string; note?: string }
  ) => {
    await adminViolationReportService.takeAction(id, payload);
    await loadReports();          //  SYNC LIST
    await loadReportDetail(id);   //  SYNC DETAIL
  };

  useEffect(() => {
    if (autoLoad) loadReports();
  }, [autoLoad, loadReports]);

  return {
    reports,
    selectedReport,
    loading,
    error,
    loadReportDetail,
    reviewReport,
    dismissReport,
    takeAction,
  };
}
