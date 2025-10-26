package vn.uit.lms.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import vn.uit.lms.shared.constant.ErrorCode;
import vn.uit.lms.shared.dto.ApiResponse;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

/**
 * Custom authentication entry point for handling unauthorized access attempts.
 * <p>
 * This component intercepts unauthorized requests (HTTP 401) and returns
 * a structured JSON response instead of the default HTML or plain text response.
 * </p>
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    /**
     * Default delegate for handling Bearer token authentication errors.
     */
    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();

    /**
     * ObjectMapper used for serializing error responses into JSON.
     */
    private final ObjectMapper mapper;

    /**
     * Constructs a {@code CustomAuthenticationEntryPoint} with the specified {@link ObjectMapper}.
     *
     * @param mapper the Jackson ObjectMapper used for writing JSON responses
     */
    public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    /**
     * Handles authentication exceptions by returning a standardized JSON error response.
     * <p>
     * Invoked when a user attempts to access a secured endpoint without a valid token.
     * The response includes details such as HTTP status, error message, code, timestamp, and success flag.
     * </p>
     *
     * @param request       the HTTP request that resulted in an authentication exception
     * @param response      the HTTP response to send the error details
     * @param authException the authentication exception that caused the entry point to be triggered
     * @throws IOException      if an input or output error occurs while writing the response
     * @throws ServletException if an internal servlet error occurs
     */
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
        // Delegate to the default Bearer token handler
        this.delegate.commence(request, response, authException);
        response.setContentType("application/json;charset=UTF-8");

        // Build a standardized API response for unauthorized access
        ApiResponse<Object> res = new ApiResponse<>();
        res.setStatus(HttpStatus.UNAUTHORIZED.value());

        String errorMessage = Optional.ofNullable(authException.getCause())
                .map(Throwable::getMessage)
                .orElse(authException.getMessage());

        res.setMessage("Token is not valid: " + errorMessage);
        res.setCode(ErrorCode.UNAUTHORIZED);
        res.setSuccess(Boolean.FALSE);
        res.setTimestamp(Instant.now());

        // Write JSON error response to the output stream
        mapper.writeValue(response.getWriter(), res);
    }
}
