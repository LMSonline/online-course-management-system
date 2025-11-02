package vn.uit.lms.shared.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import org.springframework.stereotype.Component;

/**
 * Utility class for generating Cloudinary image URLs.
 * Provides methods to generate thumbnails with custom or default dimensions.
 */
@Component
public class CloudinaryUtils {

    private final Cloudinary cloudinary;

    /**
     * Constructor injection of Cloudinary instance.
     *
     * @param cloudinary the Cloudinary instance configured for the application
     */
    public CloudinaryUtils(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Generates a thumbnail URL for a given Cloudinary image with specified width and height.
     *
     * @param publicId the public ID of the image in Cloudinary
     * @param width    the width of the thumbnail
     * @param height   the height of the thumbnail
     * @return the generated thumbnail URL
     */
    public String getThumbnailUrl(String publicId, int width, int height) {
        return cloudinary.url()
                .transformation(new Transformation().width(width).height(height).crop("fill"))
                .generate(publicId);
    }

    /**
     * Generates a thumbnail URL with default dimensions of 200x200.
     *
     * @param publicId the public ID of the image in Cloudinary
     * @return the generated thumbnail URL
     */
    public String getThumbnailUrl(String publicId) {
        return getThumbnailUrl(publicId, 200, 200);
    }
}
