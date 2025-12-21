package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Storage provider types for file storage abstraction
 * Follows infrastructure independence principle - domain doesn't care about storage impl
 *
 * Allows switching between cloud providers without domain logic changes
 * Production LMS systems use multiple providers for redundancy/cost optimization
 */
@Schema(description = "Cloud storage provider types")
public enum StorageProvider {

    @Schema(description = "Cloudinary object storage")
    CLOUDINARY,

    @Schema(description = "MinIO object storage")
    MINIO,

    @Schema(description = "Amazon S3")
    S3,

    @Schema(description = "Google Cloud Storage")
    GCS,

    @Schema(description = "Azure Blob Storage")
    AZURE_BLOB,

    @Schema(description = "Local file system (dev/testing only)")
    LOCAL;



    /**
     * Check if provider is cloud-based
     */
    public boolean isCloudProvider() {
        return this != LOCAL;
    }

    /**
     * Check if provider supports CDN integration
     */
    public boolean supportsCDN() {
        return this == S3 || this == GCS || this == AZURE_BLOB;
    }
}

