package vn.uit.lms.shared.constant;

/**
 * Payment transaction status
 */
public enum PaymentStatus {
    PENDING,        // Chờ thanh toán
    PROCESSING,     // Đang xử lý
    SUCCESS,        // Thành công
    FAILED,         // Thất bại
    CANCELLED,      // Đã hủy
    REFUNDED,       // Đã hoàn tiền
    EXPIRED         // Hết hạn
}

