package vn.uit.lms.core.entity.course.content;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "file_storages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileStorage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "storage_key", nullable = false, length = 512)
    private String storageKey;

    @Column(name = "original_name", length = 512)
    private String originalName;

    @Column(name = "mime_type", length = 128)
    private String mimeType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(columnDefinition = "JSON")
    private String metadata;
}
