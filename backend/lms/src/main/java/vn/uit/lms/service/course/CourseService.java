package vn.uit.lms.service.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.entity.course.Category;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseTag;
import vn.uit.lms.core.entity.course.Tag;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.course.CategoryRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.TagRepository;
import vn.uit.lms.service.helper.SEOHelper;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.CourseRequest;
import vn.uit.lms.shared.dto.request.course.CourseUpdateRequest;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
import vn.uit.lms.shared.dto.response.course.CourseResponse;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.mapper.course.CourseMapper;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.Objects;

@Service
public class CourseService {

    private static final String PREFIX_CANONICAL_URL = "/courses";
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final TeacherRepository teacherRepository;
    private final SEOHelper seoHelper;
    private final AccountRepository accountRepository;

    public CourseService(CourseRepository courseRepository,
                         CategoryRepository categoryRepository,
                         TagRepository tagRepository,
                         AccountRepository accountRepository,
                         TeacherRepository teacherRepository,
                         SEOHelper seoHelper) {
        this.seoHelper = seoHelper;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.teacherRepository = teacherRepository;
        this.accountRepository = accountRepository;
    }

    private Teacher verifyTeacher(Course course) {
        String emailCurrentLogin = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account account = accountRepository.findOneByEmailIgnoreCase(emailCurrentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if(account.getStatus() != AccountStatus.ACTIVE) {
            throw new UnauthorizedException("Account is not active");
        }

        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if(!teacher.isApproved()){
            throw new UnauthorizedException("Teacher is not approved");
        }

        if(course != null){
            if(!Objects.equals(course.getTeacher().getId(), teacher.getId())){
                throw new UnauthorizedException("Teacher does not own this course");
            }
        }

        return teacher;
    }


    private void createSeoData(Course course) {
        if(course.getMetaTitle()==null||course.getMetaTitle().isEmpty()){
            course.setMetaTitle(course.getTitle());
        }

        if(course.getMetaDescription()==null||course.getMetaDescription().isEmpty()) {
            String shortDesc = seoHelper.normalizeMetaDescription(course.getShortDescription());
            course.setMetaDescription(shortDesc);
        }

        if(course.getId()==null){
            course.setSlug(seoHelper.toSlug(course.getTitle()));
            if (courseRepository.existsBySlug(course.getSlug())) {
                throw new DuplicateResourceException("Title already exists, please choose a different title");
            }

            course.setCanonicalUrl(seoHelper.generateCanonicalUrl(PREFIX_CANONICAL_URL, course.getSlug()));
        }

        if(course.getSeoKeywords()==null||course.getSeoKeywords().isEmpty()) {
            List<String> tagNames = course.getCourseTags().stream()
                    .map(ct -> ct.getTag().getName())
                    .toList();
            List<String> keywords = seoHelper.autoKeywords(course.getTitle(), tagNames);
            course.setSeoKeywords(String.join(", ", keywords));
        }

    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse createCourse(CourseRequest courseRequest) {

        Course newCourse = new Course();
        newCourse.setTitle(courseRequest.getTitle());
        newCourse.setShortDescription(courseRequest.getShortDescription());

        Category category = this.categoryRepository.findByIdAndDeletedAtIsNull(courseRequest.getCategoryId())
                .orElseThrow(() -> new InvalidRequestException("Category not found"));
        newCourse.setCategory(category);

       Teacher teacher = verifyTeacher(null);

        newCourse.setTeacher(teacher);

        List<String> requestTags = courseRequest.getTags();
        List<Tag> tags = tagRepository.findAllByNameInIgnoreCase(requestTags);

        if (tags.size() != requestTags.size()) {
            throw new InvalidRequestException("Some tags do not exist");
        }

        //assign tags to course
        List<CourseTag> courseTags = tags.stream()
                .map(tag -> {
                    CourseTag ct = new CourseTag();
                    ct.setCourse(newCourse);
                    ct.setTag(tag);
                    return ct;
                }).toList();

        //set course tags
        newCourse.setCourseTags(courseTags);

        newCourse.setIsClosed(courseRequest.getIsClosed());
        newCourse.setDifficulty(courseRequest.getDifficulty());
        newCourse.setMetaTitle(courseRequest.getMetaTitle());
        newCourse.setMetaDescription(courseRequest.getMetaDescription());
        newCourse.setSeoKeywords(courseRequest.getSeoKeywords());
        newCourse.setThumbnailUrl(courseRequest.getThumbnailUrl());
        newCourse.setIndexed(courseRequest.getIsIndexed());

        createSeoData(newCourse);

        Course savedCourse = courseRepository.save(newCourse);

        return CourseMapper.toCourseDetailResponse(savedCourse);


    }

    @EnableSoftDeleteFilter
    public CourseDetailResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));

