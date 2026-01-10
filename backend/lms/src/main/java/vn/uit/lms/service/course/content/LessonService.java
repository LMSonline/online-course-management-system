package vn.uit.lms.service.course.content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.config.MinioBucketProperties;
import vn.uit.lms.config.RabbitMQConfig;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.course.content.LessonResource;
import vn.uit.lms.core.repository.course.content.ChapterRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.core.repository.course.content.LessonResourceRepository;
import vn.uit.lms.service.event.VideoConvertMessage;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.service.storage.MinioService;
import vn.uit.lms.shared.dto.request.course.content.CreateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.ReorderLessonsRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateVideoRequest;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;
import vn.uit.lms.shared.dto.response.course.content.RequestUploadUrlResponse;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.content.LessonMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonResourceRepository lessonResourceRepository;
    private final MinioService minioService;
    private final ChapterService chapterService;
    private final ChapterRepository chapterRepository;
    private final MinioBucketProperties minioBucketProperties;
    private final RabbitTemplate rabbitTemplate;
    private final EnrollmentAccessService enrollmentAccessService;

    public Lesson validateLessonEditable(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Chapter chapter = lesson.getChapter();
        chapterService.validateChapterEditable(chapter.getId());
        return lesson;
    }


    @Transactional
    public LessonDTO createLesson(CreateLessonRequest request, Long chapterId) {
        Chapter chapter = chapterService.validateChapterEditable(chapterId);

        Lesson lesson = LessonMapper.toEntity(request);

        boolean existTitle = this.lessonRepository.existsByTitleAndChapter(lesson.getTitle(), chapter);

        if (existTitle) {
            throw new DuplicateResourceException("Title already exists in this chapter");
        }

        lesson.setChapter(chapter);
        lesson.setVideoObjectKey(null);
        lesson.setOrderIndex(chapter.getTotalLessons());
        lesson.validateLesson();

        Lesson savedLesson = lessonRepository.save(lesson);
        log.info("Created lesson with id: {} in chapter: {}", savedLesson.getId(), chapterId);

        return LessonMapper.toResponse(savedLesson);
    }

    public RequestUploadUrlResponse requestUploadUrl(Long lessonId) {

        validateLessonEditable(lessonId);

        String objectKey = minioService.generateObjectKeyLessons(lessonId);
        String uploadUrl = minioService.generatePresignedUploadUrl(lessonId, minioBucketProperties.getVideos(), objectKey);

        return RequestUploadUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .objectKey(objectKey)
                .expiresInSeconds(900L)
                .build();
    }



    public List<LessonDTO> getLessonsByChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + chapterId));

        List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

        return lessons.stream()
                .map(LessonMapper::toResponse)
                .toList();
    }

    /**
     * Get lesson details by ID
     */
    public LessonDTO getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        return LessonMapper.toResponse(lesson);
    }

    /**
     * Update lesson
     */
    @Transactional
    public LessonDTO updateLesson(Long lessonId, UpdateLessonRequest request) {
        Lesson lesson = validateLessonEditable(lessonId);

        // Check for duplicate title if title changed
        if (!lesson.getTitle().equals(request.getTitle())) {
            boolean existTitle = lessonRepository.existsByTitleAndChapter(request.getTitle(), lesson.getChapter());
            if (existTitle) {
                throw new DuplicateResourceException("Title already exists in this chapter");
            }
        }

        // Update type (domain validation)
        lesson.updateType(request.getType());

        // Update basic info
        lesson.updateBasicInfo(request.getTitle(), request.getShortDescription(), request.getIsPreview());

        lesson.validateLesson();
        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Updated lesson with id: {}", lessonId);

        return LessonMapper.toResponse(updatedLesson);
    }

    /**
     * Delete lesson
     */
    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = validateLessonEditable(lessonId);

        // Delete video from MinIO if exists
        if (lesson.getVideoObjectKey() != null) {
            try {
                minioService.deleteObject(lesson.getVideoObjectKey(), minioBucketProperties.getVideos());
                log.info("Deleted video for lesson: {}", lessonId);
            } catch (Exception e) {
                log.warn("Failed to delete video for lesson: {}, error: {}", lessonId, e.getMessage());
            }
        }

        Chapter chapter = lesson.getChapter();
        Integer deletedOrderIndex = lesson.getOrderIndex();

        // Delete lesson (cascade will delete resources)
        lessonRepository.delete(lesson);

        // Reorder remaining lessons
        List<Lesson> remainingLessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);
        for (int i = 0; i < remainingLessons.size(); i++) {
            Lesson l = remainingLessons.get(i);
            if (l.getOrderIndex() > deletedOrderIndex) {
                l.updateOrderIndex(i);
            }
        }
        lessonRepository.saveAll(remainingLessons);

        log.info("Deleted lesson with id: {}", lessonId);
    }

    /**
     * Reorder lessons in a chapter
     */
    @Transactional
    public void reorderLessons(Long chapterId, ReorderLessonsRequest request) {
        Chapter chapter = chapterService.validateChapterEditable(chapterId);

        List<Long> lessonIds = request.getLessonIds();

        // Validate all lessons belong to this chapter
        List<Lesson> lessons = lessonRepository.findAllById(lessonIds);

        if (lessons.size() != lessonIds.size()) {
            throw new InvalidRequestException("Some lessons not found");
        }

        for (Lesson lesson : lessons) {
            if (!lesson.getChapter().getId().equals(chapterId)) {
                throw new InvalidRequestException("Lesson " + lesson.getId() + " does not belong to chapter " + chapterId);
            }
        }

        // Update order index
        for (int i = 0; i < lessonIds.size(); i++) {
            Long lessonId = lessonIds.get(i);
            Lesson lesson = lessons.stream()
                    .filter(l -> l.getId().equals(lessonId))
                    .findFirst()
                    .orElseThrow();
            lesson.updateOrderIndex(i);
        }

        lessonRepository.saveAll(lessons);
        log.info("Reordered {} lessons in chapter: {}", lessonIds.size(), chapterId);
    }

    /**
     * Complete video upload and trigger processing
     *
     * IMPORTANT: When uploading new video
     * 1. Delete old video (raw + HLS) if exists
     * 2. Update lesson with new video
     * 3. Trigger processing for new video
     *
     * TODO: Enhance video processing workflow
     * - Add video validation (format, codec, resolution)
     * - Implement retry mechanism for failed conversions
     * - Store conversion job ID for tracking
     * - Add webhook endpoint to receive conversion completion notification
     * - Update lesson with HLS playlist URL after conversion completes
     * - Generate video thumbnails at different timestamps
     * - Extract video metadata (resolution, bitrate, codec)
     * - Create VideoProcessingJob entity to track status
     * - Support multiple video qualities (360p, 480p, 720p, 1080p)
     * - Implement fallback to original video if conversion fails
     * - Add progress tracking for video processing
     * - Send notification to teacher when processing completes
     * - Clean up temporary/original files after conversion
     *
     * Video Processing States:
     * - UPLOADED: Video uploaded, waiting for processing
     * - PROCESSING: Video being converted to HLS
     * - COMPLETED: Video ready for streaming
     * - FAILED: Processing failed
     *
     * Storage Structure:
     * - Original: videos/lessons/{lessonId}/original.mp4
     * - HLS Output: videos/lessons/{lessonId}/hls/master.m3u8
     * - Thumbnails: videos/lessons/{lessonId}/thumbnails/thumb_{timestamp}.jpg
     */
    @Transactional
    public LessonDTO uploadVideoLessonComplete(Long lessonId, UpdateVideoRequest request) {

        Lesson lesson = validateLessonEditable(lessonId);

        if (!lesson.isVideoLesson()) {
            throw new InvalidRequestException("Only VIDEO type lessons can have videos");
        }

        boolean isExistVideo = minioService.isExistsObject(request.getObjectKey(), minioBucketProperties.getVideos());

        if (!isExistVideo) {
            throw new ResourceNotFoundException("Video object not found in storage with key: " + request.getObjectKey());
        }

        // IMPORTANT: Delete old video if exists (raw + HLS)
        if (lesson.getVideoObjectKey() != null) {
            log.info("Deleting old video for lesson: {}", lessonId);
            try {
                minioService.deleteVideoCompletely(
                    lesson.getVideoObjectKey(),
                    minioBucketProperties.getVideos(),
                    lessonId
                );
                log.info("Successfully deleted old video (raw + HLS) for lesson: {}", lessonId);
            } catch (Exception e) {
                log.warn("Failed to delete old video for lesson: {}, continuing with new upload. Error: {}",
                        lessonId, e.getMessage());
                // Continue even if deletion fails - new video will overwrite
            }
        }

        // Use domain method to mark video uploaded
        lesson.markVideoUploaded(request.getObjectKey());
        lesson.setDurationSeconds(request.getDurationSeconds());

        // Send message to video processing queue
        VideoConvertMessage videoConvertMessage = new VideoConvertMessage();
        videoConvertMessage.setObjectKey(request.getObjectKey());
        videoConvertMessage.setBucket(minioBucketProperties.getVideos());
        videoConvertMessage.setLessonId(lessonId);  // Include lessonId for updating after processing

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.VIDEO_CONVERT_EXCHANGE,
                RabbitMQConfig.VIDEO_CONVERT_ROUTING_KEY,
                videoConvertMessage
        );

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Updated lesson video for lesson id: {}, video processing initiated", lessonId);

        return LessonMapper.toResponse(updatedLesson);
    }

    /**
     * Get video streaming URL (HLS playlist with presigned URLs)
     *
     * For HLS streaming, we need to:
     * 1. Get the playlist object key (e.g., hls/lessons/1/index.m3u8)
     * 2. Generate modified playlist with presigned URLs for all segments
     * 3. Return the modified playlist content as inline data URI
     *
     * Alternative approaches:
     * - Return presigned URL for playlist (but segments will still be forbidden)
     * - Set MinIO bucket policy to public (not secure)
     * - Use proxy endpoint to serve HLS files (adds latency)
     */
    public String getVideoStreamingUrl(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        if (!lesson.isVideoReady()) {
            throw new InvalidRequestException("Video is not ready for streaming");
        }

        // Generate HLS playlist with presigned URLs for segments (valid for 1 hour)
        String modifiedPlaylist = minioService.generateHLSPlaylistWithPresignedUrls(
                lesson.getVideoObjectKey(),
                minioBucketProperties.getVideos(),
                3600 // 1 hour
        );

        // Return as data URI that video players can use
        return "data:application/vnd.apple.mpegurl;base64," +
               java.util.Base64.getEncoder().encodeToString(modifiedPlaylist.getBytes());
    }

    /**
     * Delete video from lesson (including raw video and HLS files)
     */
    @Transactional
    public LessonDTO deleteVideo(Long lessonId) {
        Lesson lesson = validateLessonEditable(lessonId);

        if (lesson.getVideoObjectKey() == null) {
            throw new InvalidRequestException("Lesson has no video to delete");
        }

        String objectKey = lesson.getVideoObjectKey();

        // Delete from MinIO (raw video + HLS folder)
        try {
            minioService.deleteVideoCompletely(objectKey, minioBucketProperties.getVideos(), lessonId);
            log.info("Deleted video completely (raw + HLS) for lesson: {}", lessonId);
        } catch (Exception e) {
            log.warn("Failed to delete video completely for lesson: {}, error: {}", lessonId, e.getMessage());
            // Continue to clear lesson data even if MinIO deletion fails
        }

        // Clear video data using domain method
        lesson.clearVideoData();

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Cleared video data for lesson: {}", lessonId);

        return LessonMapper.toResponse(updatedLesson);
    }

    /* ==================== STUDENT ACCESS METHODS ==================== */

    /**
     * Get lesson details for student (with enrollment verification).
     *
     * Access Control:
     * - Preview lessons can be viewed without enrollment
     * - Non-preview lessons require active enrollment
     */
    public LessonDTO getLessonForStudent(Long lessonId) {
        log.debug("Getting lesson {} for student", lessonId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // If lesson is preview, allow access without enrollment
        if (lesson.getIsPreview() != null && lesson.getIsPreview()) {
            log.debug("Lesson {} is preview, allowing access", lessonId);
            return LessonMapper.toResponse(lesson);
        }

        // Otherwise, verify enrollment
        vn.uit.lms.core.domain.learning.Enrollment enrollment =
            enrollmentAccessService.verifyCurrentStudentLessonAccess(lessonId);

        if (!enrollment.isActive()) {
            throw new vn.uit.lms.shared.exception.UnauthorizedException(
                "Enrollment is not active. Cannot view this lesson."
            );
        }

        return LessonMapper.toResponse(lesson);
    }

    /**
     * Get lessons in chapter for student (with enrollment verification).
     * Returns only lessons the student has access to.
     *
     * Access Control: Student must be enrolled in the course.
     */
    public List<LessonDTO> getLessonsForStudent(Long chapterId) {
        log.debug("Getting lessons for student in chapter {}", chapterId);

        // Verify enrollment
        enrollmentAccessService.verifyCurrentStudentChapterAccess(chapterId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + chapterId));

        List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

        return lessons.stream()
                .map(LessonMapper::toResponse)
                .toList();
    }

    /**
     * Get video streaming URL for student (with enrollment verification).
     * Returns HLS playlist with presigned URLs.
     *
     * Access Control: Student must be enrolled (or lesson is preview).
     */
    public String getVideoStreamingUrlForStudent(Long lessonId) {
        log.debug("Getting video streaming URL for student, lesson {}", lessonId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // Check if lesson is preview
        if (lesson.getIsPreview() == null || !lesson.getIsPreview()) {
            // Verify enrollment for non-preview lessons
            enrollmentAccessService.verifyCurrentStudentLessonAccess(lessonId);
        }

        if (!lesson.isVideoReady()) {
            throw new InvalidRequestException("Video is not ready for streaming");
        }

        // Generate HLS playlist with presigned URLs for segments (valid for 1 hour)
        String modifiedPlaylist = minioService.generateHLSPlaylistWithPresignedUrls(
                lesson.getVideoObjectKey(),
                minioBucketProperties.getVideos(),
                3600 // 1 hour
        );

        // Return as data URI that video players can use
        return "data:application/vnd.apple.mpegurl;base64," +
               java.util.Base64.getEncoder().encodeToString(modifiedPlaylist.getBytes());
    }
}
