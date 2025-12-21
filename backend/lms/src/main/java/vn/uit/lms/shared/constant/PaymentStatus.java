package vn.uit.lms.shared.constant;

/**
 * Trạng thái thanh toán
 *
 * PENDING - Đang chờ xử lý
 * SUCCESS - Thanh toán thành công
 * FAILED - Thanh toán thất bại
 * REFUNDED - Đã hoàn tiền
 */
public enum PaymentStatus {
    PENDING,   // Đang chờ
    SUCCESS,   // Thành công
    FAILED,    // Thất bại
    REFUNDED   // Đã hoàn tiền
}

