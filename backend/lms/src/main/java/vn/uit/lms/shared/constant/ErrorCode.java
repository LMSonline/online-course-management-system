package vn.uit.lms.shared.constant;

public class ErrorCode {
    // 400 - Bad Request
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String BAD_REQUEST = "BAD_REQUEST";
    public static final String DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE";

    // 401 - Unauthorized
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String TOKEN_INVALID = "TOKEN_INVALID";

    // 403 - Forbidden
    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String ACCESS_DENIED = "ACCESS_DENIED";

    // 404 - Not Found
    public static final String RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
    public static final String ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";

    // 500 - Internal Server Error
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
    public static final String DATABASE_ERROR = "DATABASE_ERROR";

    private ErrorCode() {}
}
