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
@Schema(description = "Response DTO for course summary")
public class CourseResponse {

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

    @Schema(description = "Whether enrollment is closed", example = "false")
    private Boolean isClosed;

    @Schema(description = "Category ID", example = "5")
    private Long categoryId;

    @Schema(description = "Category name", example = "Programming")
    private String categoryName;

    @Schema(description = "Teacher/instructor ID", example = "10")
    private Long teacherId;

    @Schema(description = "Teacher/instructor name", example = "Dr. John Smith")
    private String teacherName;

    @Schema(description = "Public version ID", example = "15")
    private Long publicVersionId;

    @Schema(description = "List of tags associated with the course", example = "[\"Java\", \"Programming\", \"Backend\"]")
    private List<String> tags;

}

