package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Difficulty;
import vn.uit.lms.shared.dto.response.course.content.ChapterPreviewDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * DTO for public course preview
 * Contains only published course version with public chapters and lessons
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Public course preview information")
public class CoursePreviewResponse {

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

    @Schema(description = "Category information")
    private CategoryDto category;

    @Schema(description = "Teacher/instructor information")
    private TeacherDto teacher;

    @Schema(description = "List of tags", example = "[\"Java\", \"Programming\", \"Backend\"]")
    private List<String> tags;

    @Schema(description = "Published version information")
    private PublishedVersionDto publishedVersion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Category information")
    public static class CategoryDto {
        @Schema(description = "Category ID", example = "1")
        private Long id;

        @Schema(description = "Category name", example = "Programming")
        private String name;

        @Schema(description = "Category code", example = "PROG")
        private String code;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Teacher information")
    public static class TeacherDto {
        @Schema(description = "Teacher ID", example = "5")
        private Long id;

        @Schema(description = "Teacher name", example = "John Doe")
        private String name;

        @Schema(description = "Teacher email", example = "john.doe@example.com")
        private String email;

        @Schema(description = "Teacher bio", example = "Experienced Java developer with 10+ years")
        private String bio;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Published version details")
    public static class PublishedVersionDto {
        @Schema(description = "Version ID", example = "10")
        private Long id;

        @Schema(description = "Version number", example = "1")
        private Integer versionNumber;

        @Schema(description = "Version title", example = "Introduction to Java Programming v1")
        private String title;

        @Schema(description = "Version description")
        private String description;

        @Schema(description = "Course price", example = "99.99")
        private BigDecimal price;

        @Schema(description = "Course duration in days", example = "30")
        private Integer durationDays;

        @Schema(description = "Published date")
        private Instant publishedAt;

        @Schema(description = "Total number of chapters", example = "10")
        private Integer totalChapters;

        @Schema(description = "Total number of lessons", example = "45")
        private Integer totalLessons;

        @Schema(description = "Total duration in seconds", example = "18000")
        private Integer totalDurationSeconds;

        @Schema(description = "Number of preview lessons available", example = "5")
        private Integer previewLessonsCount;

        @Schema(description = "List of chapters (includes only preview lessons for non-enrolled users)")
        private List<ChapterPreviewDto> chapters;
    }
}

