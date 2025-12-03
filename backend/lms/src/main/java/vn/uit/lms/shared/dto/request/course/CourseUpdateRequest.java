package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import vn.uit.lms.shared.constant.Difficulty;

import java.util.List;

@Data
@Schema(description = "Request DTO for updating an existing course")
public class CourseUpdateRequest {

    @Schema(description = "Course title", example = "Advanced Java Programming")
    private String title;

    @Schema(description = "Short description of the course", example = "Master advanced Java concepts")
    private String shortDescription;

    @Schema(description = "ID of the course category", example = "5")
    private Long categoryId;

    @Schema(description = "Account ID of the instructor", example = "10")
    private Long teacherId;

    @Schema(description = "Whether enrollment is closed", example = "false")
    private Boolean isClosed = false;

    @Schema(
        description = "Course difficulty level",
        example = "ADVANCED",
        allowableValues = {"BEGINNER", "INTERMEDIATE", "ADVANCED"}
    )
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Schema(description = "Meta title for SEO", example = "Advanced Java Course")
    private String metaTitle;

    @Schema(description = "Meta description for SEO", example = "Advanced Java programming techniques")
    private String metaDescription;

    @Schema(description = "SEO keywords", example = "java, advanced, multithreading, streams")
    private String seoKeywords;

    @Schema(description = "Course thumbnail URL", example = "https://example.com/images/advanced-java.jpg")
    private String thumbnailUrl;

    @Schema(description = "Whether the course should be indexed by search engines", example = "true")
    private Boolean isIndexed = true;

    @Schema(description = "List of tags associated with the course", example = "[\"Java\", \"Advanced\", \"Concurrency\"]")
    private List<String> tags;
}
