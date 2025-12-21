package vn.uit.lms.shared.mapper.storage;

import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;

public class FileStorageMapper {

    public static FileStorageResponse toResponse(FileStorage fileStorage) {
        if (fileStorage == null) {
            return null;
        }

        return FileStorageResponse.builder()
                .id(fileStorage.getId())
                .storageKey(fileStorage.getStorageKey())
                .storageProvider(fileStorage.getStorageProvider())
                .originalName(fileStorage.getOriginalName())
                .mimeType(fileStorage.getMimeType())
                .sizeBytes(fileStorage.getSizeBytes())
                .formattedSize(fileStorage.getFormattedSize())
                .fileExtension(fileStorage.getFileExtension())
                .checksum(fileStorage.getChecksum())
                .isVideo(fileStorage.isVideo())
                .isImage(fileStorage.isImage())
                .isDocument(fileStorage.isDocument())
                .createdAt(fileStorage.getCreatedAt())
                .build();
    }

    public static FileStorageResponse toResponseWithDownloadUrl(FileStorage fileStorage, String downloadUrl) {
        FileStorageResponse response = toResponse(fileStorage);
        if (response != null) {
            response.setDownloadUrl(downloadUrl);
        }
        return response;
    }
}

