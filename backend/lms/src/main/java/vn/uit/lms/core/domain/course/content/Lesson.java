package vn.uit.lms.core.domain.course.content;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.LessonType;
import vn.uit.lms.shared.constant.VideoStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lessons", indexes = {
        @Index(name = "idx_lesson_chapter", columnList = "chapter_id, order_index"),
        @Index(name = "idx_lesson_type", columnList = "type"),
        @Index(name = "idx_video_status", columnList = "video_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 20, nullable = false)
    private LessonType type;

    @Column(name = "title", nullable = false, length = 512)
    private String title;

    @Column(name = "short_description", length = 2048)
    private String shortDescription;

    @Column(name = "video_object_key", length = 512)
    private String videoObjectKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "video_status", length = 20)
    private VideoStatus videoStatus;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "is_preview", nullable = false)
    @Builder.Default
    private Boolean isPreview = false;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LessonResource> resources = new ArrayList<>();


    public boolean isVideoLesson() {
        return type == LessonType.VIDEO;
    }


    public boolean isVideoReady() {
        return isVideoLesson()
                && videoObjectKey != null
                && videoStatus == VideoStatus.READY;
    }

    /**
     * Check if video is still processing
     */
    public boolean isVideoProcessing() {
        return isVideoLesson()
                && videoStatus != null
                && videoStatus.isInProgress();
    }

    /**
     * Check if video processing failed
     */
    public boolean isVideoFailed() {
        return isVideoLesson()
                && videoStatus == VideoStatus.FAILED;
    }

    /**
     * Mark video as uploaded (waiting for processing)
     *
     * Business rule: Can only set for VIDEO type lessons
     */
    public void markVideoUploaded(String objectKey) {
        if (!isVideoLesson()) {
            throw new IllegalStateException("Cannot set video for non-VIDEO lesson type");
        }
        this.videoObjectKey = objectKey;
        this.videoStatus = VideoStatus.UPLOADED;
    }

    /**
     * Mark video as processing
     */
    public void markVideoProcessing() {
        if (!isVideoLesson()) {
            throw new IllegalStateException("Cannot process video for non-VIDEO lesson type");
        }
        if (videoStatus != VideoStatus.UPLOADED) {
            throw new IllegalStateException("Video must be UPLOADED before PROCESSING");
        }
        this.videoStatus = VideoStatus.PROCESSING;
    }

    /**
     * Mark video as ready with duration
     *
     * @param durationSeconds Video duration extracted from file
     */
    public void markVideoReady(Integer durationSeconds) {
        if (!isVideoLesson()) {
            throw new IllegalStateException("Cannot set video ready for non-VIDEO lesson type");
        }
        if (videoStatus != VideoStatus.PROCESSING) {
            throw new IllegalStateException("Video must be PROCESSING before READY");
        }
        this.videoStatus = VideoStatus.READY;
        this.durationSeconds = durationSeconds;
    }

    /**
     * Mark video processing as failed
     */
    public void markVideoFailed() {
        if (!isVideoLesson()) {
            throw new IllegalStateException("Cannot mark video failed for non-VIDEO lesson type");
        }
        this.videoStatus = VideoStatus.FAILED;
    }

    /**
     * Add a resource to this lesson
     *
     * AGGREGATE PATTERN: Thêm resource phải qua aggregate root
     */
    public void addResource(LessonResource resource) {
        if (resource == null) {
            throw new IllegalArgumentException("Resource cannot be null");
        }
        resource.setLesson(this);
        this.resources.add(resource);
    }

    /**
     * Remove a resource from this lesson
     */
    public void removeResource(LessonResource resource) {
        if (resource != null) {
            this.resources.remove(resource);
            resource.setLesson(null);
        }
    }

    /**
     * Get formatted duration (HH:MM:SS)
     */
    public String getFormattedDuration() {
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

    /**
     * Get total downloadable resources count
     */
    public long getDownloadableResourcesCount() {
        return resources.stream()
                .filter(LessonResource::isDownloadable)
                .count();
    }

    /**
     * Validate lesson constraints
     *
     * Business rules:
     * - VIDEO lesson should have videoObjectKey (if uploaded)
     * - Non-VIDEO lesson should not have video fields
     *
     * NOTE: Validation moved to service layer to avoid @PrePersist conflict with BaseEntity
     * Use this method in service before persisting
     */
    public void validateLesson() {
        // Validate video-specific fields
        if (!isVideoLesson()) {
            if (videoObjectKey != null || videoStatus != null) {
                throw new IllegalStateException(
                    "Non-VIDEO lesson should not have video-specific fields"
                );
            }
        }

        // Ensure orderIndex is not null
        if (orderIndex == null) {
            orderIndex = 0;
        }

        // Ensure isPreview is not null
        if (isPreview == null) {
            isPreview = false;
        }
    }

    /**
     * Update lesson basic information
     */
    public void updateBasicInfo(String title, String shortDescription, Boolean isPreview) {
        if (title != null && !title.isBlank()) {
            this.title = title;
        }
        this.shortDescription = shortDescription;
        if (isPreview != null) {
            this.isPreview = isPreview;
        }
    }

    /**
     * Update lesson type
     * Business rule: Cannot change type if video is already uploaded
     */
    public void updateType(LessonType newType) {
        if (this.type == LessonType.VIDEO && newType != LessonType.VIDEO) {
            if (this.videoObjectKey != null) {
                throw new IllegalStateException("Cannot change type from VIDEO when video is already uploaded");
            }
        }
        this.type = newType;

        // Clear video fields if changing away from VIDEO type
        if (newType != LessonType.VIDEO) {
            this.videoObjectKey = null;
            this.videoStatus = null;
            this.durationSeconds = null;
        }
    }

    /**
     * Clear video data when deleting video
     */
    public void clearVideoData() {
        this.videoObjectKey = null;
        this.videoStatus = null;
        this.durationSeconds = null;
    }

    /**
     * Update order index
     */
    public void updateOrderIndex(Integer newOrderIndex) {
        if (newOrderIndex != null && newOrderIndex >= 0) {
            this.orderIndex = newOrderIndex;
        }
    }
}
