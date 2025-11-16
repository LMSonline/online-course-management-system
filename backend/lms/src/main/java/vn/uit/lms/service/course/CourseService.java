package vn.uit.lms.service.course;

import com.github.slugify.Slugify;
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
import vn.uit.lms.shared.dto.request.course.CourseRequest;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
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
    }


    private void createSeoData(Course course) {
        if(course.getMetaTitle()==null||course.getMetaTitle().isEmpty()){
            course.setMetaTitle(course.getTitle());
        }

        if(course.getMetaDescription()==null||course.getMetaDescription().isEmpty()) {
            String shortDesc = seoHelper.normalizeMetaDescription(course.getShortDescription());
            course.setMetaDescription(shortDesc);
        }

        course.setSlug(seoHelper.toSlug(course.getTitle()));
        course.setCanonicalUrl(seoHelper.generateCanonicalUrl(PREFIX_CANONICAL_URL, course.getSlug()));

        if(course.getSeoKeywords()==null||course.getSeoKeywords().isEmpty()) {
            List<String> tagNames = course.getCourseTags().stream()
                    .map(ct -> ct.getTag().getName())
                    .toList();
            List<String> keywords = seoHelper.autoKeywords(course.getTitle(), tagNames);
            course.setSeoKeywords(String.join(", ", keywords));
        }

    }

    @Transactional
    public CourseDetailResponse createCourse(CourseRequest courseRequest) {
        Course newCourse = new Course();
        newCourse.setTitle(courseRequest.getTitle());
        newCourse.setShortDescription(courseRequest.getShortDescription());

        Category category = this.categoryRepository.findByIdAndDeletedAtIsNull(courseRequest.getCategoryId())
                .orElseThrow(() -> new InvalidRequestException("Category not found"));
        newCourse.setCategory(category);

        String emailCurrentLogin = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Teacher teacher = this.teacherRepository.findById(courseRequest.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if(teacher.getAccount().getStatus()!= AccountStatus.ACTIVE){
            throw new UnauthorizedException("Account is not active");
        }

        if(!Objects.equals(teacher.getAccount().getEmail(), emailCurrentLogin)){
            throw new UnauthorizedException("Teacher does not match authenticated user");
        }

        newCourse.setTeacher(teacher);

        List<Tag> tags = courseRequest.getTags().stream().map(tagName -> {
            return tagRepository.findByNameIgnoreCaseAndDeletedAtIsNull(tagName).orElseThrow(() -> new InvalidRequestException("Tag not found: " + tagName));

        }).toList();

        List<CourseTag> courseTags = tags.stream()
                .map(tag -> {
                    CourseTag ct = new CourseTag();
                    ct.setCourse(newCourse);
                    ct.setTag(tag);
                    return ct;
                }).toList();

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

}
