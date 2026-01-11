package vn.uit.lms.service.course;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.course.*;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.course.CategoryRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.TagRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.helper.SEOHelper;
import vn.uit.lms.service.storage.CloudinaryStorageService;
import vn.uit.lms.shared.annotation.Audit;
import vn.uit.lms.shared.constant.AuditAction;
import vn.uit.lms.shared.constant.CourseStatus;
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
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.Role;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class CourseService {

    private static final String PREFIX_CANONICAL_URL = "/courses";

    @Value("${app.course.thumbnail.max-size-bytes:10485760}")
    private long maxThumbnailSizeBytes;

    @Value("#{'${app.course.thumbnail.allowed-content-types:image/jpeg,image/png,image/webp}'.split(',')}")
    private List<String> allowedThumbnailContentTypes;

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final TeacherRepository teacherRepository;
    private final SEOHelper seoHelper;
    private final AccountService accountService;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository,
                         CategoryRepository categoryRepository,
                         TagRepository tagRepository,
                         TeacherRepository teacherRepository,
                         SEOHelper seoHelper,
                         AccountService accountService,
                         CloudinaryStorageService cloudinaryStorageService,
                         EnrollmentRepository enrollmentRepository) {
        this.seoHelper = seoHelper;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.teacherRepository = teacherRepository;
        this.accountService = accountService;
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.enrollmentRepository = enrollmentRepository;
    }
    public Course validateCourse(Long courseId) {
        return courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

    }

    //verify teacher is owner of course
    public Teacher verifyTeacher(Course course) {

        Account account = accountService.verifyCurrentAccount();

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


   public Teacher verifyTeacherOrAdmin(Course course) {

    Account account = accountService.verifyCurrentAccount();

    //  ADMIN → cho qua ngay
    if (account.getRole() == Role.ADMIN) {
        return null; // hoặc return fake Teacher nếu bạn cần
    }

    //  TEACHER → xử lý như verifyTeacher cũ
    Teacher teacher = teacherRepository.findByAccount(account)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

    if (!teacher.isApproved()) {
        throw new UnauthorizedException("Teacher is not approved");
    }

    if (course != null) {
        if (!Objects.equals(course.getTeacher().getId(), teacher.getId())) {
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
    @Audit(table = "course", action = AuditAction.INSERT)
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

        //create first version for course
        CourseVersion firstVersion = new CourseVersion();
        firstVersion.setVersionNumber(1);
        firstVersion.setStatus(CourseStatus.DRAFT);
        firstVersion.setTitle(newCourse.getTitle());
        firstVersion.setDescription(newCourse.getShortDescription());

        newCourse.addVersion(firstVersion);

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

    /**
     * Close course to prevent new enrollments
     *
     * Checks for active enrollments and logs warning.
     * TODO: Send notification to enrolled students about course closure.
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse closeCourse(Long id) {
        Course course = validateCourse(id);

        verifyTeacher(course);

        // Check if there are active enrollments
        long activeEnrollments = enrollmentRepository.countByCourseIdAndStatus(
                id, vn.uit.lms.shared.constant.EnrollmentStatus.ENROLLED);

        if (activeEnrollments > 0) {
            log.warn("Closing course {} with {} active enrollments. Students may need notification.",
                    id, activeEnrollments);
//             emailService.notifyStudentsAboutCourseClosure(course, activeEnrollments);
        }

        course.setIsClosed(true);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseDetailResponse openCourse(Long id) {
        Course course = validateCourse(id);

        verifyTeacher(course);

        course.setIsClosed(false);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    @Transactional
    @EnableSoftDeleteFilter
    @Audit(table = "courses", action = AuditAction.UPDATE)
    public CourseDetailResponse updateCourse(Long id, CourseUpdateRequest courseUpdateRequest) {

        Course oldCourse = validateCourse(id);

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

    /**
     * Delete course (soft delete)
     *
     * TODO: Implement enrollment validation before deletion
     * - Check if course has any enrollments (active or completed)
     * - Query: enrollmentRepository.existsByCourse(course)
     * - Prevent deletion if there are active enrollments
     * - For completed enrollments, consider archiving instead of deleting
     * - Send notifications to affected students if any
     * - Handle certificate records for completed students
     * - Consider cascading effects on progress, assignments, etc.
     */
    @Transactional
    @EnableSoftDeleteFilter
    @Audit(table = "courses", action = AuditAction.DELETE)
    public void deleteCourse(Long id) {
        Course course = validateCourse(id);

        if(course.getVersionPublish() != null) {
            throw new InvalidRequestException("Course has published version, cannot delete");
        }


         boolean hasEnrollments = enrollmentRepository.existsByCourse(course);
         if (hasEnrollments) {
             long activeCount = enrollmentRepository.countByCourseAndStatus(course, EnrollmentStatus.ENROLLED);
             long completedCount = enrollmentRepository.countByCourseAndStatus(course, EnrollmentStatus.COMPLETED);
             throw new InvalidRequestException(
                 String.format("Cannot delete course with enrollments: %d active, %d completed",
                               activeCount, completedCount)
             );
         }

        verifyTeacher(course);

        //check course had closed
        if(course.getIsClosed().equals(Boolean.FALSE)) {
            throw new InvalidRequestException("Course is must closed before delete");
        }

        courseRepository.delete(course);
    }

    @Transactional
    @Audit(table = "courses", action = AuditAction.RESTORE)
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

    @Transactional
    @EnableSoftDeleteFilter
    @Audit(table = "courses", action = AuditAction.UPDATE)
    public CourseDetailResponse uploadCourseThumbnail(Long courseId, org.springframework.web.multipart.MultipartFile file) {
        // Validate course exists
        Course course = validateCourse(courseId);

        // Verify teacher owns the course
        verifyTeacher(course);

        // Validate file
        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("File is required");
        }

        // Validate file size
        if (file.getSize() > maxThumbnailSizeBytes) {
            throw new InvalidRequestException(
                String.format("File size exceeds maximum allowed size of %d bytes", maxThumbnailSizeBytes)
            );
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !allowedThumbnailContentTypes.contains(contentType)) {
            throw new InvalidRequestException(
                String.format("Invalid file type. Allowed types: %s", String.join(", ", allowedThumbnailContentTypes))
            );
        }

        // Upload to Cloudinary
        CloudinaryStorageService.UploadResult result = cloudinaryStorageService.uploadCourseThumbnail(
                file,
                courseId,
                course.getThumbnailPublicId()
        );

        // Update course with new thumbnail URL and public ID
        course.setThumbnailUrl(result.getUrl());
        course.setThumbnailPublicId(result.getPublicId());

        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toCourseDetailResponse(savedCourse);
    }

    // ========== PUBLIC API METHODS ==========

    /**
     * Get course entity by slug for internal use
     */
    @Transactional(readOnly = true)
    @EnableSoftDeleteFilter
    public Course getCourseEntityBySlug(String slug) {
        return courseRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));
    }

    /**
     * Get all courses that have at least one published version
     * For public access - no authentication required
     */
    @Transactional(readOnly = true)
    @EnableSoftDeleteFilter
    public PageResponse<CourseResponse> getPublishedCourses(Specification<Course> spec, Pageable pageable) {
        // Create specification to filter courses with published versions
        Specification<Course> publishedSpec = (root, query, cb) -> {
            var versionsJoin = root.join("versions");
            return cb.equal(versionsJoin.get("status"), CourseStatus.PUBLISHED);
        };

        // Combine with user's specification if provided
        Specification<Course> combinedSpec = spec != null ? spec.and(publishedSpec) : publishedSpec;

        Page<Course> coursePage = courseRepository.findAll(combinedSpec, pageable);
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

    /**
     * Get published course details by slug
     * Shows only published version information
     */
    @Transactional(readOnly = true)
    @EnableSoftDeleteFilter
    public CourseDetailResponse getPublishedCourseBySlug(String slug) {
        Course course = courseRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));

        // Verify course has a published version
        CourseVersion publishedVersion = course.getVersionPublish();
        if (publishedVersion == null) {
            throw new ResourceNotFoundException("No published version available for this course");
        }

        return CourseMapper.toCourseDetailResponse(course);
    }

    /**
     * Search published courses with filters
     * Supports: text search, category filter, difficulty filter, tag filter
     */
    @Transactional(readOnly = true)
    @EnableSoftDeleteFilter
    public PageResponse<CourseResponse> searchPublishedCourses(
            String query,
            Long categoryId,
            String difficulty,
            String tags,
            Pageable pageable
    ) {
        Specification<Course> spec = (root, criteriaQuery, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            // Must have published version
            var versionsJoin = root.join("versions");
            predicates.add(cb.equal(versionsJoin.get("status"), CourseStatus.PUBLISHED));

            // Text search in title and short description
            if (query != null && !query.isBlank()) {
                String searchPattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), searchPattern),
                        cb.like(cb.lower(root.get("shortDescription")), searchPattern)
                ));
            }

            // Category filter
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            // Difficulty filter
            if (difficulty != null && !difficulty.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("difficulty"),
                        vn.uit.lms.shared.constant.Difficulty.valueOf(difficulty.toUpperCase())));
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid difficulty filter value: {}", difficulty);
                }
            }

            // Tag filter
            if (tags != null && !tags.isBlank()) {
                String[] tagNames = tags.split(",");
                var courseTagsJoin = root.join("courseTags");
                var tagJoin = courseTagsJoin.join("tag");
                predicates.add(tagJoin.get("name").in((Object[]) tagNames));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Course> coursePage = courseRepository.findAll(spec, pageable);
        List<CourseResponse> items = coursePage.getContent().stream()
                .map(CourseMapper::toCourseResponse)
                .distinct() // Remove duplicates from joins
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
