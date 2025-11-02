package vn.uit.lms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.shared.exception.UploadFileException;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryStorageService {

    private final static Logger log = LoggerFactory.getLogger(CloudinaryStorageService.class);
    private final Cloudinary cloudinary;

    @Value("${app.avatar.folder}")
    private String baseFolder;

    public UploadResult uploadAvatar(MultipartFile file, Long userId, String existingPublicId) {
        try {
            String publicId = String.format("user_%d_avatar", userId);

            Map<String, Object> options = ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", baseFolder,
                    "overwrite", true,
                    "resource_type", "image",
                    "quality", "auto",
                    "fetch_format", "auto"
            );

            // Upload (bytes)
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), options);

            String secureUrl = (String) result.get("secure_url");
            String uploadedPublicId = (String) result.get("public_id");

            // Return both url and public id
            return new UploadResult(secureUrl, uploadedPublicId);

        } catch (IOException e) {
            throw new UploadFileException("Failed to upload to Cloudinary");
        } catch (Exception e) {
            throw new UploadFileException("Cloudinary upload error: " + e.getMessage());
        }
    }

    public void deleteByPublicId(String publicId) {
        if (publicId == null || publicId.isBlank()) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception ex) {
            // Log but do not rethrow to avoid breaking user flow
            log.error("Failed to delete Cloudinary resource with publicId {}: {}", publicId, ex.getMessage());
        }
    }

    public static class UploadResult {
        private final String url;
        private final String publicId;
        public UploadResult(String url, String publicId) { this.url = url; this.publicId = publicId; }
        public String getUrl() { return url; }
        public String getPublicId() { return publicId; }
    }


}

