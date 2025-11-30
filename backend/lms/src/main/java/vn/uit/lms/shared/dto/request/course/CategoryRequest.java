package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request DTO for creating or updating a course category")
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    @Schema(
        description = "Category name",
        example = "Programming",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = 255
    )
    private String name;

    @Size(max = 100, message = "Code must be at most 100 characters")
    @Schema(description = "Category code", example = "PROG", maxLength = 100)
    private String code;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    @Schema(description = "Category description", example = "Courses related to software development", maxLength = 1000)
    private String description;

    @Schema(description = "Parent category ID (for subcategories)", example = "1")
    private Long parentId;

    @Schema(description = "Whether the category is visible", example = "true")
    private boolean visible;

    @Size(max = 255)
    @Schema(description = "SEO-friendly URL slug", example = "programming", maxLength = 255)
    private String slug;

    @Size(max = 255)
    @Schema(description = "Meta title for SEO", example = "Programming Courses", maxLength = 255)
    private String metaTitle;

    @Size(max = 1000)
    @Schema(description = "Meta description for SEO", example = "Learn programming with our comprehensive courses", maxLength = 1000)
    private String metaDescription;

    @Size(max = 512)
    @Schema(description = "Thumbnail image URL", example = "https://example.com/images/programming.jpg", maxLength = 512)
    private String thumbnailUrl;
}
