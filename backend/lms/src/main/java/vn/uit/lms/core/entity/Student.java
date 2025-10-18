package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(length = 50, unique = true)
    private String studentCode;

    @Column(nullable = false, length = 255)
    private String fullName;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 30)
    private String phone;

    @Column(length = 512)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
