package vn.uit.lms.core.domain.course.content;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.StorageProvider;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "file_storages", indexes = {
        @Index(name = "idx_storage_key", columnList = "storage_key"),
        @Index(name = "idx_storage_provider", columnList = "storage_provider")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileStorage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "storage_key", nullable = false, length = 512, unique = true)
    private String storageKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_provider", nullable = false, length = 20)
    private StorageProvider storageProvider;

    @Column(name = "original_name", nullable = false, length = 512)
    private String originalName;

    @Column(name = "mime_type", length = 128)
    private String mimeType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "checksum", length = 128)
    private String checksum;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;


    /**
     * Check if this is a video file
     */
    public boolean isVideo() {
        return mimeType != null && mimeType.startsWith("video/");
    }

    /**
     * Check if this is an image file
     */
    public boolean isImage() {
        return mimeType != null && mimeType.startsWith("image/");
    }

    /**
     * Check if this is a document file
     */
    public boolean isDocument() {
        return mimeType != null && (
                mimeType.equals("application/pdf") ||
                mimeType.startsWith("application/vnd.openxmlformats") ||
                mimeType.startsWith("application/msword")
        );
    }

    /**
     * Get file size in MB (formatted)
     */
    public double getSizeInMB() {
        return sizeBytes != null ? sizeBytes / (1024.0 * 1024.0) : 0.0;
    }

    /**
     * Get file extension from original name
     */
    public String getFileExtension() {
        if (originalName == null || !originalName.contains(".")) {
            return "";
        }
        return originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase();
    }
}
