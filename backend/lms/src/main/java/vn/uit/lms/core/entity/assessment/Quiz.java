package vn.uit.lms.core.entity.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.entity.course.content.Lesson;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Quiz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_points")
    private Double totalPoints;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "randomize_questions")
    private Boolean randomizeQuestions;

    @Column(name = "randomize_options")
    private Boolean randomizeOptions;

    @Column(name = "passing_score")
    private Double passingScore;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestion> quizQuestions;
}
