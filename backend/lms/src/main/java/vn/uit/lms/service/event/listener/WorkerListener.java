package vn.uit.lms.service.event.listener;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import vn.uit.lms.config.RabbitMQConfig;
import vn.uit.lms.service.event.VideoConvertMessage;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkerListener {

    private final MinioClient minioClient;
    private static final int CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    private static final String CHUNK_PREFIX = "chunks/";

    @RabbitListener(queues = RabbitMQConfig.VIDEO_CONVERT_QUEUE)
    public void handleVideoConvert(VideoConvertMessage message) {
        String objectKey = message.getObjectKey();
        String bucket = message.getBucket();

        log.info("Starting video conversion for: {}/{}", bucket, objectKey);

        try {
            // Stream directly from MinIO and chunk
            List<String> chunkKeys = streamAndChunk(bucket, objectKey);
            log.info("Video conversion completed. Created {} chunks for: {}", chunkKeys.size(), objectKey);
        } catch (Exception e) {
            log.error("Error processing video {}/{}: {}", bucket, objectKey, e.getMessage(), e);
        }
    }


    private List<String> streamAndChunk(String bucket, String objectKey) throws Exception {
        List<String> chunkKeys = new ArrayList<>();
        String baseKey = objectKey.substring(0, objectKey.lastIndexOf('.'));

        try (InputStream inputStream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectKey)
                        .build())) {

            byte[] buffer = new byte[CHUNK_SIZE];
            int chunkIndex = 0;
            int bytesRead;

            while ((bytesRead = readFully(inputStream, buffer)) > 0) {
                String chunkKey = String.format("%s%s_chunk_%03d.mp4", CHUNK_PREFIX, baseKey, chunkIndex);

                // Upload chunk trực tiếp từ buffer
                try (ByteArrayInputStream chunkStream = new ByteArrayInputStream(buffer, 0, bytesRead)) {
                    minioClient.putObject(
                            PutObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(chunkKey)
                                    .stream(chunkStream, bytesRead, -1)
                                    .contentType("video/mp4")
                                    .build()
                    );

                    chunkKeys.add(chunkKey);
                    log.debug("Uploaded chunk {}: {} bytes", chunkIndex, bytesRead);
                }

                chunkIndex++;
            }
        }

        return chunkKeys;
    }


    private int readFully(InputStream input, byte[] buffer) throws IOException {
        int totalRead = 0;
        int bytesRead;

        while (totalRead < buffer.length && (bytesRead = input.read(buffer, totalRead, buffer.length - totalRead)) != -1) {
            totalRead += bytesRead;
        }

        return totalRead;
    }
}
