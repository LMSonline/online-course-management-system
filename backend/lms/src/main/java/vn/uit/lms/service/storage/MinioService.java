package vn.uit.lms.service.storage;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;


    @Value("${minio.url}")
    private String minioUrl;

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
