package vn.uit.lms.service.course.content;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.core.repository.course.content.ChapterRepository;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.service.course.CourseVersionService;
import vn.uit.lms.shared.dto.request.course.content.ChapterReorderRequest;
import vn.uit.lms.shared.dto.request.course.content.ChapterRequest;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.content.ChapterMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChapterService {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final CourseVersionRepository courseVersionRepository;
    private final CourseService courseService;
    private final CourseVersionService courseVersionService;

    public ChapterService(CourseRepository courseRepository,
                          ChapterRepository chapterRepository,
                          CourseVersionRepository courseVersionRepository,
                          CourseService courseService,
                          CourseVersionService courseVersionService) {
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.courseVersionRepository = courseVersionRepository;
        this.courseService = courseService;
        this.courseVersionService = courseVersionService;
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
    public void reorderChapter(Long chapterId, ChapterReorderRequest request) {
        Chapter chapter = this.chapterRepository.findByIdAndDeletedAtIsNull(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        CourseVersion courseVersion = chapter.getCourseVersion();
        if (courseVersion == null) {
            throw new ResourceNotFoundException("CourseVersion not found for chapter");
        }

        // verify teacher permission
        Course course = courseVersion.getCourse();
        if (course == null || course.getId() == null) {
            throw new ResourceNotFoundException("Course not found for chapter's version");
        }
        course = this.courseRepository.findByIdAndDeletedAtIsNull(course.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        courseService.verifyTeacher(course);

        // ensure version is editable
        courseVersion = this.courseVersionService.validateVersionEditable(courseVersion.getId());

        //lock chapter reordering process
        List<Chapter> chapters = this.chapterRepository.findChaptersForReorder(courseVersion);
        if (chapters.isEmpty()) {
            return;
        }

        int size = chapters.size();
        int newPosition = request.getNewPosition() <= 0 ? 1 : request.getNewPosition();
        if (newPosition > size) {
            newPosition = size;
        }

        int currentIndex = -1;
        for (int i = 0; i < chapters.size(); i++) {
            if (chapters.get(i).getId().equals(chapterId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex == -1) {
            throw new ResourceNotFoundException("Chapter does not belong to this version");
        }

        int targetIndex = newPosition - 1;
        if (currentIndex == targetIndex) {
            return; // nothing to do
        }

        Chapter moving = chapters.remove(currentIndex);
        chapters.add(targetIndex, moving);

        // reassign orderIndex starting from 1
        for (int i = 0; i < chapters.size(); i++) {
            Chapter c = chapters.get(i);
            int expectedIndex = i + 1;
            if (c.getOrderIndex() != expectedIndex) {
                c.setOrderIndex(expectedIndex);
            }
        }

        this.chapterRepository.saveAll(chapters);
    }


}
