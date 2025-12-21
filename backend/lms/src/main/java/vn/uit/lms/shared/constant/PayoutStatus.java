package vn.uit.lms.shared.constant;

/**
 * Trạng thái chi trả cho giảng viên
 *
 * PENDING - Đang chờ xử lý
 * COMPLETED - Đã chi trả
 * FAILED - Chi trả thất bại
 */
public enum PayoutStatus {
    PENDING,    // Đang chờ
    COMPLETED,  // Đã hoàn thành
    FAILED      // Thất bại
}

