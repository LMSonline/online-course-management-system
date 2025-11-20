package vn.uit.lms.service.course;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.event.CourseVersionStatusChangeEvent;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.course.CourseVersionRequest;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CourseVersionMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;


import java.util.List;

@Service
public class CourseVersionService {

    private final CourseVersionRepository courseVersionRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;
    private final AccountService accountService;
    private final ApplicationEventPublisher eventPublisher;

    public CourseVersionService(CourseVersionRepository courseVersionRepository,
                                CourseRepository courseRepository,
                                CourseService courseService,
                                AccountService accountService,
                                ApplicationEventPublisher eventPublisher) {
        this.courseVersionRepository = courseVersionRepository;
        this.courseRepository = courseRepository;
        this.courseService = courseService;
        this.accountService = accountService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public CourseVersionResponse createCourseVersion(Long courseId, CourseVersionRequest request) {

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

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
        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    public List<CourseVersionResponse> getDeletedCourseVersions(Long courseId){
        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNotNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    @EnableSoftDeleteFilter
    public CourseVersionResponse getCourseVersionById(Long courseId, Long versionId){

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse submitCourseVersionToApprove(Long courseId, Long versionId) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

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

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        accountService.validateCurrentAccount(Role.ADMIN);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found or has remove with id: " + versionId));

        if(version.getStatus()!=CourseStatus.PENDING){
            throw new InvalidRequestException("Course version is not PENDING");
        }

        version.setStatus(CourseStatus.APPROVED);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse rejectCourseVersion(Long courseId, Long versionId, RejectRequest rejectRequest){

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        accountService.validateCurrentAccount(Role.ADMIN);

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



}
