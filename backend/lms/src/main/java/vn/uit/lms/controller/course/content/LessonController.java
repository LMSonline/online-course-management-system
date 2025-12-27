package vn.uit.lms.controller.course.content;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.domain.course.content.LessonResource;
import vn.uit.lms.service.course.content.LessonService;
import vn.uit.lms.shared.dto.request.course.content.CreateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.ReorderLessonsRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateVideoRequest;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;
import vn.uit.lms.shared.dto.response.course.content.RequestUploadUrlResponse;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.util.annotation.Authenticated;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Lesson Management", description = "APIs for managing lessons and video uploads")
@SecurityRequirement(name = "bearerAuth")
public class LessonController {

    private final LessonService lessonService;

    @Operation(summary = "Create new lesson", description = "Create a new lesson in a chapter. Only accessible by teachers.")
    @PostMapping("/chapters/{chapterId}/lessons")
    @ApiMessage("Lesson created successfully")
    @TeacherOnly
    public ResponseEntity<LessonDTO> createLesson(
            @Parameter(description = "Chapter ID", required = true) @PathVariable("chapterId") Long chapterId,
            @Parameter(description = "Lesson details", required = true) @Valid @RequestBody CreateLessonRequest request
    ) {
        LessonDTO response = lessonService.createLesson(request, chapterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get all lessons of a chapter", description = "Retrieve all lessons in a specific chapter")
    @GetMapping("/chapters/{chapterId}/lessons")
    @ApiMessage("Lessons retrieved successfully")
    @Authenticated
    public ResponseEntity<List<LessonDTO>> getLessonsByChapter(
            @Parameter(description = "Chapter ID", required = true) @PathVariable("chapterId") Long chapterId
    ){
        List<LessonDTO> lessons = lessonService.getLessonsByChapter(chapterId);
        return ResponseEntity.ok(lessons);
    }

    @Operation(summary = "Get lesson details", description = "Retrieve detailed information about a specific lesson")
    @GetMapping("/lessons/{id}")
    @ApiMessage("Lesson details retrieved successfully")
    @Authenticated
    public ResponseEntity<LessonDTO> getLessonById(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("id") Long id
    ) {
        LessonDTO lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }

    @Operation(summary = "Update lesson", description = "Update lesson information. Only accessible by teachers.")
    @PutMapping("/lessons/{id}")
    @ApiMessage("Lesson updated successfully")
    @TeacherOnly
    public ResponseEntity<LessonDTO> updateLesson(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("id") Long id,
            @Parameter(description = "Updated lesson details", required = true) @Valid @RequestBody UpdateLessonRequest request
    ) {
        LessonDTO updated = lessonService.updateLesson(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete lesson", description = "Delete a lesson and its associated resources. Only accessible by teachers.")
    @DeleteMapping("/lessons/{id}")
    @ApiMessage("Lesson deleted successfully")
    @TeacherOnly
    public ResponseEntity<Void> deleteLesson(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("id") Long id
    ) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reorder lessons", description = "Reorder lessons within a chapter. Only accessible by teachers.")
    @PostMapping("/chapters/{chapterId}/lessons/reorder")
    @ApiMessage("Lessons reordered successfully")
    @TeacherOnly
    public ResponseEntity<Void> reorderLessons(
            @Parameter(description = "Chapter ID", required = true) @PathVariable("chapterId") Long chapterId,
            @Parameter(description = "New lesson order", required = true) @Valid @RequestBody ReorderLessonsRequest request
    ) {
        lessonService.reorderLessons(chapterId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Request video upload URL", description = "Get a presigned URL for uploading a video to a lesson. Only accessible by teachers.")
    @GetMapping("/lessons/{lessonId}/video/upload-url")
    @ApiMessage("Upload URL generated successfully")
    @TeacherOnly
    public ResponseEntity<RequestUploadUrlResponse> requestUploadUrl(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("lessonId") Long lessonId
    ) {
        RequestUploadUrlResponse response = lessonService.requestUploadUrl(lessonId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Complete video upload", description = "Notify server that video upload is complete and trigger processing. Only accessible by teachers.")
    @PostMapping("/lessons/{lessonId}/video/upload-complete")
    @ApiMessage("Video upload completed, processing started")
    @TeacherOnly
    public ResponseEntity<LessonDTO> uploadComplete(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("lessonId") Long lessonId,
            @Parameter(description = "Video upload details", required = true) @Valid @RequestBody UpdateVideoRequest request
    ) {
        LessonDTO lessonDTO = lessonService.uploadVideoLessonComplete(lessonId, request);
        return ResponseEntity.ok(lessonDTO);
    }

    @Operation(summary = "Get video streaming URL", description = "Get a presigned URL for streaming a lesson's video")
    @GetMapping("/lessons/{lessonId}/video/stream-url")
    @ApiMessage("Streaming URL generated successfully")
    @Authenticated
    public ResponseEntity<Map<String, String>> getVideoStreamingUrl(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("lessonId") Long lessonId
    ) {
        String streamUrl = lessonService.getVideoStreamingUrl(lessonId);
        return ResponseEntity.ok(Map.of("streamUrl", streamUrl));
    }

    @Operation(summary = "Delete lesson video", description = "Delete the video associated with a lesson. Only accessible by teachers.")
    @DeleteMapping("/lessons/{lessonId}/video")
    @ApiMessage("Video deleted successfully")
    @TeacherOnly
    public ResponseEntity<LessonDTO> deleteVideo(
            @Parameter(description = "Lesson ID", required = true) @PathVariable("lessonId") Long lessonId
    ) {
        LessonDTO updated = lessonService.deleteVideo(lessonId);
        return ResponseEntity.ok(updated);
    }
}