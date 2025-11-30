package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response DTO for course category")
public class CategoryResponseDto {
    @Schema(description = "Category ID", example = "1")
    private Long id;

    @Schema(description = "Category name", example = "Programming")
    private String name;

    @Schema(description = "Category code", example = "PROG")
    private String code;

    @Schema(description = "Category description", example = "Courses related to software development")
    private String description;

    @Schema(description = "Whether the category is visible", example = "true")
    private Boolean visible;

    @Schema(description = "Parent category ID (for subcategories)", example = "null")
    private Long parentId;

    @Schema(description = "Deletion timestamp (soft delete)", example = "null")
    private Instant deletedAt;

    @Schema(description = "List of child categories")
    private List<CategoryResponseDto> children = new ArrayList<>();

    @Schema(description = "SEO-friendly URL slug", example = "programming")
    private String slug;

    @Schema(description = "Meta title for SEO", example = "Programming Courses")
    private String metaTitle;

    @Schema(description = "Meta description for SEO", example = "Learn programming with our comprehensive courses")
    private String metaDescription;

    @Schema(description = "Thumbnail image URL", example = "https://example.com/images/programming.jpg")
    private String thumbnailUrl;

}
