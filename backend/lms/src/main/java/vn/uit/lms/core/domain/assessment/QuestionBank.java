package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "question_banks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuestionBank extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "questionBank", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    /**
     * Validate question bank
     */
    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalStateException("Question bank name is required");
        }
    }

    /**
     * Check if teacher owns this question bank
     */
    public boolean isOwnedBy(Long teacherId) {
        return teacher != null && teacher.getId().equals(teacherId);
    }

    /**
     * Check if teacher owns this question bank
     */
    public boolean isOwnedBy(Teacher teacher) {
        return teacher != null && isOwnedBy(teacher.getId());
    }

    /**
     * Add question to bank
     */
    public void addQuestion(Question question) {
        if (questions == null) {
            questions = new ArrayList<>();
        }
        question.setQuestionBank(this);
        questions.add(question);
    }

    /**
     * Remove question from bank
     */
    public void removeQuestion(Question question) {
        if (questions != null) {
            questions.remove(question);
            question.setQuestionBank(null);
        }
    }

    /**
     * Get number of questions in bank
     */
    public int getQuestionCount() {
        return questions != null ? questions.size() : 0;
    }

    /**
     * Check if bank has questions
     */
    public boolean hasQuestions() {
        return getQuestionCount() > 0;
    }

    /**
     * Check if bank is empty
     */
    public boolean isEmpty() {
        return !hasQuestions();
    }
}
