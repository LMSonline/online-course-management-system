package vn.uit.lms.service.course.content;

import org.springframework.stereotype.Service;

/**
 * Service for managing lesson resources (attachments, supplementary materials)
 *
 * TODO: Implement complete lesson resource management
 *
 * Required Entities:
 * - LessonResource entity (id, lesson, resourceType, title, description, fileUrl, fileSize, mimeType, orderIndex, isRequired, createdAt, updatedAt)
 * - ResourceType enum (PDF, DOCUMENT, SLIDE, CODE, LINK, ARCHIVE, OTHER)
 *
 * Required Methods:
 * 1. addResourceToLesson(Long lessonId, LessonResourceRequest request, MultipartFile file)
 *    - Validate lesson exists and is editable
 *    - Verify teacher owns the course
 *    - Validate file type and size
 *    - Upload file to storage using FileStorageService
 *    - Save resource metadata to database
 *    - Set appropriate order index
 *
 * 2. getLessonResources(Long lessonId) - Get all resources for a lesson
 *    - Check user has access to lesson (enrolled or teacher)
 *    - Return ordered list of resources
 *    - Include download URLs
 *
 * 3. getResourceById(Long lessonId, Long resourceId) - Get specific resource details
 *    - Validate access permissions
 *    - Return resource with presigned download URL
 *
 * 4. updateResource(Long lessonId, Long resourceId, LessonResourceRequest request)
 *    - Validate teacher ownership
 *    - Validate lesson is editable (draft/rejected version)
 *    - Update title, description, isRequired flag
 *    - Allow file replacement if new file provided
 *
 * 5. deleteResource(Long lessonId, Long resourceId)
 *    - Validate teacher ownership
 *    - Validate lesson is editable
 *    - Delete file from storage
 *    - Remove database record
 *    - Reorder remaining resources
 *
 * 6. reorderResources(Long lessonId, List<Long> resourceIds)
 *    - Update order indices based on provided list
 *    - Validate all resource IDs belong to the lesson
 *
 * 7. downloadResource(Long lessonId, Long resourceId)
 *    - Verify student is enrolled in course
 *    - Generate presigned download URL
 *    - Track download statistics
 *    - Log download activity
 *
 * 8. bulkUploadResources(Long lessonId, List<MultipartFile> files)
 *    - Upload multiple resources at once
 *    - Validate total size limit
 *    - Return list of created resources
 *
 * 9. getResourceStatistics(Long lessonId)
 *    - Count total downloads per resource
 *    - Track student access patterns
 *    - Generate resource usage report
 *
 * Business Logic:
 * - Limit maximum number of resources per lesson (e.g., 20)
 * - Limit total size of resources per lesson (e.g., 500MB)
 * - Support different resource types with appropriate icons
 * - Allow marking resources as required/optional
 * - Track student downloads for completion tracking
 * - Support external links as resources (YouTube, GitHub, etc.)
 * - Generate thumbnails for PDF/image resources
 * - Support resource versioning (when updating files)
 *
 * Integration Requirements:
 * - FileStorageService for file operations
 * - LessonService to validate lesson access
 * - ChapterService to validate course version
 * - CourseService to verify teacher ownership
 * - EnrollmentService to verify student access
 */
@Service
public class LessonResourceService {

    // TODO: Inject dependencies
    // private final LessonResourceRepository lessonResourceRepository;
    // private final LessonService lessonService;
    // private final FileStorageService fileStorageService;
    // private final CourseService courseService;

    // TODO: Add configuration
    // @Value("${app.lesson.max-resources}")
    // private int maxResourcesPerLesson;
    //
    // @Value("${app.lesson.max-resource-size-mb}")
    // private long maxTotalResourceSizeMB;

    // TODO: Implement methods listed above
}


