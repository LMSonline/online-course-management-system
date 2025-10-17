package vn.uit.lms.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.Instant;

/**
 * Generic API response wrapper for consistent output structure.
 *
 * @param <T> Type of response data
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;   // Request status: true = success, false = error
    private int status;        // HTTP status code (e.g., 200, 201, 400, 404)
    private String message;    // Descriptive message for client
    private String code;       // Business code (e.g., SUCCESS, USER_NOT_FOUND)
    private T data;            // Response data (generic)
    private Instant timestamp; // ISO 8601 timestamp for logging/debugging
    private Meta meta;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Meta {
        private String author;
        private String license;
        private String version;
    }

}
