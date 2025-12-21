package vn.uit.lms.shared.mapper.resource;

import vn.uit.lms.core.domain.course.content.LessonResource;
import vn.uit.lms.shared.dto.response.resource.LessonResourceResponse;

public class LessonResourceMapper {

    public static LessonResourceResponse toResponse(LessonResource resource) {
        if (resource == null) {
            return null;
        }

        return LessonResourceResponse.builder()
                .id(resource.getId())
                .lessonId(resource.getLesson() != null ? resource.getLesson().getId() : null)
                .resourceType(resource.getResourceType())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .externalUrl(resource.getExternalUrl())
                .fileStorageId(resource.getFileStorage() != null ? resource.getFileStorage().getId() : null)
                .fileName(resource.getFileName())
                .fileSizeBytes(resource.getFileSizeBytes())
                .formattedFileSize(resource.getFormattedFileSize())
                .displayUrl(resource.getDisplayUrl())
                .orderIndex(resource.getOrderIndex())
                .isRequired(resource.getIsRequired())
                .isDownloadable(resource.isDownloadable())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }

    public static LessonResourceResponse toResponseWithDownloadUrl(LessonResource resource, String downloadUrl) {
        LessonResourceResponse response = toResponse(resource);
        if (response != null && resource.isFileResource()) {
            response.setDownloadUrl(downloadUrl);
        }
        return response;
    }
}

