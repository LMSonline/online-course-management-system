package vn.uit.lms.config.init;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.uit.lms.config.MinioBucketProperties;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioBucketInitializer {

    private final MinioClient minioClient;
    private final MinioBucketProperties buckets;

    @PostConstruct
    public void initBuckets() {
        init(buckets.getVideos());
        init(buckets.getImages());
        init(buckets.getDocuments());
    }

    private void init(String bucketName) {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build()
            );

            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build()
                );
                log.info("Created bucket: {}", bucketName);
            } else {
                log.info("Bucket already exists: {}", bucketName);
            }

        } catch (Exception e) {
            log.error("Failed to initialize bucket: {}", bucketName, e);
        }
    }
}