package vn.uit.lms.core.repository.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.course.Tag;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    boolean existsByNameIgnoreCaseAndDeletedAtIsNull(String name);
    boolean existsByNameIgnoreCaseAndIdNotAndDeletedAtIsNull(String name, Long id);
    Optional<Tag> findById(Long id);

    @Query(value = "SELECT * FROM tags", nativeQuery = true)
    Page<Tag> findAllIncludingDeleted(Pageable pageable);

    @Query(value = "SELECT * FROM tags c WHERE c.id = :id", nativeQuery = true)
    Optional<Tag> findByIdIncludingDeleted(@Param("id") Long id);

}
