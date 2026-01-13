package vn.uit.lms.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.uit.lms.shared.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Catch all unhandled exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(
            Exception ex,
            HttpServletRequest request
    ) {

        //  BYPASS JSON WRAP FOR DOWNLOAD FILE
        if (request.getRequestURI().contains("/download")) {
            throw new RuntimeException(ex);
        }

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(
                "INTERNAL_ERROR",
                ex.getMessage()
            ));
    }
}
