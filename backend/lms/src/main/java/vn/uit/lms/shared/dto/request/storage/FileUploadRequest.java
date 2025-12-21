package vn.uit.lms.shared.dto.request.storage;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.shared.constant.StorageProvider;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for uploading a file")
public class FileUploadRequest {

    @NotNull(message = "File is required")
    @Schema(description = "File to upload", requiredMode = Schema.RequiredMode.REQUIRED)
    private MultipartFile file;

    @Schema(description = "Storage provider (auto-detect if not provided)", example = "MINIO")
    private StorageProvider storageProvider;

    @Schema(description = "Folder path for organizing files", example = "resources/pdfs")
    private String folderPath;

    @Schema(description = "Custom filename (optional, auto-generated if not provided)")
    private String customFileName;

    @Schema(description = "Additional metadata in JSON format")
    private String metadata;
}

