package vn.uit.lms.controller.course.content;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.service.course.content.LessonResourceService;
import vn.uit.lms.shared.dto.request.resource.LessonResourceRequest;
import vn.uit.lms.shared.dto.request.resource.ReorderResourcesRequest;
import vn.uit.lms.shared.dto.response.resource.LessonResourceResponse;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.util.annotation.Authenticated;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lessons/{lessonId}/resources")
@RequiredArgsConstructor
@Tag(name = "Lesson Resource Management", description = "APIs for managing lesson resources (files, links, embeds)")
@SecurityRequirement(name = "bearerAuth")
public class LessonResourceController {

    private final LessonResourceService lessonResourceService;

    @Operation(
        summary = "Add file resource to lesson",
        description = "Upload and attach a file resource to a lesson. Only accessible by teachers."
    )
    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("File resource added successfully")
    public ResponseEntity<LessonResourceResponse> addFileResource(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "File to upload", required = true)
            @RequestParam("file") MultipartFile file,

            @Parameter(description = "Resource title")
            @RequestParam(required = false) String title,

            @Parameter(description = "Resource description")
            @RequestParam(required = false) String description,

            @Parameter(description = "Whether this resource is required")
            @RequestParam(required = false) Boolean isRequired
    ) {
        LessonResourceResponse response = lessonResourceService.addFileResourceToLesson(
                lessonId, file, title, description, isRequired
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Add link/embed resource to lesson",
        description = "Add an external link or embeddable content to a lesson. Only accessible by teachers."
    )
    @PostMapping
    @ApiMessage("Link/Embed resource added successfully")
    public ResponseEntity<LessonResourceResponse> addLinkResource(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Resource details", required = true)
            @Valid @RequestBody LessonResourceRequest request
    ) {
        LessonResourceResponse response = lessonResourceService.addLinkResourceToLesson(lessonId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Get all resources for a lesson",
        description = "Retrieve all resources attached to a lesson (ordered by orderIndex)"
    )
    @GetMapping
    @ApiMessage("Resources retrieved successfully")
    public ResponseEntity<List<LessonResourceResponse>> getLessonResources(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId
    ) {
        List<LessonResourceResponse> resources = lessonResourceService.getLessonResources(lessonId);
        return ResponseEntity.ok(resources);
    }

    @Operation(
        summary = "Get resource details",
        description = "Retrieve detailed information about a specific resource"
    )
    @GetMapping("/{resourceId}")
    @ApiMessage("Resource details retrieved successfully")
    public ResponseEntity<LessonResourceResponse> getResourceById(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Resource ID", required = true)
            @PathVariable Long resourceId
    ) {
        LessonResourceResponse response = lessonResourceService.getResourceById(lessonId, resourceId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Update resource",
        description = "Update resource information (title, description, URL, etc.). Only accessible by teachers."
    )
    @PutMapping("/{resourceId}")
    @ApiMessage("Resource updated successfully")
    public ResponseEntity<LessonResourceResponse> updateResource(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Resource ID", required = true)
            @PathVariable Long resourceId,

            @Parameter(description = "Updated resource details", required = true)
            @Valid @RequestBody LessonResourceRequest request
    ) {
        LessonResourceResponse response = lessonResourceService.updateResource(lessonId, resourceId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Replace resource file",
        description = "Replace the file for a FILE type resource. Only accessible by teachers."
    )
    @PutMapping(value = "/{resourceId}/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Resource file replaced successfully")
    public ResponseEntity<LessonResourceResponse> replaceResourceFile(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Resource ID", required = true)
            @PathVariable Long resourceId,

            @Parameter(description = "New file to upload", required = true)
            @RequestParam("file") MultipartFile file
    ) {
        LessonResourceResponse response = lessonResourceService.replaceResourceFile(lessonId, resourceId, file);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Delete resource",
        description = "Delete a resource from the lesson. Only accessible by teachers."
    )
    @DeleteMapping("/{resourceId}")
    @ApiMessage("Resource deleted successfully")
    public ResponseEntity<Void> deleteResource(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Resource ID", required = true)
            @PathVariable Long resourceId
    ) {
        lessonResourceService.deleteResource(lessonId, resourceId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Reorder resources",
        description = "Reorder resources within a lesson. Provide ordered list of resource IDs. Only accessible by teachers."
    )
    @PostMapping("/reorder")
    @ApiMessage("Resources reordered successfully")
    public ResponseEntity<Void> reorderResources(
            @Parameter(description = "Lesson ID", required = true)
            @PathVariable Long lessonId,

            @Parameter(description = "Ordered list of resource IDs", required = true)
            @Valid @RequestBody ReorderResourcesRequest request
    ) {
        lessonResourceService.reorderResources(lessonId, request);
        return ResponseEntity.ok().build();
    }
}

