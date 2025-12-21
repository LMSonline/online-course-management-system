package vn.uit.lms.shared.constant;

/**
 * Trạng thái đăng ký học
 *
 * ENROLLED - Đang học
 * COMPLETED - Đã hoàn thành
 * CANCELLED - Đã hủy (học viên tự hủy hoặc bị hủy do vi phạm)
 * EXPIRED - Hết hạn (quá thời gian học mà chưa hoàn thành)
 */
public enum EnrollmentStatus {
    ENROLLED,    // Đang học
    COMPLETED,   // Đã hoàn thành
    CANCELLED,   // Đã hủy
    EXPIRED      // Hết hạn
}

