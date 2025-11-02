package vn.uit.lms.shared.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.uit.lms.shared.constant.ErrorCode;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.exception.*;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global exception handler for REST APIs.
 * Converts exceptions into structured ApiResponse JSON format.
 */
@RestControllerAdvice
public class GlobalException {

    private static final Logger log = LoggerFactory.getLogger(GlobalException.class);

    /**
     * Handle common business-related exceptions such as duplicate or invalid credentials.
     */
    @ExceptionHandler(value = {
            DuplicateResourceException.class,
            UsernameNotFoundException.class,
            EmailAlreadyUsedException.class,
            UsernameAlreadyUsedException.class,
            BadCredentialsException.class,
            InvalidTokenException.class,
            ResourceNotFoundException.class,
            UserNotActivatedException.class,
            HttpMessageNotReadableException.class,
            InvalidPasswordException.class,
            InvalidFileException.class,
            UploadFileException.class,
            InvalidStatusException.class,
            InvalidRequestException.class,
    })
    public ResponseEntity<ApiResponse<Object>> handleBusinessExceptions(Exception ex) {
        log.warn("Business exception: {}", ex.getMessage());

        ApiResponse<Object> res = new ApiResponse<>();
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setSuccess(false);
        res.setCode(ErrorCode.BAD_REQUEST);
        res.setMessage("Exception occurred: " + ex.getMessage());
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    /**
     * Handle validation errors when @Valid or @Validated fails on request body.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationError(MethodArgumentNotValidException ex) {
        // Collect field-specific validation errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        log.warn("Validation failed: {}", errors);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join("; ", errors));
        res.setCode(ErrorCode.VALIDATION_ERROR);
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    /**
     * Handle violations raised by @Validated on method parameters.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .collect(Collectors.toList());

        log.warn("Constraint violation: {}", errors);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join("; ", errors));
        res.setCode(ErrorCode.VALIDATION_ERROR);
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    /**
     * Handle unexpected/unhandled exceptions and return HTTP 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex) {
        log.error("Unhandled exception occurred", ex);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage("Internal server error: " + ex.getMessage());
        res.setCode(ErrorCode.INTERNAL_ERROR);
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }

    /**
     * Handle unauthorized access (401)
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(UnauthorizedException ex) {
        log.warn("Unauthorized access: {}", ex.getMessage());

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setMessage(ex.getMessage());
        res.setCode(ErrorCode.UNAUTHORIZED);
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    /**
     * Handle forbidden access (403)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Forbidden access: {}", ex.getMessage());

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.setMessage(ex.getMessage());
        res.setCode(ErrorCode.FORBIDDEN);
        res.setTimestamp(Instant.now());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }


}
