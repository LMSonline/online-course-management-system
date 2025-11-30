package vn.uit.lms.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Generic API response wrapper for consistent output structure")
public class ApiResponse<T> {

    @Schema(description = "Request status: true = success, false = error", example = "true")
    private boolean success;

    @Schema(description = "HTTP status code", example = "200")
    private int status;

    @Schema(description = "Descriptive message for client", example = "Request processed successfully")
    private String message;

    @Schema(description = "Business code", example = "SUCCESS")
    private String code;

    @Schema(description = "Response data (generic)")
    private T data;

    @Schema(description = "ISO 8601 timestamp for logging/debugging", example = "2025-11-30T10:15:30Z")
    private Instant timestamp;

    @Schema(description = "Metadata information")
    private Meta meta;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Schema(description = "Metadata information about the API")
    public static class Meta {
        @Schema(description = "Author of the API", example = "LMS Team")
        private String author;

        @Schema(description = "License type", example = "MIT")
        private String license;

        @Schema(description = "API version", example = "1.0.0")
        private String version;
    }

}
