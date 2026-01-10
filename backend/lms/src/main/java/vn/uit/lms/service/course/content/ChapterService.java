package vn.uit.lms.service.course.content;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.core.repository.course.content.ChapterRepository;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.service.course.CourseVersionService;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.shared.dto.request.course.content.ChapterReorderRequest;
import vn.uit.lms.shared.dto.request.course.content.ChapterRequest;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.content.ChapterMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Chapter Service - Manages course chapters with proper access control.
 *
 * Access Control:
 * - Teachers can CRUD chapters in their own courses
 * - Students can only view chapters if enrolled in the course
 */
@Service
@Slf4j
public class ChapterService {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final CourseVersionRepository courseVersionRepository;
    private final CourseService courseService;
    private final CourseVersionService courseVersionService;
    private final EnrollmentAccessService enrollmentAccessService;

    public ChapterService(CourseRepository courseRepository,
                          ChapterRepository chapterRepository,
                          CourseVersionRepository courseVersionRepository,
                          CourseService courseService,
                          CourseVersionService courseVersionService,
                          EnrollmentAccessService enrollmentAccessService) {
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.courseVersionRepository = courseVersionRepository;
        this.courseService = courseService;
        this.courseVersionService = courseVersionService;
        this.enrollmentAccessService = enrollmentAccessService;
    }

    public Chapter validateChapterEditable(Long chapterId) {
        Chapter chapter = this.chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        CourseVersion courseVersion = chapter.getCourseVersion();
        if (courseVersion == null) {
            throw new ResourceNotFoundException("CourseVersion not found for chapter");
        }

        // ensure version is editable
        courseVersion = this.courseVersionService.validateVersionEditable(courseVersion.getId());

        Course course = courseVersion.getCourse();
        if (course == null) {
            throw new ResourceNotFoundException("Course not found for chapter's version");
        }

        courseService.validateCourse(course.getId());
        courseService.verifyTeacher(course);

        return chapter;

    }


    @Transactional
    @EnableSoftDeleteFilter
    public ChapterDto createNewChapter(ChapterRequest chapterRequest, Long courseId, Long courseVersionId) {
        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        courseService.verifyTeacher(course);

        CourseVersion courseVersion = this.courseVersionService.validateVersionEditable(courseVersionId);

        boolean existTitle = this.chapterRepository.existsByTitleAndCourseVersion(chapterRequest.getTitle(), courseVersion);

        if (existTitle) {
            throw new DuplicateResourceException("Title already exists");
        }

        Chapter newChapter = Chapter.builder()
                .courseVersion(courseVersion)
                .title(chapterRequest.getTitle())
                .orderIndex(courseVersion.getAmountChapter())
                .build();

        Chapter persistedChapter = this.chapterRepository.save(newChapter);

        return ChapterMapper.toChapterDto(persistedChapter);
    }

    @EnableSoftDeleteFilter
    public List<ChapterDto> getListChapters(Long courseId, Long versionId) {
        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        CourseVersion courseVersion = this.courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseVersion not found"));

        List<Chapter> chapters = this.chapterRepository.findAllByCourseVersionOrderByOrderIndexAsc(courseVersion);

        return chapters.stream().map(ChapterMapper::toChapterDto).toList();
    }

