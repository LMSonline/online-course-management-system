package vn.uit.lms.service.course.content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.config.MinioBucketProperties;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.core.repository.course.content.FileStorageRepository;
import vn.uit.lms.service.storage.MinioService;
import vn.uit.lms.shared.constant.StorageProvider;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.storage.FileStorageMapper;

import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Service for managing file storage operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final FileStorageRepository fileStorageRepository;
    private final MinioService minioService;
    private final MinioBucketProperties minioBucketProperties;

    @Value("${app.file.max-size-bytes:104857600}") // 100MB default
    private long maxFileSize;

    private static final Set<String> ALLOWED_DOCUMENT_TYPES = new HashSet<>(Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain"
    ));

    private static final Set<String> ALLOWED_IMAGE_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    ));

    /**
     * Determine storage provider based on file type
     */
    public StorageProvider determineStorageProvider(MultipartFile file) {
        String contentType = file.getContentType();

        // Images → Could use Cloudinary (for now using MinIO)
        if (contentType != null && contentType.startsWith("image/")) {
            return StorageProvider.MINIO; // Can switch to CLOUDINARY later
        }

        // Everything else → MinIO
        return StorageProvider.MINIO;
    }

    /**
     * Validate file type
     */
    public void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null) {
            throw new InvalidRequestException("File content type cannot be determined");
        }

        // Check if it's an allowed type
        if (!ALLOWED_DOCUMENT_TYPES.contains(contentType) &&
            !ALLOWED_IMAGE_TYPES.contains(contentType) &&
            !contentType.startsWith("video/")) {
            throw new InvalidRequestException("File type not allowed: " + contentType);
        }
    }

    /**
     * Validate file size
     */
    public void validateFileSize(MultipartFile file) {
        if (file.getSize() > maxFileSize) {
            throw new InvalidRequestException(
                String.format("File size exceeds maximum limit of %d MB", maxFileSize / (1024 * 1024))
            );
        }
    }

    /**
     * Calculate file checksum (MD5)
     */
    private String calculateChecksum(MultipartFile file) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(file.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            log.warn("Failed to calculate file checksum", e);
            return null;
        }
    }

    /**
     * Upload file to storage
     */
    @Transactional
    public FileStorageResponse uploadFile(MultipartFile file, String folderPath, StorageProvider provider) {
        // Validations
        validateFileType(file);
        validateFileSize(file);

        // Determine provider if not specified
        if (provider == null) {
            provider = determineStorageProvider(file);
        }

        // Generate unique object key
        String objectKey = minioService.generateObjectKey(folderPath, file.getOriginalFilename());

        // Determine bucket based on file type
        String bucket = getBucketForFileType(file.getContentType());

        // Upload to MinIO
        minioService.uploadFile(file, bucket, objectKey);

        // Calculate checksum
        String checksum = calculateChecksum(file);

        // Create FileStorage entity
        FileStorage fileStorage = FileStorage.builder()
                .storageKey(objectKey)
                .storageProvider(provider)
                .originalName(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .sizeBytes(file.getSize())
                .checksum(checksum)
                .build();

        fileStorage.validateFileStorage();
        fileStorage = fileStorageRepository.save(fileStorage);

        log.info("File uploaded successfully: id={}, key={}", fileStorage.getId(), objectKey);

        return FileStorageMapper.toResponse(fileStorage);
    }

    /**
     * Get bucket name based on file type
     */
    private String getBucketForFileType(String mimeType) {
        if (mimeType == null) {
            return minioBucketProperties.getDocuments();
        }

        if (mimeType.startsWith("video/")) {
            return minioBucketProperties.getVideos();
        } else if (mimeType.startsWith("image/")) {
            return minioBucketProperties.getImages();
        } else {
            return minioBucketProperties.getDocuments();
        }
    }

    /**
     * Get file storage by ID
     */
    public FileStorageResponse getFileStorage(Long id) {
        FileStorage fileStorage = fileStorageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with id: " + id));

        return FileStorageMapper.toResponse(fileStorage);
    }

    /**
     * Get file storage by storage key
     */
    public FileStorage getFileStorageByKey(String storageKey) {
        return fileStorageRepository.findByStorageKey(storageKey)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with key: " + storageKey));
    }

    /**
     * Generate download URL
     */
    public String generateDownloadUrl(Long id, int expirySeconds) {
        FileStorage fileStorage = fileStorageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with id: " + id));

        String bucket = getBucketForFileType(fileStorage.getMimeType());

        return minioService.generatePresignedGetUrl(
                fileStorage.getStorageKey(),
                bucket,
                expirySeconds
        );
    }

    /**
     * Get file storage with download URL
     */
    public FileStorageResponse getFileStorageWithDownloadUrl(Long id, int expirySeconds) {
        FileStorage fileStorage = fileStorageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with id: " + id));

        String downloadUrl = generateDownloadUrl(id, expirySeconds);

        return FileStorageMapper.toResponseWithDownloadUrl(fileStorage, downloadUrl);
    }

    /**
     * Delete file from storage
     */
    @Transactional
    public void deleteFile(Long id) {
        FileStorage fileStorage = fileStorageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with id: " + id));

        String bucket = getBucketForFileType(fileStorage.getMimeType());

        // Delete from MinIO
        try {
            minioService.deleteObject(fileStorage.getStorageKey(), bucket);
            log.info("Deleted file from MinIO: key={}", fileStorage.getStorageKey());
        } catch (Exception e) {
            log.warn("Failed to delete file from MinIO: key={}", fileStorage.getStorageKey(), e);
        }

        // Delete from database
        fileStorageRepository.delete(fileStorage);
        log.info("Deleted file storage record: id={}", id);
    }

    /**
     * Check if file exists
     */
    public boolean fileExists(Long id) {
        return fileStorageRepository.existsById(id);
    }

    /**
     * Get file storage entity by ID
     */
    public FileStorage getFileStorageEntity(Long id) {
        return fileStorageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File storage not found with id: " + id));
    }
}
