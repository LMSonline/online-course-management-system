package vn.uit.lms.controller.course;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.course.Tag;
import vn.uit.lms.service.course.TagService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.TagRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

@RestController
@RequestMapping("/api/v1/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    @AdminOnly
    public ResponseEntity<Tag> createTag(@Valid @RequestBody TagRequest tagRequest) {
        Tag createdTag = tagService.createTag(tagRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTag);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PageResponse<Tag>> getTags(Pageable pageable) {
        PageResponse<Tag> tagsPage = tagService.getTags(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @GetMapping("/all")
    @AdminOnly
    public ResponseEntity<PageResponse<Tag>> getAllTags(Pageable pageable) {
        PageResponse<Tag> tagsPage = tagService.getAllIncludingDeleted(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @Valid @RequestBody TagRequest tagRequest) {
        Tag updatedTag = tagService.updateTag(id, tagRequest);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/{id}/restore")
    @AdminOnly
    public ResponseEntity<Tag> restoreTag(@PathVariable Long id) {
        Tag restoredTag = tagService.restoreTag(id);
        return ResponseEntity.ok(restoredTag);
    }
}