    @EnableSoftDeleteFilter
    public ChapterDto getDetailChapter(Long courseId, Long versionId, Long chapterId) {

        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        courseService.verifyTeacher(course);

        CourseVersion courseVersion = this.courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseVersion not found"));

        Chapter chapter = this.chapterRepository.findByIdAndDeletedAtIsNull(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        if (!chapter.getCourseVersion().getId().equals(versionId)) {
            throw new ResourceNotFoundException("Chapter does not belong to this version");
        }

        return ChapterMapper.toChapterDto(chapter);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public ChapterDto updateChapter(Long courseId, Long versionId, Long chapterId, ChapterRequest chapterRequest) {
        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        courseService.verifyTeacher(course);

        CourseVersion courseVersion = this.courseVersionService.validateVersionEditable(versionId);

        Chapter chapter = this.chapterRepository.findByIdAndDeletedAtIsNull(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        if (!chapter.getCourseVersion().getId().equals(versionId)) {
            throw new ResourceNotFoundException("Chapter does not belong to this version");
        }

        if (!chapter.getTitle().equals(chapterRequest.getTitle())) {
            boolean existTitle = this.chapterRepository.existsByTitleAndCourseVersion(chapterRequest.getTitle(), courseVersion);
            if (existTitle) {
                throw new DuplicateResourceException("Title already exists");
            }
            chapter.setTitle(chapterRequest.getTitle());
        }

        Chapter updatedChapter = this.chapterRepository.save(chapter);
        return ChapterMapper.toChapterDto(updatedChapter);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public void deleteChapter(Long courseId, Long versionId, Long chapterId) {
        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        courseService.verifyTeacher(course);

        CourseVersion courseVersion = this.courseVersionService.validateVersionEditable(versionId);

        Chapter chapter = this.chapterRepository.findByIdAndDeletedAtIsNull(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        if (!chapter.getCourseVersion().getId().equals(versionId)) {
            throw new ResourceNotFoundException("Chapter does not belong to this version");
        }

        int deletedIndex = chapter.getOrderIndex();

        chapterRepository.delete(chapter);

        List<Chapter> chapters = chapterRepository.findChaptersForReorder(courseVersion);

        List<Chapter> chaptersToUpdate = chapters.stream()
                .filter(c -> c.getOrderIndex() > deletedIndex)
                .collect(Collectors.toList());

        for (Chapter c : chaptersToUpdate) {
            c.setOrderIndex(c.getOrderIndex() - 1);
        }

        chapterRepository.saveAll(chaptersToUpdate);
    }


    @Transactional
    public void reorderChapters(Long courseId, Long versionId, ChapterReorderRequest request) {
        // Verify course exists and teacher has permission
        Course course = this.courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        courseService.verifyTeacher(course);

        // Ensure version is editable
        CourseVersion courseVersion = this.courseVersionService.validateVersionEditable(versionId);

        // Verify version belongs to course
        if (!courseVersion.getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("Version does not belong to this course");
        }

        List<Long> chapterIds = request.getChapterIds();

        // Validate all chapters belong to this version
        List<Chapter> chapters = this.chapterRepository.findAllById(chapterIds);

        if (chapters.size() != chapterIds.size()) {
            throw new InvalidRequestException("Some chapters not found");
        }

        for (Chapter chapter : chapters) {
            if (!chapter.getCourseVersion().getId().equals(versionId)) {
                throw new InvalidRequestException("Chapter " + chapter.getId() + " does not belong to version " + versionId);
            }
        }

        // Update order index starting from 0
        for (int i = 0; i < chapterIds.size(); i++) {
            Long chapterId = chapterIds.get(i);
            Chapter chapter = chapters.stream()
                    .filter(c -> c.getId().equals(chapterId))
                    .findFirst()
                    .orElseThrow();
            chapter.setOrderIndex(i);
        }

        this.chapterRepository.saveAll(chapters);
        log.info("Reordered {} chapters in version: {}", chapterIds.size(), versionId);
    }

    /* ==================== STUDENT ACCESS METHODS ==================== */

    /**
     * Get chapter details for student (with enrollment verification).
     *
     * Access Control: Student must be enrolled in the course.
     */
    public ChapterDto getChapterForStudent(Long chapterId) {
        log.debug("Getting chapter {} for student", chapterId);

        // Verify enrollment first
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentChapterAccess(chapterId);

        // Load chapter
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + chapterId));

        return ChapterMapper.toChapterDto(chapter);
    }

    /**
     * Get all chapters in a course for student (with enrollment verification).
     * Returns chapters from the published version only.
     *
     * Access Control: Student must be enrolled in the course.
     */
    public List<ChapterDto> getChaptersForStudent(Long courseId) {
        log.debug("Getting chapters for student in course {}", courseId);

        // Verify enrollment
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentEnrollment(courseId);

        // Get published version from enrollment
        CourseVersion publishedVersion = enrollment.getCourseVersion();

        if (publishedVersion == null) {
            throw new ResourceNotFoundException("No published version available for this course");
        }

        // Load chapters
        List<Chapter> chapters = chapterRepository
                .findAllByCourseVersionOrderByOrderIndexAsc(publishedVersion);

        return chapters.stream()
                .map(ChapterMapper::toChapterDto)
                .toList();
    }


}
