package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of learning resources
 */
@Schema(description = "Resource types")
public enum ResourceType {
    @Schema(description = "File resource (PDF, documents, etc.)")
    FILE,

    @Schema(description = "External link/URL")
    LINK,

    @Schema(description = "Embedded content (video, iframe, etc.)")
    EMBED
}
