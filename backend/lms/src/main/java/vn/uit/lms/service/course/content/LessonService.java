package vn.uit.lms.service.course.content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.config.MinioBucketProperties;
import vn.uit.lms.config.RabbitMQConfig;
import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.core.entity.course.content.Chapter;
import vn.uit.lms.core.entity.course.content.Lesson;
import vn.uit.lms.core.repository.course.content.ChapterRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.service.event.VideoConvertMessage;
import vn.uit.lms.service.storage.MinioService;
import vn.uit.lms.shared.dto.request.course.content.CreateLessonRequest;
import vn.uit.lms.shared.dto.request.course.content.UpdateVideoRequest;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;
import vn.uit.lms.shared.dto.response.course.content.RequestUploadUrlResponse;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.content.LessonMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final LessonRepository lessonRepository;
    private final MinioService minioService;
    private final ChapterService chapterService;
    private final ChapterRepository chapterRepository;
    private final MinioBucketProperties minioBucketProperties;
    private final RabbitTemplate rabbitTemplate;

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
            throw new DuplicateResourceException("Title already exists");
        }

        lesson.setChapter(chapter);
        lesson.setContentUrl(null);
        lesson.setDurationSeconds(0);
        lesson.setOrderIndex(chapter.getTotalLessons()+1);

        Lesson savedLesson = lessonRepository.save(lesson);
        log.info("Created lesson with id: {}", savedLesson.getId());

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
     * Complete video upload and trigger processing
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

        String contentUrl = minioService.buildPublicUrl(request.getObjectKey(), minioBucketProperties.getVideos());

        boolean isExistVideo = minioService.isExistsObject(request.getObjectKey(), minioBucketProperties.getVideos());

        if (!isExistVideo) {
            throw new ResourceNotFoundException("Video object not found in storage with key: " + request.getObjectKey());
        }

        // TODO: Create video processing job record
        // VideoProcessingJob job = new VideoProcessingJob();
        // job.setLesson(lesson);
        // job.setStatus(VideoProcessingStatus.UPLOADED);
        // job.setOriginalObjectKey(request.getObjectKey());
        // videoProcessingJobRepository.save(job);

        VideoConvertMessage videoConvertMessage = new VideoConvertMessage();
        videoConvertMessage.setObjectKey(request.getObjectKey());
        videoConvertMessage.setBucket(minioBucketProperties.getVideos());
        // TODO: Add lessonId and jobId to message for tracking
        // videoConvertMessage.setLessonId(lessonId);
        // videoConvertMessage.setJobId(job.getId());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.VIDEO_CONVERT_EXCHANGE,
                RabbitMQConfig.VIDEO_CONVERT_ROUTING_KEY,
                videoConvertMessage
        );

        // TODO: Update with placeholder URL until conversion completes
        // Set contentUrl to HLS playlist path (will be available after conversion)
        lesson.setContentUrl(contentUrl);
        lesson.setDurationSeconds(request.getDurationSeconds());
        // TODO: Add processing status field
        // lesson.setVideoStatus(VideoStatus.PROCESSING);

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Updated lesson video for lesson id: {}, video processing initiated", lessonId);

        return LessonMapper.toResponse(updatedLesson);
    }

    // TODO: Implement updateLesson method
    // @Transactional
    // public LessonDTO updateLesson(Long lessonId, UpdateLessonRequest request) {
    //     - Validate lesson is editable
    //     - Update title, description, type, isFree, isPreview
    //     - Check for duplicate title within chapter
    //     - Validate lesson type changes (e.g., VIDEO to QUIZ requires content migration)
    // }

    // TODO: Implement deleteLesson method
    // @Transactional
    // public void deleteLesson(Long lessonId) {
    //     - Validate lesson is editable
    //     - Delete associated video files from MinIO
    //     - Delete lesson resources
    //     - Remove progress records
    //     - Reorder remaining lessons in chapter
    // }

    // TODO: Implement reorderLessons method
    // @Transactional
    // public void reorderLessons(Long chapterId, List<Long> lessonIds) {
    //     - Validate all lessons belong to the chapter
    //     - Update orderIndex for each lesson
    //     - Ensure no gaps in ordering
    // }

    // TODO: Implement getLessonById method
    // public LessonDTO getLessonById(Long lessonId) {
    //     - Return lesson details with chapter and course info
    //     - Include video streaming URL if available
    //     - Show resources count
    // }

    // TODO: Implement getLessonForStudent method
    // public LessonDTO getLessonForStudent(Long lessonId, Long studentId) {
    //     - Verify student enrollment in course
    //     - Check if lesson is accessible (not locked by prerequisites)
    //     - Include student's progress for this lesson
    //     - Track lesson view/access
    //     - Generate streaming token for video
    // }

    // TODO: Implement markLessonComplete method
    // @Transactional
    // public void markLessonComplete(Long lessonId, Long studentId) {
    //     - Verify enrollment and access
    //     - Create/update LessonProgress record
    //     - Update overall course progress
    //     - Unlock next lesson if applicable
    //     - Award points/badges if configured
    // }

    // TODO: Implement getVideoStreamingUrl method
    // public String getVideoStreamingUrl(Long lessonId, Long studentId) {
    //     - Verify enrollment and access
    //     - Check video processing status
    //     - Generate time-limited streaming token
    //     - Return HLS playlist URL with token
    //     - Log streaming session
    // }

    // TODO: Implement handleVideoProcessingComplete method (called by webhook/consumer)
    // @Transactional
    // public void handleVideoProcessingComplete(Long lessonId, VideoProcessingResult result) {
    //     - Update lesson with HLS playlist URL
    //     - Set video status to COMPLETED
    //     - Update video metadata (resolution, bitrate, etc.)
    //     - Save thumbnail URLs
    //     - Notify teacher about completion
    //     - Delete original uploaded file if configured
    // }

    // TODO: Implement handleVideoProcessingFailed method
    // @Transactional
    // public void handleVideoProcessingFailed(Long lessonId, String errorMessage) {
    //     - Set video status to FAILED
    //     - Log error details
    //     - Notify teacher about failure
    //     - Keep original video as fallback
    //     - Allow retry option
    // }

}


