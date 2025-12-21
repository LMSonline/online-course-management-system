package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.shared.constant.StorageProvider;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileStorageRepository extends JpaRepository<FileStorage, Long> {

    Optional<FileStorage> findByStorageKey(String storageKey);

    List<FileStorage> findByStorageProvider(StorageProvider provider);

    boolean existsByStorageKey(String storageKey);

    @Query("SELECT f FROM FileStorage f WHERE f.createdBy = :userId ORDER BY f.createdAt DESC")
    List<FileStorage> findByUploadedUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM FileStorage f WHERE f.storageProvider = :provider")
    long countByProvider(@Param("provider") StorageProvider provider);

    @Query("SELECT SUM(f.sizeBytes) FROM FileStorage f WHERE f.storageProvider = :provider")
    Long getTotalSizeByProvider(@Param("provider") StorageProvider provider);
}

