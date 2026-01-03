package vn.uit.lms.service.helper;

import com.github.slugify.Slugify;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Helper class for generating URL-friendly slugs from text
 */
@Component
public class SlugGenerator {

    private final Slugify slugify;

    public SlugGenerator() {
        this.slugify = Slugify.builder()
                .transliterator(true)
                .build();
    }

    /**
     * Generate a slug from the given text
     * @param text The text to slugify
     * @return URL-friendly slug
     */
    public String generate(String text) {
        if (text == null || text.isBlank()) {
            return UUID.randomUUID().toString();
        }

        String slug = slugify.slugify(text);

        // If slug is empty after slugification, use UUID
        if (slug.isBlank()) {
            return UUID.randomUUID().toString();
        }

        return slug;
    }

    /**
     * Generate a unique slug by appending a random suffix
     * @param text The text to slugify
     * @return Unique URL-friendly slug
     */
    public String generateUnique(String text) {
        String baseSlug = generate(text);
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8);
        return baseSlug + "-" + randomSuffix;
    }

    /**
     * Generate a slug with a numeric suffix
     * @param text The text to slugify
     * @param number The number to append
     * @return URL-friendly slug with number
     */
    public String generateWithNumber(String text, int number) {
        String baseSlug = generate(text);
        return baseSlug + "-" + number;
    }
}

