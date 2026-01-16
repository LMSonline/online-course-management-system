package vn.uit.lms.controller.course.content;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.service.course.content.FileStorageService;
import vn.uit.lms.shared.constant.StorageProvider;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;
import vn.uit.lms.shared.annotation.ApiMessage;
import vn.uit.lms.shared.annotation.Authenticated;
import vn.uit.lms.shared.annotation.TeacherOrAdmin;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "File Storage Management", description = "APIs for managing file uploads and downloads")
@SecurityRequirement(name = "bearerAuth")
@Authenticated
public class FileStorageController {

    private final FileStorageService fileStorageService;

    @Operation(
        summary = "Upload file",
        description = "Upload a file to storage. Automatically determines storage provider based on file type."
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("File uploaded successfully")
    public ResponseEntity<FileStorageResponse> uploadFile(
            @Parameter(description = "File to upload", required = true)
            @RequestParam("file") MultipartFile file,

            @Parameter(description = "Folder path for organizing files")
            @RequestParam(required = false) String folderPath,

            @Parameter(description = "Storage provider (MINIO/CLOUDINARY, auto-detect if not specified)")
            @RequestParam(required = false) StorageProvider storageProvider
    ) {
        FileStorageResponse response = fileStorageService.uploadFile(file, folderPath, storageProvider);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Get file details",
        description = "Retrieve file storage information by ID"
    )
    @GetMapping("/{id}")
    @ApiMessage("File details retrieved successfully")
    public ResponseEntity<FileStorageResponse> getFileStorage(
            @Parameter(description = "File storage ID", required = true)
            @PathVariable Long id
    ) {
        FileStorageResponse response = fileStorageService.getFileStorage(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get download URL",
        description = "Generate a presigned URL for downloading the file (valid for specified duration)"
    )
    @GetMapping("/{id}/download")
    @ApiMessage("Download URL generated successfully")
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            @Parameter(description = "File storage ID", required = true)
            @PathVariable Long id,

            @Parameter(description = "URL expiry time in seconds")
            @RequestParam(defaultValue = "3600") int expirySeconds
    ) {
        String downloadUrl = fileStorageService.generateDownloadUrl(id, expirySeconds);
        return ResponseEntity.ok(Map.of("downloadUrl", downloadUrl));
    }

    @Operation(
        summary = "Get file with download URL",
        description = "Get file details along with a presigned download URL"
    )
    @GetMapping("/{id}/details")
    @ApiMessage("File details with download URL retrieved successfully")
    public ResponseEntity<FileStorageResponse> getFileStorageWithDownloadUrl(
            @Parameter(description = "File storage ID", required = true)
            @PathVariable Long id,

            @Parameter(description = "URL expiry time in seconds")
            @RequestParam(defaultValue = "3600") int expirySeconds
    ) {
        FileStorageResponse response = fileStorageService.getFileStorageWithDownloadUrl(id, expirySeconds);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Delete file",
        description = "Delete a file from storage and database"
    )
    @DeleteMapping("/{id}")
    @ApiMessage("File deleted successfully")
    @TeacherOrAdmin
    public ResponseEntity<Void> deleteFile(
            @Parameter(description = "File storage ID", required = true)
            @PathVariable Long id
    ) {
        fileStorageService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}

