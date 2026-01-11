package vn.uit.lms.core.repository.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByCodeAndDeletedAtIsNull(String code);
    boolean existsByCodeAndIdNotAndDeletedAtIsNull(String code, Long id);
    List<Category> findAllByParentIsNull();
    List<Category> findAllByParentIsNullAndDeletedAtIsNotNull();
    Optional<Category> findByIdAndDeletedAtIsNull(Long id);
    Optional<Category> findByIdAndDeletedAtIsNotNull(Long id);
    boolean existsBySlugAndDeletedAtIsNull(String slug);
    boolean existsBySlugAndIdNotAndDeletedAtIsNull(String slug, Long id);
    Optional<Category> findBySlugAndDeletedAtIsNull(String slug);
    List<Category> findByVisibleTrueAndDeletedAtIsNull();

}
