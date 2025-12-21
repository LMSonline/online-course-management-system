package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.PersonBase;
import vn.uit.lms.shared.exception.InvalidStatusException;
import vn.uit.lms.shared.exception.UnauthorizedException;

import java.time.Instant;

/**
 * Teacher entity with Rich Domain Model - encapsulates teacher-specific business logic
 */
@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends PersonBase implements BaseProfile{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(name = "teacher_code", unique = true, length = 50)
    private String teacherCode;

    @Column(length = 255)
    private String specialty;

    @Column(length = 128)
    private String degree;

    @Column(nullable = false)
    private boolean approved = false;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectReason;


    /**
     * Validate teacher is approved for actions
     */
    public void requireApproved() {
        if (!this.approved) {
            throw new UnauthorizedException("Teacher is not approved");
        }
    }

    /**
     * Approve teacher by admin
     */
    public void approve(Long adminId) {
        if (this.approvedBy != null) {
            throw new InvalidStatusException("Teacher already approved");
        }
        this.approved = true;
        this.approvedAt = Instant.now();
        this.approvedBy = adminId;
        this.rejectReason = null;

        this.account.activate();
    }

    /**
     * Reject teacher by admin with reason
     */
    public void reject(Long adminId, String reason) {
        this.approved = false;
        this.approvedAt = Instant.now();
        this.approvedBy = adminId;
        this.rejectReason = reason;
    }

    /**
     * Check if teacher has been reviewed (approved or rejected)
     */
    public boolean hasBeenReviewed() {
        return this.approvedBy != null && this.approvedAt != null;
    }

    /**
     * Check if teacher is pending approval
     */
    public boolean isPendingApproval() {
        return !this.approved && !hasBeenReviewed();
    }

}