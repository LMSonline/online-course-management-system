package vn.uit.lms.shared.constant;

public enum ZaloPaymentMethod {
    ALL(""),  // Hiển thị tất cả phương thức
    VIET_QR("vietqr"),  // QR đa năng (VietQR)
    INTERNATIONAL_CARD("international_card"),  // Thẻ tín dụng/ghi nợ
    DOMESTIC_CARD("domestic_card"),  // Thẻ ATM
    ACCOUNT("account"),  // Tài khoản ngân hàng
    ZALOPAY_WALLET("zalopay_wallet"),  // Ví ZaloPay
    BNPL("bnpl");  // Mua trước trả sau

    private final String value;

    ZaloPaymentMethod(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
