package vn.uit.lms.service.course;

import org.apache.coyote.BadRequestException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.event.CourseVersionStatusChangeEvent;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.course.CourseVersionRequest;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CourseVersionMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;


import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseVersionService {

    private final CourseVersionRepository courseVersionRepository;
    private final CourseService courseService;
    private final AccountService accountService;
    private final ApplicationEventPublisher eventPublisher;

    public CourseVersionService(CourseVersionRepository courseVersionRepository,
                                CourseService courseService,
                                AccountService accountService,
                                ApplicationEventPublisher eventPublisher) {
        this.courseVersionRepository = courseVersionRepository;
        this.courseService = courseService;
        this.accountService = accountService;
        this.eventPublisher = eventPublisher;
    }

    public CourseVersion validateVersionEditable(Long versionId){
        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        if (!version.isDraft() && !version.isRejected()) {
            throw new InvalidRequestException("Only draft or rejected versions can be modified.");
        }

        return version;
    }

    public boolean isAvailableVersion(Long versionId){
        return courseVersionRepository.existsByIdAndDeletedAtIsNull(versionId);
    }

    @Transactional
    public CourseVersionResponse createCourseVersion(Long courseId, CourseVersionRequest request) {

        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion newVersion = new CourseVersion();
        newVersion.setCourse(course);

        int nextVersionNumber = 1;
        if (!course.getVersions().isEmpty()) {
            CourseVersion lastVersion = course.getLastVersion();
            nextVersionNumber = lastVersion.getVersionNumber() + 1;

            newVersion.setPrice(lastVersion.getPrice());
            newVersion.setDurationDays(lastVersion.getDurationDays());
            newVersion.setPassScore(lastVersion.getPassScore());
            newVersion.setFinalWeight(lastVersion.getFinalWeight());
            newVersion.setMinProgressPct(lastVersion.getMinProgressPct());
            newVersion.setNotes(lastVersion.getNotes());
        }
        newVersion.setVersionNumber(nextVersionNumber);

        newVersion.setTitle(request.getTitle());
        newVersion.setDescription(request.getDescription());
        newVersion.setPrice(request.getPrice() != null ? request.getPrice() : newVersion.getPrice());
        newVersion.setDurationDays(request.getDurationDays() != null ? request.getDurationDays() : newVersion.getDurationDays());
        newVersion.setPassScore(request.getPassScore() != null ? request.getPassScore() : newVersion.getPassScore());
        newVersion.setFinalWeight(request.getFinalWeight() != null ? request.getFinalWeight() : newVersion.getFinalWeight());
        newVersion.setNotes(request.getNotes() != null ? request.getNotes() : newVersion.getNotes());
        newVersion.setStatus(CourseStatus.DRAFT);

        CourseVersion savedVersion = courseVersionRepository.save(newVersion);

        return CourseVersionMapper.toCourseVersionResponse(savedVersion);
    }

    @EnableSoftDeleteFilter
    public List<CourseVersionResponse> getCourseVersions(Long courseId){
        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    public List<CourseVersionResponse> getDeletedCourseVersions(Long courseId){
        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNotNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    @EnableSoftDeleteFilter
    public CourseVersionResponse getCourseVersionById(Long courseId, Long versionId){

        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse submitCourseVersionToApprove(Long courseId, Long versionId) {
        Course course =  courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));

        if(version.getStatus()!=CourseStatus.DRAFT){
            throw new InvalidRequestException("Course version is not DRAFT");
        }

        version.setStatus(CourseStatus.PENDING);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse approveCourseVersion(Long courseId, Long versionId){

        Course course =  courseService.validateCourse(courseId);

        Account account = accountService.validateCurrentAccountByRole(Role.ADMIN);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));

        if(version.getStatus()!=CourseStatus.PENDING && version.getStatus()!=CourseStatus.REJECTED){
            throw new InvalidRequestException("Course status invalid");
        }

        version.setStatus(CourseStatus.APPROVED);
        version.setApprovedBy(account.getEmail());
        version.setApprovedAt(Instant.now());

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse rejectCourseVersion(Long courseId, Long versionId, RejectRequest rejectRequest){

        Course course =  courseService.validateCourse(courseId);

        accountService.validateCurrentAccountByRole(Role.ADMIN);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));

        if(version.getStatus()!=CourseStatus.PENDING){
            throw new InvalidRequestException("Course version is not PENDING");
        }

        version.setStatus(CourseStatus.REJECTED);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, rejectRequest.getReason()));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse publishCourseVersion(Long courseId, Long versionId){

        Course course =  courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));

        if(version.getStatus()!=CourseStatus.APPROVED){
            throw new InvalidRequestException("Course version is not APPROVED");
        }

        version.setStatus(CourseStatus.PUBLISHED);
        version.setPublishedAt(Instant.now());

        CourseVersion publishedVersion = course.getVersionPublish();
        if(publishedVersion!=null){
            publishedVersion.setStatus(CourseStatus.ARCHIVED);
            courseVersionRepository.save(publishedVersion);
        }

        courseVersionRepository.save(version);


        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @EnableSoftDeleteFilter
    public PageResponse<CourseVersionResponse> getAllPendingCourseVersion(Specification<CourseVersion> spec, Pageable pageable){
        Specification<CourseVersion> pendingSpec =
                (root, query, cb) -> cb.equal(root.get("status"), CourseStatus.PENDING);

        // merge specification
        if (spec == null) {
            spec = pendingSpec;
        } else {
            spec = spec.and(pendingSpec);
        }

        // query
        Page<CourseVersion> page = courseVersionRepository.findAll(spec, pageable);

        // map items
        List<CourseVersionResponse> items = page.getContent()
                .stream()
                .map(CourseVersionMapper::toCourseVersionResponse)
                .toList();

        // return page response
        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

}
