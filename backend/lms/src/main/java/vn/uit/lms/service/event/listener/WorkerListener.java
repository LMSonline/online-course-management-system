package vn.uit.lms.service.event.listener;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.UploadObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import vn.uit.lms.config.RabbitMQConfig;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.event.VideoConvertMessage;
import vn.uit.lms.shared.constant.VideoStatus;

import java.io.*;
import java.nio.file.*;
import java.util.Optional;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkerListener {

    private final MinioClient minioClient;
    private final LessonRepository lessonRepository;

    // Configuration
    private static final int SEGMENT_DURATION = 10; // 10 seconds per segment
    private static final String HLS_PREFIX = "hls/";

    @RabbitListener(queues = RabbitMQConfig.VIDEO_CONVERT_QUEUE)
    public void handleVideoConvert(VideoConvertMessage message) {
        String objectKey = message.getObjectKey();
        String bucket = message.getBucket();
        Long lessonId = message.getLessonId();

        log.info("Starting FFmpeg conversion for lesson {}: {}/{}", lessonId, bucket, objectKey);

        Path workDir = null;
        try {
            // Update status to PROCESSING
            updateLessonStatus(lessonId, VideoStatus.PROCESSING);

            // STEP 1: Create temp directory
            workDir = Files.createTempDirectory("video-" + lessonId);
            log.info("Created temp directory: {}", workDir);

            // STEP 2: Download video from MinIO
            Path inputVideo = downloadVideo(bucket, objectKey, workDir);
            log.info("Downloaded video: {}", inputVideo);

            // STEP 3: Convert with FFmpeg
            Path outputDir = workDir.resolve("hls");
            Files.createDirectories(outputDir);
            convertToHLS(inputVideo, outputDir);
            log.info("FFmpeg conversion completed");

            // STEP 4: Upload HLS files to MinIO
            String playlistKey = uploadHLSFiles(bucket, outputDir, lessonId);
            log.info("Uploaded HLS files to MinIO");

            // STEP 5: Update lesson
            updateLessonWithHLS(lessonId, playlistKey);

            log.info("Video conversion completed successfully for lesson {}", lessonId);

        } catch (Exception e) {
            log.error("Error processing video for lesson {}: {}", lessonId, e.getMessage(), e);
            updateLessonStatus(lessonId, VideoStatus.FAILED);
        } finally {
            // STEP 6: Cleanup temp files
            if (workDir != null) {
                cleanup(workDir);
            }
        }
    }

    /**
     * Download video from MinIO to local temp directory
     */
    private Path downloadVideo(String bucket, String objectKey, Path workDir) throws Exception {
        Path inputVideo = workDir.resolve("raw.mp4");

        try (InputStream inputStream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectKey)
                        .build());
             FileOutputStream outputStream = new FileOutputStream(inputVideo.toFile())) {

            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        return inputVideo;
    }

    /**
     * Convert video to HLS using FFmpeg
     *
     * Command:
     * ffmpeg -i input.mp4 \
     *   -c:v libx264 -c:a aac \
     *   -hls_time 10 \
     *   -hls_list_size 0 \
     *   -hls_segment_filename "segment_%03d.ts" \
     *   -hls_base_url "" \  (IMPORTANT: Keep relative paths)
     *   -f hls \
     *   index.m3u8
     */
    private void convertToHLS(Path inputVideo, Path outputDir) throws Exception {
        String playlistPath = outputDir.resolve("index.m3u8").toString();
        String segmentPattern = outputDir.resolve("segment_%03d.ts").toString();

        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg",
                "-i", inputVideo.toString(),
                "-c:v", "libx264",           // H.264 video codec
                "-c:a", "aac",               // AAC audio codec
                "-hls_time", String.valueOf(SEGMENT_DURATION),  // 10s segments
                "-hls_list_size", "0",       // Include all segments in playlist
                "-hls_segment_filename", segmentPattern,
                "-hls_base_url", "",         // Keep relative paths (no prefix)
                "-f", "hls",                 // HLS format
                playlistPath
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Log FFmpeg output
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.debug("FFmpeg: {}", line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("FFmpeg conversion failed with exit code: " + exitCode);
        }
    }

    /**
     * Upload all HLS files (playlist + segments) to MinIO
     */
    private String uploadHLSFiles(String bucket, Path hlsDir, Long lessonId) throws Exception {
        String hlsPrefix = HLS_PREFIX + "lessons/" + lessonId + "/";

        try (Stream<Path> files = Files.walk(hlsDir)) {
            files.filter(Files::isRegularFile)
                    .forEach(file -> {
                        try {
                            String fileName = file.getFileName().toString();
                            String objectKey = hlsPrefix + fileName;

                            minioClient.uploadObject(
                                    UploadObjectArgs.builder()
                                            .bucket(bucket)
                                            .object(objectKey)
                                            .filename(file.toString())
                                            .contentType(getContentType(fileName))
                                            .build()
                            );

                            log.debug("Uploaded: {}", objectKey);
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to upload file: " + file, e);
                        }
                    });
        }

        // Return playlist key
        return hlsPrefix + "index.m3u8";
    }

    /**
     * Get content type for HLS files
     */
    private String getContentType(String fileName) {
        if (fileName.endsWith(".m3u8")) {
            return "application/vnd.apple.mpegurl";
        } else if (fileName.endsWith(".ts")) {
            return "video/mp2t";
        }
        return "application/octet-stream";
    }

    /**
     * Update lesson with HLS playlist URL
     */
    private void updateLessonWithHLS(Long lessonId, String playlistKey) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
        if (lessonOpt.isPresent()) {
            Lesson lesson = lessonOpt.get();
            lesson.setVideoObjectKey(playlistKey);
            lesson.setVideoStatus(VideoStatus.READY);
            lessonRepository.save(lesson);
            log.info("Lesson {} updated with HLS URL: {}", lessonId, playlistKey);
        } else {
            log.warn("Lesson {} not found", lessonId);
        }
    }

    /**
     * Update lesson status
     */
    private void updateLessonStatus(Long lessonId, VideoStatus status) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
        if (lessonOpt.isPresent()) {
            Lesson lesson = lessonOpt.get();
            lesson.setVideoStatus(status);
            lessonRepository.save(lesson);
            log.info("Lesson {} status: {}", lessonId, status);
        }
    }

    /**
     * Cleanup temporary files
     */
    private void cleanup(Path workDir) {
        try {
            try (Stream<Path> files = Files.walk(workDir)) {
                files.sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException e) {
                                log.warn("Failed to delete: {}", path, e);
                            }
                        });
            }
            log.info("Cleaned up temp directory: {}", workDir);
        } catch (Exception e) {
            log.warn("Failed to cleanup temp directory: {}", workDir, e);
        }
    }
}
