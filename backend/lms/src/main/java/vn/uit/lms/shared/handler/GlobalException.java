package vn.uit.lms.shared.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.uit.lms.shared.constant.ErrorCode;
import vn.uit.lms.shared.dto.ApiResponse;
import java.util.List;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors;

/**
 * Global exception handler for REST API.
 * All exceptions will be returned as JSON with ApiResponse structure.
 */
@RestControllerAdvice
public class GlobalException {

    private static final Logger log = LoggerFactory.getLogger(GlobalException.class);

    /**
     * Handle validation errors when @Valid/@Validated fails
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationError(MethodArgumentNotValidException ex) {
        // Extract field errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        // Log validation errors
        log.warn("Validation failed: {}", errors);

        // Build ApiResponse to return
        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(Boolean.FALSE);
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join("; ", errors));
        res.setCode(ErrorCode.VALIDATION_ERROR);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    /**
     * Handle all unhandled exceptions
     * Return 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllException(Exception ex) {
        // Log full stack trace for debugging
        log.error("Unhandled exception occurred", ex);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(Boolean.FALSE);
        res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage("Internal server error: " + ex.getMessage());
        res.setCode(ErrorCode.INTERNAL_ERROR);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }

    /**
     * Handle constraint violations (e.g., @Validated on method parameters)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .collect(Collectors.toList());

        log.warn("Constraint violation: {}", errors);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(Boolean.FALSE);
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join("; ", errors));
        res.setCode(ErrorCode.VALIDATION_ERROR);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}

