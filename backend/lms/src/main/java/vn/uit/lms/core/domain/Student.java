package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.PersonBase;

/**
 * Student entity with Rich Domain Model - inherits profile behaviors from PersonBase
 */
@Entity
@Table(name = "students")
@Getter
@Setter // Keep for backward compatibility with existing code
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Student extends PersonBase implements BaseProfile{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(name = "student_code", length = 50, unique = true)
    private String studentCode;

    // Student-specific behaviors can be added here as needed

}
