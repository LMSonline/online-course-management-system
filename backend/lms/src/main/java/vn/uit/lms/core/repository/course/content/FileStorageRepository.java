package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.content.FileStorage;

@Repository
public interface FileStorageRepository extends JpaRepository<FileStorage, Long> {
}
