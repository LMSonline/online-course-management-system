package vn.uit.lms.shared.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.util.annotation.ApiMessage;

import java.time.Instant;

/**
 * Global response formatter for all REST controllers.
 * <p>
 * This advice automatically wraps all successful responses
 * into a standardized {@link ApiResponse} structure, ensuring
 * consistent API output format across the application.
 * </p>
 */
@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    /**
     * Determines whether this advice is applicable to a given controller method.
     *
     * @param returnType    the method return type
     * @param converterType the converter used for serialization
     * @return true to apply this advice to all REST responses
     */
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    /**
     * Intercepts controller responses before they are written to the HTTP body.
     * <p>
     * - Automatically wraps normal responses into {@link ApiResponse}.<br>
     * - Skips wrapping for existing {@link ApiResponse}, String responses, or error responses.
     * </p>
     *
     * @param body                  the response body from controller
     * @param returnType            the return type of the controller method
     * @param selectedContentType   the selected content type
     * @param selectedConverterType the converter type
     * @param request               the current HTTP request
     * @param response              the current HTTP response
     * @return the formatted {@link ApiResponse} or the original response body
     */
    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();
        ApiMessage apiMessage = returnType.getMethodAnnotation(ApiMessage.class);
        String messageFromAnnotation = apiMessage != null ? apiMessage.value() : null;

        // Skip wrapping if already formatted or not suitable (e.g., String or ApiResponse)
        if (body instanceof ApiResponse<?> || body instanceof String) {
            return body;
        }

        // Skip wrapping for error responses (status >= 400)
        if (response.getHeaders().containsKey("error") || status >= 400) {
            return body;
        }

        // Wrap body into standardized ApiResponse structure
        return ApiResponse.builder()
                .success(true)
                .status(status)
                .code(resolveCode(status))
                .message(resolveMessage(status) + ": " + (messageFromAnnotation != null ? messageFromAnnotation : ""))
                .data(body)
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("© 2025 Group 5 / VN.UIT.LMS")
                        .license("Proprietary API – All rights reserved")
                        .version("v1.0.0")
                        .build())
                .build();
    }

    /**
     * Maps HTTP status codes to standard response code strings.
     */
    private String resolveCode(int status) {
        HttpStatus httpStatus = HttpStatus.resolve(status);
        if (httpStatus == null) {
            return "UNKNOWN";
        }

        return switch (httpStatus) {
            case OK -> "SUCCESS";
            case CREATED -> "CREATED";
            case NO_CONTENT -> "NO_CONTENT";
            case BAD_REQUEST -> "BAD_REQUEST";
            case UNAUTHORIZED -> "UNAUTHORIZED";
            case FORBIDDEN -> "FORBIDDEN";
            case NOT_FOUND -> "NOT_FOUND";
            case CONFLICT -> "CONFLICT";
            case INTERNAL_SERVER_ERROR -> "INTERNAL_ERROR";
            case SERVICE_UNAVAILABLE -> "SERVICE_UNAVAILABLE";
            default -> httpStatus.name();
        };
    }

    /**
     * Maps HTTP status codes to readable messages.
     */
    private String resolveMessage(int status) {
        HttpStatus httpStatus = HttpStatus.resolve(status);
        if (httpStatus == null) {
            return "Unknown status";
        }

        return switch (httpStatus) {
            case OK -> "Request processed successfully";
            case CREATED -> "Resource created successfully";
            case NO_CONTENT -> "No content";
            case BAD_REQUEST -> "Invalid request parameters";
            case UNAUTHORIZED -> "Authentication required";
            case FORBIDDEN -> "Access denied";
            case NOT_FOUND -> "Resource not found";
            case CONFLICT -> "Conflict detected";
            case INTERNAL_SERVER_ERROR -> "Internal server error";
            case SERVICE_UNAVAILABLE -> "Service temporarily unavailable";
            default -> httpStatus.getReasonPhrase();
        };
    }
}
