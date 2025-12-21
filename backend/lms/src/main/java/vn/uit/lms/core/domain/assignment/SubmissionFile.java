package vn.uit.lms.core.domain.assignment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "submission_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class SubmissionFile extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private FileStorage file;
}
