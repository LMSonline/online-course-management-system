package vn.uit.lms.shared.dto.response.storage;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.StorageProvider;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for file storage information")
public class FileStorageResponse {

    @Schema(description = "File storage ID", example = "1")
    private Long id;

    @Schema(description = "Storage key/path", example = "resources/documents/uuid.pdf")
    private String storageKey;

    @Schema(description = "Storage provider", example = "MINIO")
    private StorageProvider storageProvider;

    @Schema(description = "Original filename", example = "lecture-notes.pdf")
    private String originalName;

    @Schema(description = "MIME type", example = "application/pdf")
    private String mimeType;

    @Schema(description = "File size in bytes", example = "2048576")
    private Long sizeBytes;

    @Schema(description = "Formatted file size", example = "2.0 MB")
    private String formattedSize;

    @Schema(description = "File extension", example = "pdf")
    private String fileExtension;

    @Schema(description = "Download URL (presigned if MinIO)", example = "https://...")
    private String downloadUrl;

    @Schema(description = "Checksum for integrity verification")
    private String checksum;

    @Schema(description = "Whether this is a video file")
    private Boolean isVideo;

    @Schema(description = "Whether this is an image file")
    private Boolean isImage;

    @Schema(description = "Whether this is a document file")
    private Boolean isDocument;

    @Schema(description = "Upload timestamp")
    private Instant createdAt;
}

