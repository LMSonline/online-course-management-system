package vn.uit.lms.service.course;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.config.MinioBucketProperties;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.storage.MinioService;
import vn.uit.lms.shared.dto.response.course.CoursePreviewResponse;
import vn.uit.lms.shared.dto.response.course.content.ChapterPreviewDto;
import vn.uit.lms.shared.dto.response.course.content.LessonPreviewDto;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.InvalidRequestException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for handling public course preview operations
 * Allows anyone to view published courses and their preview content
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CoursePreviewService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final MinioService minioService;
    private final MinioBucketProperties minioBucketProperties;

    /**
     * Get public preview of a course by slug
     * Only shows published version with chapters and lessons
     * Preview lessons are marked and can be accessed without enrollment
     */
    @Transactional(readOnly = true)
    public CoursePreviewResponse getCoursePreview(String slug) {
        log.info("Getting course preview for slug: {}", slug);

        // Find course by slug
        Course course = courseRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));

        // Get published version
        CourseVersion publishedVersion = course.getVersionPublish();
        if (publishedVersion == null) {
            throw new ResourceNotFoundException("No published version available for this course");
        }

        // Build response
        return buildCoursePreviewResponse(course, publishedVersion);
    }

    /**
     * Get streaming URL for a preview lesson video
     * Only works for lessons marked as preview (isPreview=true)
     */
    @Transactional(readOnly = true)
    public String getPreviewVideoStreamingUrl(Long lessonId) {
        log.info("Getting preview video streaming URL for lesson: {}", lessonId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // Check if lesson is marked as preview
        if (!lesson.getIsPreview()) {
            throw new InvalidRequestException("This lesson is not available for preview. Enrollment required.");
        }

        // Check if video is ready
        if (!lesson.isVideoReady()) {
            throw new InvalidRequestException("Video is not ready for streaming");
        }

        // Generate HLS playlist with presigned URLs for segments (valid for 1 hour)
        // This returns a base64-encoded data URI that video players can use directly
        String modifiedPlaylist = minioService.generateHLSPlaylistWithPresignedUrls(
                lesson.getVideoObjectKey(),
                minioBucketProperties.getVideos(),
                3600 // 1 hour expiry
        );

        // Return as data URI that video players can use
        return "data:application/vnd.apple.mpegurl;base64," +
               java.util.Base64.getEncoder().encodeToString(modifiedPlaylist.getBytes());
    }

    /**
     * Check if a course has a published version
     */
    @Transactional(readOnly = true)
    public boolean isCoursePublished(String slug) {
        return courseRepository.findBySlugAndDeletedAtIsNull(slug)
                .map(course -> course.getVersionPublish() != null)
                .orElse(false);
    }

    /**
     * Build course preview response from course and published version
     */
    private CoursePreviewResponse buildCoursePreviewResponse(Course course, CourseVersion publishedVersion) {
        // Calculate statistics
        int totalLessons = publishedVersion.getChapters().stream()
                .mapToInt(chapter -> chapter.getLessons().size())
                .sum();

        int totalDurationSeconds = publishedVersion.getChapters().stream()
                .mapToInt(Chapter::getTotalDuration)
                .sum();

        long previewLessonsCount = publishedVersion.getChapters().stream()
                .flatMap(chapter -> chapter.getLessons().stream())
                .filter(Lesson::getIsPreview)
                .count();

        // Map chapters to preview DTOs
        List<ChapterPreviewDto> chapterPreviews = publishedVersion.getChapters().stream()
                .map(this::mapToChapterPreviewDto)
                .collect(Collectors.toList());

        // Build published version DTO
        CoursePreviewResponse.PublishedVersionDto versionDto = CoursePreviewResponse.PublishedVersionDto.builder()
                .id(publishedVersion.getId())
                .versionNumber(publishedVersion.getVersionNumber())
                .title(publishedVersion.getTitle())
                .description(publishedVersion.getDescription())
                .price(publishedVersion.getPrice())
                .durationDays(publishedVersion.getDurationDays())
                .publishedAt(publishedVersion.getPublishedAt())
                .totalChapters(publishedVersion.getChapters().size())
                .totalLessons(totalLessons)
                .totalDurationSeconds(totalDurationSeconds)
                .previewLessonsCount((int) previewLessonsCount)
                .chapters(chapterPreviews)
                .build();

        // Build category DTO
        CoursePreviewResponse.CategoryDto categoryDto = null;
        if (course.getCategory() != null) {
            categoryDto = CoursePreviewResponse.CategoryDto.builder()
                    .id(course.getCategory().getId())
                    .name(course.getCategory().getName())
                    .code(course.getCategory().getCode())
                    .build();
        }

        // Build teacher DTO
        CoursePreviewResponse.TeacherDto teacherDto = CoursePreviewResponse.TeacherDto.builder()
                .id(course.getTeacher().getId())
                .name(course.getTeacher().getFullName())
                .email(course.getTeacher().getAccount().getEmail())
                .bio(course.getTeacher().getBio())
                .build();

        // Build tags list
        List<String> tags = course.getCourseTags().stream()
                .map(courseTag -> courseTag.getTag().getName())
                .collect(Collectors.toList());

        // Build final response
        return CoursePreviewResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .shortDescription(course.getShortDescription())
                .difficulty(course.getDifficulty())
                .thumbnailUrl(course.getThumbnailUrl())
                .slug(course.getSlug())
                .category(categoryDto)
                .teacher(teacherDto)
                .tags(tags)
                .publishedVersion(versionDto)
                .build();
    }

    /**
     * Map Chapter to ChapterPreviewDto
     */
    private ChapterPreviewDto mapToChapterPreviewDto(Chapter chapter) {
        List<LessonPreviewDto> lessonPreviews = chapter.getLessons().stream()
                .map(this::mapToLessonPreviewDto)
                .collect(Collectors.toList());

        return ChapterPreviewDto.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .description(chapter.getDescription())
                .orderIndex(chapter.getOrderIndex())
                .totalLessons(chapter.getLessons().size())
                .totalDurationSeconds(chapter.getTotalDuration())
                .formattedTotalDuration(chapter.getFormattedTotalDuration())
                .lessons(lessonPreviews)
                .build();
    }

    /**
     * Map Lesson to LessonPreviewDto
     */
    private LessonPreviewDto mapToLessonPreviewDto(Lesson lesson) {
        String formattedDuration = formatDuration(lesson.getDurationSeconds());

        return LessonPreviewDto.builder()
                .id(lesson.getId())
                .type(lesson.getType())
                .title(lesson.getTitle())
                .shortDescription(lesson.getShortDescription())
                .videoStatus(lesson.getVideoStatus())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .isPreview(lesson.getIsPreview())
                .isVideoReady(lesson.isVideoReady())
                .formattedDuration(formattedDuration)
                .build();
    }

    /**
     * Format duration from seconds to MM:SS or HH:MM:SS format
     */
    private String formatDuration(Integer durationSeconds) {
        if (durationSeconds == null || durationSeconds == 0) {
            return "00:00";
        }

        int hours = durationSeconds / 3600;
        int minutes = (durationSeconds % 3600) / 60;
        int seconds = durationSeconds % 60;

        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }
}

