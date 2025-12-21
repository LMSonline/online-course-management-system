package vn.uit.lms.core.domain.learning;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE certificates SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class Certificate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 128)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "final_score")
    private Float finalScore;

    @Column(name = "grade", length = 50)
    private String grade;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSON")
    private Map<String, Object> metadata;

    @Column(name = "is_revoked", nullable = false)
    @Builder.Default
    private Boolean isRevoked = false;

    @Column(name = "revoke_reason", columnDefinition = "TEXT")
    private String revokeReason;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "revoked_by")
    private String revokedBy;

    @Column(name = "expires_at")
    private Instant expiresAt;

    protected void onCreate() {
        super.onCreate();
        if (this.code == null) {
            String date = LocalDate.now().toString().replace("-", "");
            String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            this.code = "CERT-" + date + "-" + uuid;
        }

        if (this.issuedAt == null) {
            this.issuedAt = Instant.now();
        }
    }

    public void revoke(String reason, String revokedBy) {
        if (this.isRevoked) {
            throw new IllegalStateException("Already revoked");
        }

        this.isRevoked = true;
        this.revokeReason = reason;
        this.revokedBy = revokedBy;
        this.revokedAt = Instant.now();
    }

    public void restore() {
        if (!this.isRevoked) {
            throw new IllegalStateException("Certificate not revoked");
        }

        this.isRevoked = false;
        this.revokeReason = null;
        this.revokedBy = null;
        this.revokedAt = null;
    }

    public boolean isValid() {
        if (this.isRevoked) return false;
        return this.expiresAt == null || Instant.now().isBefore(this.expiresAt);
    }

    public void calculateGrade(float passScore) {
        if (this.finalScore == null) return;

        if (this.finalScore >= 9.0f) {
            this.grade = "EXCELLENT";
        } else if (this.finalScore >= 8.0f) {
            this.grade = "GOOD";
        } else if (this.finalScore >= passScore) {
            this.grade = "PASS";
        } else {
            this.grade = "FAIL";
        }
    }

    public void addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }
}
