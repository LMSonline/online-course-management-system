package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.entity.PersonBase;

import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends PersonBase implements BaseProfile{

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

}