        return CourseMapper.toCourseDetailResponse(course);
    }

    @EnableSoftDeleteFilter
    public PageResponse<CourseResponse> getCoursesActive(Specification<Course> spec, Pageable pageable) {
        Page<Course> coursePage =  courseRepository.findAll(spec, pageable);
        List<CourseResponse> items = coursePage.getContent().stream()
                .map(CourseMapper::toCourseResponse)
                .toList();

        return new PageResponse<>(
                items,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.hasNext(),
                coursePage.hasPrevious()
        );
    }

    public PageResponse<CourseResponse> getAllCourses(Specification<Course> spec, Pageable pageable) {
        Page<Course> coursePage =  courseRepository.findAll(spec, pageable);
        List<CourseResponse> items = coursePage.getContent().stream()
                .map(CourseMapper::toCourseResponse)
                .toList();

        return new PageResponse<>(
                items,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.hasNext(),
                coursePage.hasPrevious()
        );
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse closeCourse(Long id) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        verifyTeacher(course);

        course.setIsClosed(true);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse openCourse(Long id) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        verifyTeacher(course);

        course.setIsClosed(false);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse updateCourse(Long id, CourseUpdateRequest courseUpdateRequest) {

        Course oldCourse = courseRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        verifyTeacher(oldCourse);

        if (courseUpdateRequest.getTitle() != null &&
                !courseUpdateRequest.getTitle().equals(oldCourse.getTitle())) {
            oldCourse.setTitle(courseUpdateRequest.getTitle());

            String newSlug = seoHelper.toSlug(courseUpdateRequest.getTitle());

            if (!newSlug.equals(oldCourse.getSlug())
                    && courseRepository.existsBySlug(newSlug)) {
                throw new DuplicateResourceException("Slug exists, choose another title");
            }

            oldCourse.setSlug(newSlug);
            oldCourse.setCanonicalUrl(seoHelper.generateCanonicalUrl(PREFIX_CANONICAL_URL, newSlug));
        }

        if (courseUpdateRequest.getShortDescription() != null) {
            oldCourse.setShortDescription(courseUpdateRequest.getShortDescription());
        }

        if (courseUpdateRequest.getMetaTitle() != null) {
            oldCourse.setMetaTitle(courseUpdateRequest.getMetaTitle());
        }

        if (courseUpdateRequest.getMetaDescription() != null) {
            oldCourse.setMetaDescription(courseUpdateRequest.getMetaDescription());
        }

        if (courseUpdateRequest.getSeoKeywords() != null) {
            oldCourse.setSeoKeywords(courseUpdateRequest.getSeoKeywords());
        }

        if (courseUpdateRequest.getThumbnailUrl() != null) {
            oldCourse.setThumbnailUrl(courseUpdateRequest.getThumbnailUrl());
        }

        if (courseUpdateRequest.getIsClosed() != null) {
            oldCourse.setIsClosed(courseUpdateRequest.getIsClosed());
        }

        if (courseUpdateRequest.getDifficulty() != null) {
            oldCourse.setDifficulty(courseUpdateRequest.getDifficulty());
        }

        if (courseUpdateRequest.getIsIndexed() != null) {
            oldCourse.setIndexed(courseUpdateRequest.getIsIndexed());
        }

        // Update category if changed
        if (courseUpdateRequest.getCategoryId() != null &&
                !Objects.equals(oldCourse.getCategory().getId(), courseUpdateRequest.getCategoryId())) {
            Category category = categoryRepository.findByIdAndDeletedAtIsNull(courseUpdateRequest.getCategoryId())
                    .orElseThrow(() -> new InvalidRequestException("Category not found"));
            oldCourse.setCategory(category);
        }

        if (courseUpdateRequest.getTags() != null && !courseUpdateRequest.getTags().isEmpty()) {
            List<Tag> newTags = tagRepository.findAllByNameInIgnoreCase(courseUpdateRequest.getTags());

            // Get current tag IDs
            List<Long> currentTagIds = oldCourse.getCourseTags().stream()
                    .map(ct -> ct.getTag().getId())
                    .toList();

            List<Long> newTagIds = newTags.stream()
                    .map(Tag::getId)
                    .toList();

            // Remove tags that are not in the new list
            oldCourse.getCourseTags().removeIf(ct ->
                    !newTagIds.contains(ct.getTag().getId())
            );

            // Add only new tags (avoid duplicates)
            newTags.stream()
                    .filter(tag -> !currentTagIds.contains(tag.getId()))
                    .forEach(tag -> {
                        CourseTag ct = new CourseTag();
                        ct.setCourse(oldCourse);
                        ct.setTag(tag);
                        oldCourse.getCourseTags().add(ct);
                    });
        }

        if (courseUpdateRequest.getMetaTitle() == null && oldCourse.getMetaTitle() == null) {
            oldCourse.setMetaTitle(oldCourse.getTitle());
        }

        if (courseUpdateRequest.getMetaDescription() == null && oldCourse.getMetaDescription() == null) {
            String shortDesc = seoHelper.normalizeMetaDescription(oldCourse.getShortDescription());
            oldCourse.setMetaDescription(shortDesc);
        }

        if (courseUpdateRequest.getSeoKeywords() == null && oldCourse.getSeoKeywords() == null) {
            List<String> tagNames = oldCourse.getCourseTags().stream()
                    .map(ct -> ct.getTag().getName())
                    .toList();
            List<String> keywords = seoHelper.autoKeywords(oldCourse.getTitle(), tagNames);
            oldCourse.setSeoKeywords(String.join(", ", keywords));
        }

        // Save and return
        Course savedCourse = courseRepository.save(oldCourse);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public void deleteCourse(Long id) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        verifyTeacher(course);

        courseRepository.delete(course);
    }

    @Transactional
    public CourseDetailResponse restoreCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        verifyTeacher(course);

        course.setDeletedAt(null);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    public PageResponse<CourseResponse> getMyCourses(Specification<Course> spec, Pageable pageable) {

        Teacher teacher = verifyTeacher(null);

        Specification<Course> teacherSpec = (root, query, cb) -> cb.equal(root.get("teacher"), teacher);

        if (spec == null) {
            spec = teacherSpec;
        } else {
            spec = spec.and(teacherSpec);
        }

        Page<Course> coursePage = courseRepository.findAll(spec, pageable);

        List<CourseResponse> items = coursePage.getContent().stream()
                .map(CourseMapper::toCourseResponse)
                .toList();

        return new PageResponse<>(
                items,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.hasNext(),
                coursePage.hasPrevious()
        );
    }


}
