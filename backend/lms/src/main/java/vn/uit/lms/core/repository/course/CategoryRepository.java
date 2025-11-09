package vn.uit.lms.core.repository.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.course.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByCodeAndDeletedAtIsNull(String code);
    boolean existsByCodeAndIdNotAndDeletedAtIsNull(String code, Long id);
    List<Category> findAllByParentIsNullAndVisibleTrueOrderByNameAsc();

    @Query(value = "SELECT * FROM categories WHERE deleted_at IS NOT NULL ORDER BY created_at DESC", nativeQuery = true)
    List<Category> findAllDeleted();



    @Query(value = "SELECT * FROM categories c WHERE c.id = :id", nativeQuery = true)
    Optional<Category> findByIdIncludingDeleted(@Param("id") Long id);


}
