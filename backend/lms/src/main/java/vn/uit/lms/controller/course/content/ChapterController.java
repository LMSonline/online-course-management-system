package vn.uit.lms.controller.course.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.content.ChapterService;
import vn.uit.lms.shared.dto.request.course.content.ChapterRequest;
import vn.uit.lms.shared.dto.request.course.content.ChapterReorderRequest;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @PostMapping("/courses/{courseId}/versions/{versionId}/chapters")
    @TeacherOnly
    public ResponseEntity<ChapterDto> createNewChapter(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId,
            @Valid @RequestBody ChapterRequest chapterRequest
    ){
        ChapterDto chapterDto = chapterService.createNewChapter(chapterRequest, courseId, versionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(chapterDto);
    }

    @GetMapping("/courses/{courseId}/versions/{versionId}/chapters")
    public ResponseEntity<List<ChapterDto>> getListChapters(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId
    ){
        return ResponseEntity.ok(chapterService.getListChapters(courseId, versionId));
    }

    @GetMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    public ResponseEntity<ChapterDto> getDetailChapter(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId,
            @PathVariable("chapterId") Long chapterId
    ){
        ChapterDto chapter = chapterService.getDetailChapter(courseId, versionId, chapterId);
        return ResponseEntity.ok(chapter);
    }

    @PutMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    @TeacherOnly
    public ResponseEntity<ChapterDto> updateChapter(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId,
            @PathVariable("chapterId") Long chapterId,
            @Valid @RequestBody ChapterRequest chapterRequest
    ){
        ChapterDto updatedChapter = chapterService.updateChapter(courseId, versionId, chapterId, chapterRequest);
        return ResponseEntity.ok(updatedChapter);
    }

    @DeleteMapping("/courses/{courseId}/versions/{versionId}/chapters/{chapterId}")
    @TeacherOnly
    public ResponseEntity<Void> deleteChapter(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId,
            @PathVariable("chapterId") Long chapterId
    ){
        chapterService.deleteChapter(courseId, versionId, chapterId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/chapters/{chapterId}/reorder")
    @TeacherOnly
    public ResponseEntity<Void> reorderChapter(
            @PathVariable("chapterId") Long chapterId,
            @Valid @RequestBody ChapterReorderRequest reorderRequest
    ){
        chapterService.reorderChapter(chapterId, reorderRequest);
        return ResponseEntity.noContent().build();
    }



}
