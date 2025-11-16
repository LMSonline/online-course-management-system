package vn.uit.lms.service.helper;

import com.github.slugify.Slugify;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SEOHelperImpl implements SEOHelper {

    private final Slugify slugify = Slugify.builder()
            .customReplacement("đ", "d")
            .customReplacement("Đ", "D")
            .build();

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public String toSlug(String input) {
        if (input == null || input.isBlank()) return "";
        return slugify.slugify(input);
    }

    @Override
    public String generateCanonicalUrl(String prefix, String slug) {
        if (slug == null || slug.isBlank()) return frontendUrl;

        String base = frontendUrl;
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);

        // đảm bảo prefix bắt đầu bằng /
        if (!prefix.startsWith("/")) prefix = "/" + prefix;

        return base + prefix + "/" + slug;
    }


    @Override
    public String normalizeMetaDescription(String desc) {
        if (desc == null) return "";

        desc = desc.strip();

        if (desc.length() > 160) {
            desc = desc.substring(0, 157) + "...";
        }

        return desc.replaceAll("\\s+", " ");
    }

    @Override
    public List<String> autoKeywords(String title, List<String> tags) {
        if (title == null) title = "";

        List<String> titleWords = Arrays.stream(title.split(" "))
                .filter(w -> w.length() > 3)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        if (tags != null) {
            List<String> lowerTags = tags.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());
            titleWords.addAll(lowerTags);
        }

        return titleWords.stream().distinct().collect(Collectors.toList());
    }
}

