package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.entity.PersonBase;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Student extends PersonBase implements BaseProfile{

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(name = "student_code", length = 50, unique = true)
    private String studentCode;


}
