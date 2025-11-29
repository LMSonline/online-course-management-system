package vn.uit.lms.core.entity.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuizAttempt extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "attempt_number")
    private Integer attemptNumber;

    @Enumerated(EnumType.STRING)
    private QuizAttemptStatus status;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL)
    private List<QuizAttemptAnswer> answers;
}
