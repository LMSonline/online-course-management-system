package vn.uit.lms.controller.course;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.TagService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.TagRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Tag Management", description = "APIs for managing course tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "Create a new tag")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/admin/tags")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.core.domain.course.Tag> createTag(
            @Parameter(description = "Tag details") @Valid @RequestBody TagRequest tagRequest) {
        vn.uit.lms.core.domain.course.Tag createdTag = tagService.createTag(tagRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTag);
    }

    @Operation(summary = "Get all active tags")
    @GetMapping("/tags")
    public ResponseEntity<PageResponse<vn.uit.lms.core.domain.course.Tag>> getTags(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        PageResponse<vn.uit.lms.core.domain.course.Tag> tagsPage = tagService.getTagsActive(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @Operation(summary = "Get all tags including deleted")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/admin/tags")
    @AdminOnly
    public ResponseEntity<PageResponse<vn.uit.lms.core.domain.course.Tag>> getAllTags(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        PageResponse<vn.uit.lms.core.domain.course.Tag> tagsPage = tagService.getAllIncludingDeleted(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @Operation(summary = "Update a tag")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/admin/tags/{id}")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.core.domain.course.Tag> updateTag(
            @Parameter(description = "Tag ID") @PathVariable Long id,
            @Parameter(description = "Updated tag details") @Valid @RequestBody TagRequest tagRequest) {
        vn.uit.lms.core.domain.course.Tag updatedTag = tagService.updateTag(id, tagRequest);
        return ResponseEntity.ok(updatedTag);
    }

    @Operation(summary = "Delete a tag")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/admin/tags/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteTag(
            @Parameter(description = "Tag ID") @PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restore a deleted tag")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/admin/tags/{id}/restore")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.core.domain.course.Tag> restoreTag(
            @Parameter(description = "Tag ID") @PathVariable Long id) {
        vn.uit.lms.core.domain.course.Tag restoredTag = tagService.restoreTag(id);
        return ResponseEntity.ok(restoredTag);
    }

    // ========== PUBLIC APIs - No Authentication Required ==========

    @Operation(
            summary = "Get all active tags (Public)",
            description = "Get all active tags with pagination. No authentication required."
    )
    @GetMapping("/public/tags")
    public ResponseEntity<PageResponse<vn.uit.lms.core.domain.course.Tag>> getPublicTags(
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<vn.uit.lms.core.domain.course.Tag> tagsPage = tagService.getTagsActive(pageable);
        return ResponseEntity.ok(tagsPage);
    }

    @Operation(
            summary = "Get all tags (Public, no pagination)",
            description = "Get all active tags without pagination. Useful for tag selection. No authentication required."
    )
    @GetMapping("/public/tags/all")
    public ResponseEntity<java.util.List<vn.uit.lms.core.domain.course.Tag>> getAllPublicTags() {
        java.util.List<vn.uit.lms.core.domain.course.Tag> allTags = tagService.getAllActiveTags();
        return ResponseEntity.ok(allTags);
    }

    @Operation(
            summary = "Search tags by name (Public)",
            description = "Search tags by name prefix. No authentication required."
    )
    @GetMapping("/public/tags/search")
    public ResponseEntity<java.util.List<vn.uit.lms.core.domain.course.Tag>> searchPublicTags(
            @Parameter(description = "Search query") @RequestParam String query
    ) {
        java.util.List<vn.uit.lms.core.domain.course.Tag> searchResults = tagService.searchTagsByName(query);
        return ResponseEntity.ok(searchResults);
    }
}
