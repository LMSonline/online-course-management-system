import { CourseVersionResponse } from "@/services/courses/course.types";

/**
 * Kiểm tra course version có miễn phí không
 */
export function isCourseVersionFree(price?: number | string | null): boolean {
  if (price === undefined || price === null) return false;
  return Number(price) === 0;
}

/**
 * Lấy thông tin hiển thị chính cho course version (dùng cho FE)
 */
export function getCourseVersionMainInfo(version?: CourseVersionResponse | null) {
  if (!version) return null;
  return {
    id: version.id,
    courseId: version.courseId,
    versionNumber: version.versionNumber,
    title: version.title,
    description: version.description,
    price: version.price,
    durationDays: version.durationDays,
    passScore: version.passScore,
    finalWeight: version.finalWeight,
    minProgressPct: version.minProgressPct,
    status: version.status,
    notes: version.notes,
    approvedBy: version.approvedBy,
    approvedAt: version.approvedAt,
    publishedAt: version.publishedAt,
    chapterCount: version.chapterCount,
  };
}

/**
 * Format giá tiền cho course version
 */
export function formatCourseVersionPrice(price?: number | string | null, currency = "₫"): string {
  if (price === undefined || price === null) return "-";
  if (Number(price) === 0) return "Miễn phí";
  return Number(price).toLocaleString("vi-VN") + " " + currency;
}