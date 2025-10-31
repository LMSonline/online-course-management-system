package vn.uit.lms.shared.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * Utility for applying @JsonView dynamically at runtime.
 */
public final class JsonViewUtils {

    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private JsonViewUtils() {
        // prevent instantiation
    }

    public static Object applyView(Object data, Class<?> view) {
        if (data == null) return null;
        try {
            String json = mapper
                    .writerWithView(view)
                    .writeValueAsString(data);
            return mapper.readValue(json, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to apply JSON view: " + e.getMessage(), e);
        }
    }
}
