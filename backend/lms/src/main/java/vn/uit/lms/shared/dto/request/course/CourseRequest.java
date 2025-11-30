package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.uit.lms.shared.constant.Difficulty;

import java.util.List;

@Data
@Schema(description = "Request DTO for creating a new course")
public class CourseRequest {

    @NotBlank
    @Schema(
        description = "Course title",
        example = "Introduction to Java Programming",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String title;

    @NotBlank
    @Schema(
        description = "Short description of the course",
        example = "Learn Java from scratch with hands-on projects",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String shortDescription;

    @NotNull
    @Schema(
        description = "ID of the course category",
        example = "5",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Long categoryId;

    @NotNull
    @Schema(
        description = "Account ID of the instructor",
        example = "10",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Long teacherId;

    @Schema(description = "Whether enrollment is closed", example = "false")
    private Boolean isClosed = false;

    @Schema(
        description = "Course difficulty level",
        example = "BEGINNER",
        allowableValues = {"BEGINNER", "INTERMEDIATE", "ADVANCED"}
    )
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Schema(description = "Meta title for SEO", example = "Java Programming Course")
    private String metaTitle;

    @Schema(description = "Meta description for SEO", example = "Comprehensive Java course for beginners")
    private String metaDescription;

    @Schema(description = "SEO keywords", example = "java, programming, beginner, oop")
    private String seoKeywords;

    @Schema(description = "Course thumbnail URL", example = "https://example.com/images/java-course.jpg")
    private String thumbnailUrl;

    @Schema(description = "Whether the course should be indexed by search engines", example = "true")
    private Boolean isIndexed = true;

    @Schema(description = "List of tags associated with the course", example = "[\"Java\", \"Programming\", \"Backend\"]")
    private List<String> tags;
}

