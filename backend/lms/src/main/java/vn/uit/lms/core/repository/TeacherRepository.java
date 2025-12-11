package vn.uit.lms.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Teacher;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long>, JpaSpecificationExecutor<Teacher> {

    Optional<Teacher> findByAccount(Account account);

    @Query("SELECT t FROM Teacher t JOIN FETCH t.account WHERE t.id = :id")
    Optional<Teacher> findByIdWithAccount(@Param("id") Long id);

    @Query("SELECT t FROM Teacher t JOIN FETCH t.account WHERE t.teacherCode = :code")
    Optional<Teacher> findByTeacherCodeWithAccount(@Param("code") String code);

    Optional<Teacher> findByTeacherCode(String teacherCode);
}
