package vn.uit.lms.shared.dto.request.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for exporting users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for exporting user data")
public class ExportUsersRequest {

    @Schema(description = "Export format", example = "CSV", allowableValues = {"CSV", "EXCEL"})
    @NotNull(message = "Export format is required")
    private ExportFormat format;

    @Schema(description = "Include inactive accounts", example = "false")
    private Boolean includeInactive = false;

    @Schema(description = "Include suspended accounts", example = "false")
    private Boolean includeSuspended = false;

    @Schema(description = "Include rejected accounts", example = "false")
    private Boolean includeRejected = false;

    @Schema(description = "Include deleted accounts", example = "false")
    private Boolean includeDeleted = false;

    @Schema(description = "Fields to include in export (comma separated)",
            example = "username,email,role,status,createdAt")
    private String fields;

    public enum ExportFormat {
        CSV, EXCEL
    }
}

