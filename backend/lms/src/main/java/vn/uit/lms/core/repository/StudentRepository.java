package vn.uit.lms.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    Optional<Student> findByAccount(Account account);

    Optional<Student> findByStudentCode(String studentCode);

    @Query("SELECT s FROM Student s JOIN FETCH s.account WHERE s.id = :id")
    Optional<Student> findByIdWithAccount(@Param("id") Long id);

    @Query("SELECT s FROM Student s JOIN FETCH s.account WHERE s.studentCode = :code")
    Optional<Student> findByStudentCodeWithAccount(@Param("code") String code);
}
