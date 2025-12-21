package vn.uit.lms.shared.dto.response.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.ResourceType;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for lesson resource")
public class LessonResourceResponse {

    @Schema(description = "Resource ID", example = "1")
    private Long id;

    @Schema(description = "Lesson ID", example = "10")
    private Long lessonId;

    @Schema(description = "Resource type", example = "FILE")
    private ResourceType resourceType;

    @Schema(description = "Resource title", example = "Lecture Notes")
    private String title;

    @Schema(description = "Resource description")
    private String description;

    @Schema(description = "External URL (for LINK/EMBED types)")
    private String externalUrl;

    @Schema(description = "File storage ID (for FILE type)")
    private Long fileStorageId;

    @Schema(description = "Original filename (for FILE type)")
    private String fileName;

    @Schema(description = "File size in bytes (for FILE type)")
    private Long fileSizeBytes;

    @Schema(description = "Formatted file size (for FILE type)", example = "2.5 MB")
    private String formattedFileSize;

    @Schema(description = "Download URL (for FILE type, presigned)")
    private String downloadUrl;

    @Schema(description = "Display URL (external or generated)")
    private String displayUrl;

    @Schema(description = "Order index", example = "0")
    private Integer orderIndex;

    @Schema(description = "Whether this resource is required")
    private Boolean isRequired;

    @Schema(description = "Whether this resource is downloadable")
    private Boolean isDownloadable;

    @Schema(description = "Creation timestamp")
    private Instant createdAt;

    @Schema(description = "Last update timestamp")
    private Instant updatedAt;
}

