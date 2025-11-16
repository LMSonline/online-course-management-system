package vn.uit.lms.service.helper;

import java.util.List;

public interface SEOHelper {
    String toSlug(String input);
    String generateCanonicalUrl(String prefix, String slug);
    String normalizeMetaDescription(String desc);
    List<String> autoKeywords(String title, List<String> tags);
}

