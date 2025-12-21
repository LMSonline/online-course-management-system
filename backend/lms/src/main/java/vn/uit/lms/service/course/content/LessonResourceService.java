package vn.uit.lms.service.course.content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.course.content.LessonResource;
import vn.uit.lms.core.repository.course.content.LessonResourceRepository;
import vn.uit.lms.shared.constant.ResourceType;
import vn.uit.lms.shared.dto.request.resource.LessonResourceRequest;
import vn.uit.lms.shared.dto.request.resource.ReorderResourcesRequest;
import vn.uit.lms.shared.dto.response.resource.LessonResourceResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.resource.LessonResourceMapper;

import java.util.List;

/**
 * Service for managing lesson resources
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LessonResourceService {

    private final LessonResourceRepository lessonResourceRepository;
    private final LessonService lessonService;
    private final FileStorageService fileStorageService;

    /**
     * Add resource to lesson (FILE type - with file upload)
     */
    @Transactional
    public LessonResourceResponse addFileResourceToLesson(
            Long lessonId,
            MultipartFile file,
            String title,
            String description,
            Boolean isRequired
    ) {
        // Validate lesson is editable
        Lesson lesson = lessonService.validateLessonEditable(lessonId);

        // Upload file to storage
        String folderPath = String.format("lessons/%d/resources", lessonId);
        var fileStorageResponse = fileStorageService.uploadFile(file, folderPath, null);

        // Get FileStorage entity
        FileStorage fileStorage = fileStorageService.getFileStorageEntity(fileStorageResponse.getId());

        // Create LessonResource
        LessonResource resource = LessonResource.builder()
                .lesson(lesson)
                .resourceType(ResourceType.FILE)
                .title(title != null ? title : file.getOriginalFilename())
                .description(description)
                .fileStorage(fileStorage)
                .orderIndex(lesson.getResources().size())
                .isRequired(isRequired != null ? isRequired : false)
                .build();

        resource.validateResource();

        // Use aggregate pattern
        lesson.addResource(resource);
        resource = lessonResourceRepository.save(resource);

        log.info("Added FILE resource to lesson: lessonId={}, resourceId={}", lessonId, resource.getId());

        return LessonResourceMapper.toResponse(resource);
    }

    /**
     * Add resource to lesson (LINK/EMBED type - without file)
     */
    @Transactional
    public LessonResourceResponse addLinkResourceToLesson(Long lessonId, LessonResourceRequest request) {
        // Validate lesson is editable
        Lesson lesson = lessonService.validateLessonEditable(lessonId);

        // Validate request for LINK/EMBED type
        if (request.getResourceType() == ResourceType.FILE) {
            throw new InvalidRequestException("Use addFileResourceToLesson for FILE type resources");
        }

        if (request.getExternalUrl() == null || request.getExternalUrl().isBlank()) {
            throw new InvalidRequestException("External URL is required for LINK/EMBED resources");
        }

        // Create LessonResource
        LessonResource resource = LessonResource.builder()
                .lesson(lesson)
                .resourceType(request.getResourceType())
                .title(request.getTitle())
                .description(request.getDescription())
                .externalUrl(request.getExternalUrl())
                .orderIndex(lesson.getResources().size())
                .isRequired(request.getIsRequired() != null ? request.getIsRequired() : false)
                .build();

        resource.validateResource();

        // Use aggregate pattern
        lesson.addResource(resource);
        resource = lessonResourceRepository.save(resource);

        log.info("Added {} resource to lesson: lessonId={}, resourceId={}",
                request.getResourceType(), lessonId, resource.getId());

        return LessonResourceMapper.toResponse(resource);
    }

    /**
     * Get all resources for a lesson
     */
    public List<LessonResourceResponse> getLessonResources(Long lessonId) {
        Lesson lesson = lessonService.validateLessonEditable(lessonId);

        List<LessonResource> resources = lessonResourceRepository.findByLessonOrderByOrderIndexAsc(lesson);

        return resources.stream()
                .map(this::toResponseWithDownloadUrl)
                .toList();
    }

    /**
     * Get resource by ID
     */
    public LessonResourceResponse getResourceById(Long lessonId, Long resourceId) {
        LessonResource resource = lessonResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));

        // Verify resource belongs to lesson
        if (!resource.getLesson().getId().equals(lessonId)) {
            throw new InvalidRequestException("Resource does not belong to this lesson");
        }

        return toResponseWithDownloadUrl(resource);
    }

    /**
     * Update resource
     */
    @Transactional
    public LessonResourceResponse updateResource(Long lessonId, Long resourceId, LessonResourceRequest request) {
        LessonResource resource = lessonResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));

        // Verify resource belongs to lesson
        if (!resource.getLesson().getId().equals(lessonId)) {
            throw new InvalidRequestException("Resource does not belong to this lesson");
        }

        // Validate lesson is editable
        lessonService.validateLessonEditable(lessonId);

        // Update basic info
        resource.updateBasicInfo(request.getTitle(), request.getDescription(), request.getIsRequired());

        // Update external URL if applicable
        if (resource.isLinkResource() || resource.isEmbedResource()) {
            if (request.getExternalUrl() != null) {
                resource.updateExternalUrl(request.getExternalUrl());
            }
        }

        resource.validateResource();
        resource = lessonResourceRepository.save(resource);

        log.info("Updated resource: lessonId={}, resourceId={}", lessonId, resourceId);

        return toResponseWithDownloadUrl(resource);
    }

    /**
     * Replace file for FILE resource
     */
    @Transactional
    public LessonResourceResponse replaceResourceFile(Long lessonId, Long resourceId, MultipartFile newFile) {
        LessonResource resource = lessonResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));

        // Verify resource belongs to lesson
        if (!resource.getLesson().getId().equals(lessonId)) {
            throw new InvalidRequestException("Resource does not belong to this lesson");
        }

        // Validate lesson is editable
        lessonService.validateLessonEditable(lessonId);

        // Must be FILE type
        if (!resource.isFileResource()) {
            throw new InvalidRequestException("Can only replace file for FILE type resources");
        }

        // Delete old file
        Long oldFileStorageId = resource.getFileStorage().getId();
        try {
            fileStorageService.deleteFile(oldFileStorageId);
            log.info("Deleted old file: fileStorageId={}", oldFileStorageId);
        } catch (Exception e) {
            log.warn("Failed to delete old file: fileStorageId={}", oldFileStorageId, e);
        }

        // Upload new file
        String folderPath = String.format("lessons/%d/resources", lessonId);
        var fileStorageResponse = fileStorageService.uploadFile(newFile, folderPath, null);
        FileStorage newFileStorage = fileStorageService.getFileStorageEntity(fileStorageResponse.getId());

        // Replace file storage
        resource.replaceFileStorage(newFileStorage);
        resource = lessonResourceRepository.save(resource);

        log.info("Replaced file for resource: lessonId={}, resourceId={}", lessonId, resourceId);

        return toResponseWithDownloadUrl(resource);
    }

    /**
     * Delete resource
     */
    @Transactional
    public void deleteResource(Long lessonId, Long resourceId) {
        LessonResource resource = lessonResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));

        // Verify resource belongs to lesson
        if (!resource.getLesson().getId().equals(lessonId)) {
            throw new InvalidRequestException("Resource does not belong to this lesson");
        }

        // Validate lesson is editable
        Lesson lesson = lessonService.validateLessonEditable(lessonId);

        Integer deletedOrderIndex = resource.getOrderIndex();

        // Delete file if FILE type
        if (resource.isFileResource() && resource.getFileStorage() != null) {
            try {
                fileStorageService.deleteFile(resource.getFileStorage().getId());
                log.info("Deleted file for resource: resourceId={}", resourceId);
            } catch (Exception e) {
                log.warn("Failed to delete file for resource: resourceId={}", resourceId, e);
            }
        }

        // Remove using aggregate pattern
        lesson.removeResource(resource);
        lessonResourceRepository.delete(resource);

        // Reorder remaining resources
        List<LessonResource> remainingResources = lessonResourceRepository.findByLessonOrderByOrderIndexAsc(lesson);
        for (int i = 0; i < remainingResources.size(); i++) {
            LessonResource r = remainingResources.get(i);
            if (r.getOrderIndex() > deletedOrderIndex) {
                r.updateOrderIndex(i);
            }
        }
        lessonResourceRepository.saveAll(remainingResources);

        log.info("Deleted resource: lessonId={}, resourceId={}", lessonId, resourceId);
    }

    /**
     * Reorder resources
     */
    @Transactional
    public void reorderResources(Long lessonId, ReorderResourcesRequest request) {
        // Validate lesson is editable
        Lesson lesson = lessonService.validateLessonEditable(lessonId);

        List<Long> resourceIds = request.getResourceIds();

        // Validate all resources belong to this lesson
        List<LessonResource> resources = lessonResourceRepository.findAllById(resourceIds);

        if (resources.size() != resourceIds.size()) {
            throw new InvalidRequestException("Some resources not found");
        }

        for (LessonResource resource : resources) {
            if (!resource.getLesson().getId().equals(lessonId)) {
                throw new InvalidRequestException("Resource " + resource.getId() + " does not belong to lesson " + lessonId);
            }
        }

        // Update order index
        for (int i = 0; i < resourceIds.size(); i++) {
            Long resourceId = resourceIds.get(i);
            LessonResource resource = resources.stream()
                    .filter(r -> r.getId().equals(resourceId))
                    .findFirst()
                    .orElseThrow();
            resource.updateOrderIndex(i);
        }

        lessonResourceRepository.saveAll(resources);
        log.info("Reordered {} resources in lesson: {}", resourceIds.size(), lessonId);
    }

    /**
     * Helper method to convert resource to response with download URL
     */
    private LessonResourceResponse toResponseWithDownloadUrl(LessonResource resource) {
        if (resource.isFileResource() && resource.getFileStorage() != null) {
            String downloadUrl = fileStorageService.generateDownloadUrl(
                    resource.getFileStorage().getId(),
                    3600 // 1 hour expiry
            );
            return LessonResourceMapper.toResponseWithDownloadUrl(resource, downloadUrl);
        }
        return LessonResourceMapper.toResponse(resource);
    }
}
