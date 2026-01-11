package vn.uit.lms.core.domain.assignment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "submission_files")
@Getter
@Setter
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

    /**
     * Validate submission file
     */
    public void validate() {
        if (submission == null) {
            throw new IllegalStateException("Submission is required");
        }
        if (file == null) {
            throw new IllegalStateException("File is required");
        }
    }

    /**
     * Check if file belongs to a specific submission
     */
    public boolean belongsToSubmission(Long submissionId) {
        return submission != null && submission.getId().equals(submissionId);
    }

    /**
     * Get file name
     */
    public String getFileName() {
        return file != null ? file.getOriginalName() : null;
    }

    /**
     * Get file size in bytes
     */
    public Long getFileSizeBytes() {
        return file != null ? file.getSizeBytes() : null;
    }

    /**
     * Get file size in MB
     */
    public Double getFileSizeMB() {
        return file != null ? file.getSizeInMB() : null;
    }

    /**
     * Get file extension
     */
    public String getFileExtension() {
        return file != null ? file.getFileExtension() : null;
    }

    /**
     * Check if file is a document
     */
    public boolean isDocument() {
        return file != null && file.isDocument();
    }

    /**
     * Check if file is an image
     */
    public boolean isImage() {
        return file != null && file.isImage();
    }
}
