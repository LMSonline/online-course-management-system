package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Difficulty;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response DTO for detailed course information")
public class CourseDetailResponse {

    @Schema(description = "Course ID", example = "1")
    private Long id;

    @Schema(description = "Course title", example = "Introduction to Java Programming")
    private String title;

    @Schema(description = "Short description", example = "Learn Java from scratch")
    private String shortDescription;

    @Schema(description = "Difficulty level", example = "BEGINNER")
    private Difficulty difficulty;

    @Schema(description = "Thumbnail URL", example = "https://example.com/images/java-course.jpg")
    private String thumbnailUrl;

    @Schema(description = "SEO-friendly URL slug", example = "introduction-to-java-programming")
    private String slug;

    @Schema(description = "Canonical URL", example = "https://example.com/courses/java")
    private String canonicalUrl;

    @Schema(description = "Meta title for SEO", example = "Java Programming Course")
    private String metaTitle;

    @Schema(description = "Meta description for SEO", example = "Comprehensive Java course")
    private String metaDescription;

    @Schema(description = "SEO keywords", example = "java, programming, beginner")
    private String seoKeywords;

    @Schema(description = "Whether the course is indexed by search engines", example = "true")
    private boolean indexed;

    @Schema(description = "Whether enrollment is closed", example = "false")
    private Boolean isClosed;

    @Schema(description = "Category information")
    private CategoryDto category;

    @Schema(description = "Teacher/instructor ID", example = "5")
    private Long teacherId;

    @Schema(description = "Public version ID", example = "10")
    private Long PublicVersionId;

    @Schema(description = "List of tags", example = "[\"Java\", \"Programming\", \"Backend\"]")
    private List<String> tags;

    @Data
    @Schema(description = "Category information")
    public static class CategoryDto {
        @Schema(description = "Category ID", example = "1")
        private Long id;

        @Schema(description = "Category name", example = "Programming")
        private String name;

        @Schema(description = "Category code", example = "PROG")
        private String code;

        @Schema(description = "Category description", example = "Software development courses")
        private String description;
    }
}

