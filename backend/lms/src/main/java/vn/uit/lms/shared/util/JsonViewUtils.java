package vn.uit.lms.shared.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.HttpStatus;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.view.Views;

import java.time.Instant;

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

    public static ApiResponse<Object> formatAccountProfileResponse(AccountProfileResponse response) {
        Class<?> view = switch (response.getRole()) {
            case STUDENT -> Views.Student.class;
            case TEACHER -> Views.Teacher.class;
            case ADMIN -> Views.Admin.class;
        };

        // Use JsonViewUtils for clean filtering
        Object filteredData = JsonViewUtils.applyView(response, view);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(true);
        res.setStatus(HttpStatus.OK.value());
        res.setCode("SUCCESS");
        res.setMessage("Request processed successfully");
        res.setData(filteredData);
        res.setTimestamp(Instant.now());

        return res;
    }
}
