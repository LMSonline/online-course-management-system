package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.constant.Gender;

import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(name = "teacher_code", unique = true, length = 50)
    private String teacherCode;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 30)
    private String phone;

    @Column(length = 255)
    private String specialty;

    @Column(length = 128)
    private String degree;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false)
    private boolean approved = false;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;
}