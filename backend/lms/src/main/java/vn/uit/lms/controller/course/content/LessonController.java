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
import vn.uit.lms.service.course.content.LessonService;
import vn.uit.lms.shared.dto.request.course.content.CreateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateVideoRequest;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;
import vn.uit.lms.shared.dto.response.course.content.RequestUploadUrlResponse;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Lesson Management", description = "APIs for managing lessons and video uploads")
public class LessonController {

    private final LessonService lessonService;

    @Operation(summary = "Create new lesson")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/chapters/{chapterId}/lessons")
    @TeacherOnly
    public ResponseEntity<LessonDTO> createLesson(
            @Parameter(description = "Lesson details") @Valid @RequestBody CreateLessonRequest request,
            @Parameter(description = "Chapter ID") @PathVariable("chapterId") Long chapterId
    ) {
        LessonDTO response = lessonService.createLesson(request, chapterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Request presigned URL for video upload")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/lessons/{lessonId}/request-upload-url")
    @TeacherOnly
    public ResponseEntity<RequestUploadUrlResponse> requestUploadUrl(
            @Parameter(description = "Lesson ID") @PathVariable("lessonId") Long lessonId
    ) {
        RequestUploadUrlResponse response = lessonService.requestUploadUrl(lessonId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all lessons of a chapter")
    @GetMapping("/chapters/{chapterId}/lessons")
    public ResponseEntity<List<LessonDTO>> getLessonsByChapter(
            @Parameter(description = "Chapter ID") @PathVariable("chapterId") Long chapterId
    ){
        List<LessonDTO> lessons = lessonService.getLessonsByChapter(chapterId);
        return ResponseEntity.ok(lessons);
    }

    @Operation(summary = "Notify server of completed video upload")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/lessons/{lessonId}/upload-complete")
    @TeacherOnly
    public ResponseEntity<LessonDTO> uploadComplete(
            @Parameter(description = "Lesson ID") @PathVariable("lessonId") Long lessonId,
            @Parameter(description = "Video upload details") @Valid @RequestBody UpdateVideoRequest request
    ) {
        LessonDTO lessonDTO = lessonService.uploadVideoLessonComplete(lessonId, request);
        return ResponseEntity.ok(lessonDTO);
    }
}