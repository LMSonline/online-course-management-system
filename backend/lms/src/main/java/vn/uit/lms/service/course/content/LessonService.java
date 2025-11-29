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

    @Transactional
    public LessonDTO uploadVideoLessonComplete(Long lessonId, UpdateVideoRequest request) {

        Lesson lesson = validateLessonEditable(lessonId);

        String contentUrl = minioService.buildPublicUrl(request.getObjectKey(), minioBucketProperties.getVideos());

        boolean isExistVideo = minioService.isExistsObject(request.getObjectKey(), minioBucketProperties.getVideos());

        if (!isExistVideo) {
            throw new ResourceNotFoundException("Video object not found in storage with key: " + request.getObjectKey());
        }

        VideoConvertMessage videoConvertMessage = new VideoConvertMessage();
        videoConvertMessage.setObjectKey(request.getObjectKey());
        videoConvertMessage.setBucket(minioBucketProperties.getVideos());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.VIDEO_CONVERT_EXCHANGE,
                RabbitMQConfig.VIDEO_CONVERT_ROUTING_KEY,
                videoConvertMessage
        );

        lesson.setContentUrl(contentUrl);
        lesson.setDurationSeconds(request.getDurationSeconds());

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Updated lesson video for lesson id: {}", lessonId);

        return LessonMapper.toResponse(updatedLesson);
    }

}
