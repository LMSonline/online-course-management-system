package vn.uit.lms.core.domain.course.content;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chapters", indexes = {
        @Index(name = "idx_chapter_course_version", columnList = "course_version_id, order_index")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Column(name = "title", nullable = false, length = 512)
    private String title;

    @Column(name = "description", length = 2048)
    private String description;

    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<Lesson> lessons = new ArrayList<>();

    public int getTotalLessons() {
        return lessons.size();
    }

    public int getTotalDuration() {
        return lessons.stream()
                .filter(Lesson::isVideoLesson)
                .map(Lesson::getDurationSeconds)
                .filter(duration -> duration != null && duration > 0)
                .mapToInt(Integer::intValue)
                .sum();
    }

    public String getFormattedTotalDuration() {
        int totalSeconds = getTotalDuration();
        if (totalSeconds == 0) {
            return "00:00";
        }

        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;
        int seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }

    public long getReadyVideoLessonsCount() {
        return lessons.stream()
                .filter(Lesson::isVideoReady)
                .count();
    }

    public long countLessonsByType(vn.uit.lms.shared.constant.LessonType type) {
        return lessons.stream()
                .filter(lesson -> lesson.getType() == type)
                .count();
    }

    public void addLesson(Lesson lesson) {
        if (lesson == null) {
            throw new IllegalArgumentException("Lesson cannot be null");
        }
        lesson.setChapter(this);

        // Auto-assign order if not set
        if (lesson.getOrderIndex() == null || lesson.getOrderIndex() < 0) {
            lesson.setOrderIndex(lessons.size());
        }

        this.lessons.add(lesson);
    }

    public void removeLesson(Lesson lesson) {
        if (lesson != null) {
            this.lessons.remove(lesson);
            lesson.setChapter(null);

            // Reorder remaining lessons
            reorderLessons();
        }
    }

    public void reorderLessons() {
        for (int i = 0; i < lessons.size(); i++) {
            lessons.get(i).setOrderIndex(i);
        }
    }

    public void moveLessonToPosition(Lesson lesson, int newIndex) {
        if (!lessons.contains(lesson)) {
            throw new IllegalArgumentException("Lesson not found in this chapter");
        }

        if (newIndex < 0 || newIndex >= lessons.size()) {
            throw new IllegalArgumentException("Invalid position: " + newIndex);
        }

        // Remove and re-insert at new position
        lessons.remove(lesson);
        lessons.add(newIndex, lesson);

        // Reorder all lessons
        reorderLessons();
    }

    public Lesson getLessonByOrderIndex(int orderIndex) {
        return lessons.stream()
                .filter(lesson -> lesson.getOrderIndex() == orderIndex)
                .findFirst()
                .orElse(null);
    }

    public boolean hasPreviewLessons() {
        return lessons.stream()
                .anyMatch(Lesson::getIsPreview);
    }

    public long getPreviewLessonsCount() {
        return lessons.stream()
                .filter(Lesson::getIsPreview)
                .count();
    }

    public void validateChapter() {
        // Ensure orderIndex is not null
        if (orderIndex == null) {
            orderIndex = 0;
        }

        // Validate title is not empty
        if (title == null || title.isBlank()) {
            throw new IllegalStateException("Chapter title is required");
        }
    }
}
