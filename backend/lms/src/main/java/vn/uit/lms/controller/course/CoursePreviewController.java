package vn.uit.lms.controller.course;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.CoursePreviewService;
import vn.uit.lms.shared.dto.response.course.CoursePreviewResponse;
import vn.uit.lms.shared.annotation.ApiMessage;

import java.util.Map;

/**
 * Controller for public course preview endpoints
 * These endpoints allow anyone (authenticated or not) to view published courses and preview content
 */
@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Course Preview", description = "Public APIs for previewing published courses (no authentication required)")
public class CoursePreviewController {

    private final CoursePreviewService coursePreviewService;

    @Operation(
            summary = "Get public course preview by slug",
            description = "Get detailed preview of a published course including chapters and preview lessons. " +
                    "Only published version is shown. Lessons marked as preview can be accessed without enrollment."
    )
    @GetMapping("/courses/{slug}/preview")
    @ApiMessage("Course preview retrieved successfully")
    public ResponseEntity<CoursePreviewResponse> getCoursePreview(
            @Parameter(description = "Course slug", example = "introduction-to-java-programming")
            @PathVariable String slug
    ) {
        CoursePreviewResponse preview = coursePreviewService.getCoursePreview(slug);
        return ResponseEntity.ok(preview);
    }

    @Operation(
            summary = "Get preview lesson video streaming URL",
            description = "Get streaming URL for a preview lesson video. " +
                    "Only works for lessons marked as preview (isPreview=true). " +
                    "No authentication required for preview lessons."
    )
    @GetMapping("/lessons/{lessonId}/preview/stream-url")
    @ApiMessage("Preview video streaming URL retrieved successfully")
    public ResponseEntity<Map<String, String>> getPreviewVideoStreamUrl(
            @Parameter(description = "Lesson ID", example = "5")
            @PathVariable Long lessonId
    ) {
        String streamUrl = coursePreviewService.getPreviewVideoStreamingUrl(lessonId);
        return ResponseEntity.ok(Map.of("streamUrl", streamUrl));
    }

    @Operation(
            summary = "Check if course version is published",
            description = "Quick check to see if a course has a published version available for preview"
    )
    @GetMapping("/courses/{slug}/is-published")
    @ApiMessage("Course publication status retrieved successfully")
    public ResponseEntity<Map<String, Boolean>> isCoursePublished(
            @Parameter(description = "Course slug", example = "introduction-to-java-programming")
            @PathVariable String slug
    ) {
        boolean isPublished = coursePreviewService.isCoursePublished(slug);
        return ResponseEntity.ok(Map.of("isPublished", isPublished));
    }
}

