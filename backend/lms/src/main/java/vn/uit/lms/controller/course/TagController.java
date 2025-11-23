package vn.uit.lms.controller.course;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.course.Tag;
import vn.uit.lms.service.course.TagService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.TagRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

@RestController
@RequestMapping("/api/v1")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/admin/tags")
    @AdminOnly
    public ResponseEntity<Tag> createTag(@Valid @RequestBody TagRequest tagRequest) {
        Tag createdTag = tagService.createTag(tagRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTag);
    }

    @GetMapping("/tags")
    public ResponseEntity<PageResponse<Tag>> getTags(Pageable pageable) {
        PageResponse<Tag> tagsPage = tagService.getTagsActive(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @GetMapping("/admin/tags")
    @AdminOnly
    public ResponseEntity<PageResponse<Tag>> getAllTags(Pageable pageable) {
        PageResponse<Tag> tagsPage = tagService.getAllIncludingDeleted(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @PutMapping("/admin/tags/{id}")
    @AdminOnly
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @Valid @RequestBody TagRequest tagRequest) {
        Tag updatedTag = tagService.updateTag(id, tagRequest);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/admin/tags/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/tags/{id}/restore")
    @AdminOnly
    public ResponseEntity<Tag> restoreTag(@PathVariable Long id) {
        Tag restoredTag = tagService.restoreTag(id);
        return ResponseEntity.ok(restoredTag);
    }
}
