package vn.uit.lms.shared.dto.request.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.ResourceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for creating/updating a lesson resource")
public class LessonResourceRequest {

    @NotNull(message = "Resource type is required")
    @Schema(description = "Type of resource", example = "FILE", requiredMode = Schema.RequiredMode.REQUIRED)
    private ResourceType resourceType;

    @NotBlank(message = "Title is required")
    @Schema(description = "Resource title", example = "Lecture Notes PDF", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "Resource description", example = "Comprehensive notes for this lesson")
    private String description;

    @Schema(description = "External URL (for LINK/EMBED types)", example = "https://youtube.com/watch?v=...")
    private String externalUrl;

    @Schema(description = "Whether this resource is required", example = "false")
    private Boolean isRequired;

    @Schema(description = "File storage ID (for FILE type, set after upload)")
    private Long fileStorageId;
}

