package vn.uit.lms.service.storage;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.url}")
    private String minioUrl;

    /**
     * Upload file directly to MinIO
     */
    public String uploadFile(MultipartFile file, String bucket, String objectKey) {
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            log.info("Uploaded file to MinIO: bucket={}, key={}", bucket, objectKey);
            return objectKey;
        } catch (Exception e) {
            log.error("Failed to upload file to MinIO: bucket={}, key={}", bucket, objectKey, e);
            throw new RuntimeException("Failed to upload file to MinIO", e);
        }
    }

    /**
     * Generate unique object key for file uploads
     */
    public String generateObjectKey(String folderPath, String originalFilename) {
        String uuid = UUID.randomUUID().toString();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        if (folderPath == null || folderPath.isBlank()) {
            return String.format("%s%s", uuid, extension);
        }

        // Remove leading/trailing slashes
        folderPath = folderPath.replaceAll("^/+|/+$", "");
        return String.format("%s/%s%s", folderPath, uuid, extension);
    }

    /**
     * Get file metadata from MinIO
     */
    public StatObjectResponse getObjectMetadata(String objectKey, String bucket) {
        try {
            return minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to get object metadata: bucket={}, key={}", bucket, objectKey, e);
            throw new RuntimeException("Failed to get file metadata", e);
        }
    }

    public String generatePresignedUploadUrl(Long lessonId, String bucket, String objectKey) {
        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucket)
                            .object(objectKey)
                            .expiry(15, TimeUnit.MINUTES)
                            .build()
            );

            log.info("Generated presigned URL for lesson {}: {}", lessonId, objectKey);
            return presignedUrl;
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for lesson {}", lessonId, e);
            throw new RuntimeException("Failed to generate upload URL", e);
        }
    }

    public String generatePresignedUrl(String bucket, String objectKey) {
        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectKey)
                            .expiry(1, TimeUnit.HOURS)
                            .build()
            );

            log.info("Generated presigned URL for object {}: {}", objectKey, presignedUrl);
            return presignedUrl;
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for object {}", objectKey, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    public String generateObjectKeyLessons(Long lessonId) {
        String uuid = UUID.randomUUID().toString();
        return String.format("lessons/%d/%s.mp4", lessonId, uuid);
    }

    public String buildPublicUrl(String objectKey, String bucket) {
        return String.format("%s/%s/%s", minioUrl, bucket, objectKey);
    }

    /**
     * Generate presigned GET URL for streaming video
     */
    public String generatePresignedGetUrl(String objectKey, String bucket, int expirySeconds) {
        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectKey)
                            .expiry(expirySeconds, TimeUnit.SECONDS)
                            .build()
            );

            log.info("Generated presigned GET URL for object {}", objectKey);
            return presignedUrl;
        } catch (Exception e) {
            log.error("Failed to generate presigned GET URL for object {}", objectKey, e);
            throw new RuntimeException("Failed to generate streaming URL", e);
        }
    }

    /**
     * Generate HLS playlist with presigned URLs for all segments
     *
     * This method:
     * 1. Downloads the original playlist from MinIO
     * 2. Parses segment references
     * 3. Generates presigned URLs for each segment
     * 4. Returns modified playlist with presigned URLs
     */
    public String generateHLSPlaylistWithPresignedUrls(String playlistKey, String bucket, int expirySeconds) {
        try {
            // Download playlist
            String playlistContent;
            try (InputStream inputStream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(playlistKey)
                            .build())) {
                playlistContent = new String(inputStream.readAllBytes());
            }

            // Parse and replace segment paths with presigned URLs
            String[] lines = playlistContent.split("\n");
            StringBuilder modifiedPlaylist = new StringBuilder();

            String baseDir = playlistKey.substring(0, playlistKey.lastIndexOf("/") + 1);

            for (String line : lines) {
                if (line.trim().isEmpty()) {
                    modifiedPlaylist.append("\n");
                    continue;
                }

                // If line is a segment file (ends with .ts)
                if (line.endsWith(".ts")) {
                    String segmentKey = baseDir + line.trim();
                    String presignedUrl = generatePresignedGetUrl(segmentKey, bucket, expirySeconds);
                    modifiedPlaylist.append(presignedUrl).append("\n");
                } else {
                    modifiedPlaylist.append(line).append("\n");
                }
            }

            log.info("Generated HLS playlist with presigned URLs for: {}", playlistKey);
            return modifiedPlaylist.toString();

        } catch (Exception e) {
            log.error("Failed to generate HLS playlist with presigned URLs for: {}", playlistKey, e);
            throw new RuntimeException("Failed to generate HLS streaming playlist", e);
        }
    }

    /**
     * Delete object from MinIO
     */
    public void deleteObject(String objectKey, String bucket) {
        try {
            minioClient.removeObject(
                    io.minio.RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .build()
            );
            log.info("Deleted object {} from bucket {}", objectKey, bucket);
        } catch (Exception e) {
            log.error("Failed to delete object {} from bucket {}", objectKey, bucket, e);
            throw new RuntimeException("Failed to delete object from storage", e);
        }
    }

    /**
     * Delete HLS folder (playlist + all segments)
     *
     * For HLS videos, we need to delete:
     * - index.m3u8 (playlist)
     * - segment_000.ts, segment_001.ts, ... (all segments)
     *
     * Given playlistKey: "hls/lessons/1/index.m3u8"
     * Delete: "hls/lessons/1/" (entire folder)
     */
    public void deleteHLSFolder(String playlistKey, String bucket) {
        try {
            // Extract folder prefix: hls/lessons/1/
            String folderPrefix = playlistKey.substring(0, playlistKey.lastIndexOf("/") + 1);

            log.info("Deleting HLS folder: {} in bucket: {}", folderPrefix, bucket);

            // List all objects in folder
            Iterable<io.minio.Result<io.minio.messages.Item>> results = minioClient.listObjects(
                    io.minio.ListObjectsArgs.builder()
                            .bucket(bucket)
                            .prefix(folderPrefix)
                            .recursive(true)
                            .build()
            );

            // Delete each object
            int deletedCount = 0;
            for (io.minio.Result<io.minio.messages.Item> result : results) {
                io.minio.messages.Item item = result.get();
                minioClient.removeObject(
                        io.minio.RemoveObjectArgs.builder()
                                .bucket(bucket)
                                .object(item.objectName())
                                .build()
                );
                deletedCount++;
                log.debug("Deleted HLS file: {}", item.objectName());
            }

            log.info("Deleted {} HLS files from folder: {}", deletedCount, folderPrefix);

        } catch (Exception e) {
            log.error("Failed to delete HLS folder for playlist: {}", playlistKey, e);
            throw new RuntimeException("Failed to delete HLS folder", e);
        }
    }

    /**
     * Delete video and all related HLS files
     *
     * Deletes:
     * 1. Original raw video (if exists): lessons/1/uuid.mp4
     * 2. HLS folder (if exists): hls/lessons/1/ (playlist + segments)
     */
    public void deleteVideoCompletely(String objectKey, String bucket, Long lessonId) {
        try {
            // Delete original video if exists
            if (objectKey != null && !objectKey.startsWith("hls/")) {
                try {
                    deleteObject(objectKey, bucket);
                    log.info("Deleted original video: {}", objectKey);
                } catch (Exception e) {
                    log.warn("Failed to delete original video: {}, may not exist", objectKey);
                }
            }

            // Delete HLS folder if exists
            String hlsPlaylistKey = String.format("hls/lessons/%d/index.m3u8", lessonId);
            try {
                deleteHLSFolder(hlsPlaylistKey, bucket);
                log.info("Deleted HLS folder for lesson: {}", lessonId);
            } catch (Exception e) {
                log.warn("Failed to delete HLS folder for lesson: {}, may not exist", lessonId);
            }

        } catch (Exception e) {
            log.error("Error during complete video deletion for lesson: {}", lessonId, e);
            // Don't throw - continue even if some deletions fail
        }
    }

    public boolean isExistsObject(String objectKey, String bucket) {
        try {
            return minioClient.statObject(
                    io.minio.StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .build()
            ) != null;
        } catch (Exception e) {
            log.error("Error checking existence of object: {}", objectKey, e);
            return false;
        }
    }
}
