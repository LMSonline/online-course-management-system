package vn.uit.lms.controller.learning;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.content.ChapterService;
import vn.uit.lms.service.course.content.LessonService;
import vn.uit.lms.service.course.content.LessonResourceService;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;
import vn.uit.lms.shared.dto.response.resource.LessonResourceResponse;
import vn.uit.lms.shared.annotation.ApiMessage;
import vn.uit.lms.shared.annotation.StudentOnly;

import java.util.List;
import java.util.Map;

/**
 * Student Course Access Controller
 *
 * Provides endpoints for students to access course content they are enrolled in.
 * All endpoints verify enrollment before returning data.
 *
 * Access Control:
 * - All endpoints require STUDENT role
 * - All endpoints verify active enrollment through EnrollmentAccessService
 * - Preview content may be accessible without enrollment
 */
@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Tag(name = "Student Course Access", description = "APIs for students to access enrolled course content")
@SecurityRequirement(name = "bearerAuth")
public class StudentCourseController {

    private final ChapterService chapterService;
    private final LessonService lessonService;
    private final LessonResourceService lessonResourceService;

    /* ==================== CHAPTER ACCESS ==================== */

    @Operation(
        summary = "Get all chapters in enrolled course",
        description = "Get all chapters from the published version of a course the student is enrolled in. " +
                     "Requires active enrollment."
    )
    @GetMapping("/courses/{courseId}/chapters")
    @ApiMessage("Chapters retrieved successfully")
    @StudentOnly
    public ResponseEntity<List<ChapterDto>> getEnrolledCourseChapters(
            @Parameter(description = "Course ID", required = true)
            @PathVariable("courseId") Long courseId
    ) {
        List<ChapterDto> chapters = chapterService.getChaptersForStudent(courseId);
        return ResponseEntity.ok(chapters);
    }

    @Operation(
        summary = "Get chapter details for enrolled student",
        description = "Get detailed information about a specific chapter. " +
                     "Requires enrollment in the course containing this chapter."
    )
    @GetMapping("/chapters/{chapterId}")
    @ApiMessage("Chapter details retrieved successfully")
    @StudentOnly
    public ResponseEntity<ChapterDto> getChapterDetails(
            @Parameter(description = "Chapter ID", required = true)
            @PathVariable("chapterId") Long chapterId
    ) {
        ChapterDto chapter = chapterService.getChapterForStudent(chapterId);
        return ResponseEntity.ok(chapter);
    }

    /* ==================== LESSON ACCESS ==================== */

    @Operation(
        summary = "Get all lessons in a chapter",
        description = "Get all lessons in a chapter for enrolled student. " +
                     "Requires enrollment in the course containing this chapter."
    )
    @GetMapping("/chapters/{chapterId}/lessons")
    @ApiMessage("Lessons retrieved successfully")
    @StudentOnly
    public ResponseEntity<List<LessonDTO>> getChapterLessons(
            @Parameter(description = "Chapter ID", required = true)
            @PathVariable("chapterId") Long chapterId
    ) {
        List<LessonDTO> lessons = lessonService.getLessonsForStudent(chapterId);
        return ResponseEntity.ok(lessons);
    }

    @Operation(
        summary = "Get lesson details for enrolled student",
        description = "Get detailed information about a specific lesson. " +
                     "Preview lessons can be accessed without enrollment. " +
                     "Non-preview lessons require active enrollment."
    )
    @GetMapping("/lessons/{lessonId}")
    @ApiMessage("Lesson details retrieved successfully")
    @StudentOnly
    public ResponseEntity<LessonDTO> getLessonDetails(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable("lessonId") Long lessonId
    ) {
        LessonDTO lesson = lessonService.getLessonForStudent(lessonId);
        return ResponseEntity.ok(lesson);
    }

    /* ==================== VIDEO STREAMING ==================== */

    @Operation(
        summary = "Get video streaming URL for enrolled student",
        description = "Get HLS streaming URL for a lesson's video. " +
                     "Preview lessons can be streamed without enrollment. " +
                     "Non-preview lessons require active enrollment. " +
                     "Returns a data URI with presigned URLs for HLS segments (valid for 1 hour)."
    )
    @GetMapping("/lessons/{lessonId}/video/stream")
    @ApiMessage("Video streaming URL retrieved successfully")
    @StudentOnly
    public ResponseEntity<Map<String, String>> getVideoStreamingUrl(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable("lessonId") Long lessonId
    ) {
        String streamUrl = lessonService.getVideoStreamingUrlForStudent(lessonId);
        return ResponseEntity.ok(Map.of(
            "streamUrl", streamUrl,
            "type", "hls",
            "expiresIn", "3600"
        ));
    }

    /* ==================== LESSON RESOURCES ==================== */

    @Operation(
        summary = "Get all resources for a lesson",
        description = "Get all resources (files, links, embeds) attached to a lesson. " +
                     "Preview lessons are accessible without enrollment. " +
                     "Non-preview lessons require active enrollment. " +
                     "Returns resources with download URLs (valid for 1 hour)."
    )
    @GetMapping("/lessons/{lessonId}/resources")
    @ApiMessage("Lesson resources retrieved successfully")
    @StudentOnly
    public ResponseEntity<List<LessonResourceResponse>> getLessonResources(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable("lessonId") Long lessonId
    ) {
        List<LessonResourceResponse> resources = lessonResourceService.getLessonResourcesForStudent(lessonId);
        return ResponseEntity.ok(resources);
    }

    @Operation(
        summary = "Get specific resource details",
        description = "Get detailed information about a specific lesson resource. " +
                     "Includes download URL for file resources (valid for 1 hour). " +
                     "Preview lessons are accessible without enrollment. " +
                     "Non-preview lessons require active enrollment."
    )
    @GetMapping("/lessons/{lessonId}/resources/{resourceId}")
    @ApiMessage("Resource details retrieved successfully")
    @StudentOnly
    public ResponseEntity<LessonResourceResponse> getResourceDetails(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable("lessonId") Long lessonId,

            @Parameter(description = "Resource ID", required = true)
            @PathVariable("resourceId") Long resourceId
    ) {
        LessonResourceResponse resource = lessonResourceService.getResourceByIdForStudent(lessonId, resourceId);
        return ResponseEntity.ok(resource);
    }

    /* ==================== COURSE STRUCTURE ==================== */

    @Operation(
        summary = "Get complete course structure",
        description = "Get the complete structure of an enrolled course including all chapters and lessons. " +
                     "Requires active enrollment. Returns hierarchical data: Course -> Chapters -> Lessons."
    )
    @GetMapping("/courses/{courseId}/structure")
    @ApiMessage("Course structure retrieved successfully")
    @StudentOnly
    public ResponseEntity<Map<String, Object>> getCourseStructure(
            @Parameter(description = "Course ID", required = true)
            @PathVariable("courseId") Long courseId
    ) {
        List<ChapterDto> chapters = chapterService.getChaptersForStudent(courseId);

        // Build hierarchical structure
        return ResponseEntity.ok(Map.of(
            "courseId", courseId,
            "totalChapters", chapters.size(),
            "chapters", chapters
        ));
    }
}

