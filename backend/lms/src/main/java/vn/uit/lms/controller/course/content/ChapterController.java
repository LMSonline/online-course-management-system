package vn.uit.lms.controller.course.content;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.content.ChapterService;
import vn.uit.lms.shared.dto.request.course.content.ChapterRequest;
import vn.uit.lms.shared.dto.request.course.content.ChapterReorderRequest;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;
import vn.uit.lms.shared.annotation.Authenticated;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Chapter Management", description = "APIs for managing course chapters")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @Operation(summary = "Create a new chapter")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/chapters")
    @TeacherOnly
    public ResponseEntity<ChapterDto> createNewChapter(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Chapter details") @Valid @RequestBody ChapterRequest chapterRequest
    ){
        ChapterDto chapterDto = chapterService.createNewChapter(chapterRequest, courseId, versionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(chapterDto);
    }

    @Operation(summary = "Get all chapters")
    @GetMapping("/courses/{courseId}/versions/{versionId}/chapters")
    @Authenticated
    public ResponseEntity<List<ChapterDto>> getListChapters(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId
    ){
        return ResponseEntity.ok(chapterService.getListChapters(courseId, versionId));
    }

    @Operation(summary = "Get chapter details")
    @GetMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    @Authenticated
    public ResponseEntity<ChapterDto> getDetailChapter(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Chapter ID") @PathVariable("chapterId") Long chapterId
    ){
        ChapterDto chapter = chapterService.getDetailChapter(courseId, versionId, chapterId);
        return ResponseEntity.ok(chapter);
    }

    @Operation(summary = "Update a chapter")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    @TeacherOnly
    public ResponseEntity<ChapterDto> updateChapter(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Chapter ID") @PathVariable("chapterId") Long chapterId,
            @Parameter(description = "Updated chapter details") @Valid @RequestBody ChapterRequest chapterRequest
    ){
        ChapterDto updatedChapter = chapterService.updateChapter(courseId, versionId, chapterId, chapterRequest);
        return ResponseEntity.ok(updatedChapter);
    }

    @Operation(summary = "Delete a chapter")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    @TeacherOnly
    public ResponseEntity<Void> deleteChapter(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Chapter ID") @PathVariable("chapterId") Long chapterId
    ){
        chapterService.deleteChapter(courseId, versionId, chapterId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reorder chapters", description = "Reorder chapters within a course version. Provide ordered list of chapter IDs.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/chapters/reorder")
    @TeacherOnly
    public ResponseEntity<Void> reorderChapters(
            @Parameter(description = "Course ID", required = true) @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID", required = true) @PathVariable("versionId") Long versionId,
            @Parameter(description = "Ordered list of chapter IDs", required = true) @Valid @RequestBody ChapterReorderRequest reorderRequest
    ){
        chapterService.reorderChapters(courseId, versionId, reorderRequest);
        return ResponseEntity.ok().build();
    }

}
